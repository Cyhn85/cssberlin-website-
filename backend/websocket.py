# backend/websocket.py
"""
CSS Berlin — WebSocket Manager for Real-time Negotiation
Real-time updates for offers, notifications, and chat
"""

from fastapi import WebSocket, WebSocketDisconnect, Depends
from typing import Dict, List, Optional
import json
import asyncio
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import User, Offer, OfferNotification
from auth import get_current_user

class ConnectionManager:
    """WebSocket connection manager for real-time updates"""
    
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}
        self.user_connections: Dict[WebSocket, int] = {}
    
    async def connect(self, websocket: WebSocket, user_id: int):
        """Accept connection and register user"""
        await websocket.accept()
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        
        self.active_connections[user_id].append(websocket)
        self.user_connections[websocket] = user_id
        
        print(f"✅ User {user_id} connected via WebSocket")
        
        # Send pending notifications
        await self.send_pending_notifications(user_id, websocket)
    
    async def disconnect(self, websocket: WebSocket):
        """Remove connection and cleanup"""
        user_id = self.user_connections.get(websocket)
        
        if user_id and user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        
        if websocket in self.user_connections:
            del self.user_connections[websocket]
        
        print(f"❌ User {user_id} disconnected from WebSocket")
    
    async def send_personal_message(self, user_id: int, message: dict):
        """Send message to specific user"""
        if user_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    disconnected.append(connection)
            
            # Remove dead connections
            for conn in disconnected:
                await self.disconnect(conn)
    
    async def send_pending_notifications(self, user_id: int, websocket: WebSocket):
        """Send unread notifications to newly connected user"""
        # This would be implemented with actual database queries
        pass
    
    async def broadcast_to_users(self, user_ids: List[int], message: dict):
        """Send message to multiple users"""
        for user_id in user_ids:
            await self.send_personal_message(user_id, message)

# Global connection manager
manager = ConnectionManager()

async def get_websocket_user(websocket: WebSocket, token: str, db: AsyncSession) -> User:
    """Authenticate WebSocket connection"""
    try:
        # Import JWT decode function from auth.py
        from auth import SECRET_KEY, ALGORITHM
        import jwt
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            await websocket.close(code=4001, reason="Invalid token")
            return None
            
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user:
            await websocket.close(code=4002, reason="User not found")
            return None
            
        return user
    except Exception as e:
        await websocket.close(code=4003, reason=f"Auth error: {str(e)}")
        return None

# WebSocket endpoint for real-time negotiations
async def websocket_endpoint(
    websocket: WebSocket,
    token: str,
    db: AsyncSession = Depends(get_db)
):
    """Main WebSocket endpoint for real-time updates"""
    
    # Authenticate user
    user = await get_websocket_user(websocket, token, db)
    if not user:
        return
    
    # Connect to manager
    await manager.connect(websocket, user.id)
    
    try:
        while True:
            # Listen for client messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            await handle_websocket_message(user.id, message, db)
            
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        await manager.disconnect(websocket)

async def handle_websocket_message(user_id: int, message: dict, db: AsyncSession):
    """Handle incoming WebSocket messages"""
    
    message_type = message.get("type")
    
    if message_type == "ping":
        # Heartbeat response
        await manager.send_personal_message(user_id, {
            "type": "pong",
            "timestamp": datetime.utcnow().isoformat()
        })
    
    elif message_type == "typing":
        # User is typing in negotiation
        target_user_id = message.get("target_user_id")
        if target_user_id:
            await manager.send_personal_message(target_user_id, {
                "type": "user_typing",
                "user_id": user_id,
                "timestamp": datetime.utcnow().isoformat()
            })
    
    elif message_type == "mark_notifications_read":
        # Mark notifications as read
        notification_ids = message.get("notification_ids", [])
        if notification_ids:
            from sqlalchemy import update
            await db.execute(
                update(OfferNotification)
                .where(OfferNotification.id.in_(notification_ids))
                .where(OfferNotification.user_id == user_id)
                .values(is_read=True)
            )
            await db.commit()

# Helper functions for real-time updates
async def notify_offer_created(offer_id: int, seller_id: int):
    """Notify seller about new offer"""
    await manager.send_personal_message(seller_id, {
        "type": "new_offer",
        "offer_id": offer_id,
        "timestamp": datetime.utcnow().isoformat()
    })

async def notify_offer_updated(offer_id: int, buyer_id: int, seller_id: int, status: str):
    """Notify both parties about offer status change"""
    message = {
        "type": "offer_updated",
        "offer_id": offer_id,
        "status": status,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    await manager.broadcast_to_users([buyer_id, seller_id], message)

async def notify_counter_offer(offer_id: int, buyer_id: int, seller_id: int):
    """Notify about counter offer"""
    message = {
        "type": "counter_offer",
        "offer_id": offer_id,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    await manager.broadcast_to_users([buyer_id, seller_id], message)

# Export manager for use in other modules
connection_manager = manager
