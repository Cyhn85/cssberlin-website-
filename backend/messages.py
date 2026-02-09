from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_, desc
from database import get_db
from models import Message, User, Product
from auth import get_current_user
from schemas import MessageCreate, MessageResponse
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/messages", tags=["Messages"])

class ConversationUser(BaseModel):
    id: int
    first_name: str
    last_name: str
    profile_picture: Optional[str] = None

class ConversationPreview(BaseModel):
    user: ConversationUser
    last_message: str
    last_message_time: datetime
    unread_count: int
    product_id: Optional[int] = None
    product_name: Optional[str] = None
    product_image: Optional[str] = None

@router.get("/conversations", response_model=List[ConversationPreview])
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a list of conversations for the current user.
    Grouped by the other user involved.
    """
    # This acts as a simple grouping. In a real heavy app, we might want a separate Conversation model.
    # For now, we query distinct users referenced in messages where current_user is sender or receiver.
    
    # 1. Get all messages involving the user
    stmt = select(Message).where(
        or_(
            Message.sender_id == current_user.id,
            Message.receiver_id == current_user.id
        )
    ).order_by(Message.created_at.desc())
    
    result = await db.execute(stmt)
    messages = result.scalars().all()
    
    conversations_map = {}
    
    for msg in messages:
        other_id = msg.receiver_id if msg.sender_id == current_user.id else msg.sender_id
        
        if other_id not in conversations_map:
            conversations_map[other_id] = {
                "user_id": other_id,
                "last_message": msg.content,
                "last_message_time": msg.created_at,
                "unread_count": 0,
                "product_id": msg.product_id,
                "messages": []
            }
        
        # Count unread messages SENT TO current_user
        if msg.receiver_id == current_user.id and not msg.is_read:
             conversations_map[other_id]["unread_count"] += 1
             
    # Now fetch user details and product details for these conversations
    conversation_list = []
    
    for other_id, data in conversations_map.items():
        # Fetch User
        user_res = await db.execute(select(User).where(User.id == other_id))
        other_user = user_res.scalar_one_or_none()
        
        if not other_user:
            continue
            
        # Fetch Product if exists (just from the latest message for preview)
        product_name = None
        product_image = None
        if data["product_id"]:
            prod_res = await db.execute(select(Product).where(Product.id == data["product_id"]))
            prod = prod_res.scalar_one_or_none()
            if prod:
                product_name = prod.name
                if prod.images and len(prod.images) > 0:
                    try:
                        import json
                        images = prod.images if isinstance(prod.images, list) else json.loads(prod.images)
                        product_image = images[0] if images else None
                    except:
                        pass

        conversation_list.append(ConversationPreview(
            user=ConversationUser(
                id=other_user.id,
                first_name=other_user.first_name,
                last_name=other_user.last_name,
                profile_picture=other_user.profile_picture
            ),
            last_message=data["last_message"],
            last_message_time=data["last_message_time"],
            unread_count=data["unread_count"],
            product_id=data["product_id"],
            product_name=product_name,
            product_image=product_image
        ))
        
    return conversation_list

@router.get("/{other_user_id}", response_model=List[MessageResponse])
async def get_messages(
    other_user_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all messages between current user and another user.
    """
    stmt = select(Message).where(
        or_(
            and_(Message.sender_id == current_user.id, Message.receiver_id == other_user_id),
            and_(Message.sender_id == other_user_id, Message.receiver_id == current_user.id)
        )
    ).order_by(Message.created_at.asc())
    
    result = await db.execute(stmt)
    messages = result.scalars().all()
    
    # Mark as read
    for msg in messages:
        if msg.receiver_id == current_user.id and not msg.is_read:
            msg.is_read = True
            
    await db.commit()
    
    return messages

@router.post("/", response_model=MessageResponse)
async def send_message(
    msg: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Send a message to another user.
    """
    # Verify receiver exists
    res = await db.execute(select(User).where(User.id == msg.receiver_id))
    receiver = res.scalar_one_or_none()
    if not receiver:
        raise HTTPException(status_code=404, detail="User not found")
        
    new_msg = Message(
        sender_id=current_user.id,
        receiver_id=msg.receiver_id,
        product_id=msg.product_id,
        content=msg.content,
        created_at=datetime.utcnow(),
        is_read=False,
        type="text"
    )
    
    db.add(new_msg)
    await db.commit()
    await db.refresh(new_msg)
    
    return new_msg
