

# ============== ADMIN ENDPOINTS ==============

@app.get("/api/admin/users", response_model=List[UserResponse])
async def get_all_users(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """Get all users (admin only)"""
    # TODO: Add admin role check
    result = await db.execute(select(User).offset(skip).limit(limit))
    users = result.scalars().all()
    return users

@app.get("/api/admin/products", response_model=List[ProductResponse])
async def get_all_products(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """Get all products (admin only)"""
    # TODO: Add admin role check
    result = await db.execute(select(Product).offset(skip).limit(limit))
    products = result.scalars().all()
    return products

@app.get("/api/admin/orders", response_model=List[OrderResponse])
async def get_all_orders(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """Get all orders (admin only)"""
    # TODO: Add admin role check
    result = await db.execute(select(Order).offset(skip).limit(limit))
    orders = result.scalars().all()
    return orders
