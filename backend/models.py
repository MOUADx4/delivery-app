from pydantic import BaseModel
from typing import List

class OrderItem(BaseModel):
    name: str
    qty: int
    price: float

class OrderCreate(BaseModel):
    userId: str
    items: List[OrderItem]
    deliveryAddress: str
    restaurantId: str
