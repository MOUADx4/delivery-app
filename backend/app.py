from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from decimal import Decimal
from models import OrderCreate
from dynamodb_client import orders_table

app = FastAPI()

# -------------------------------------------------
# CORS (obligatoire pour que le frontend fonctionne)
# -------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # simple pour un projet étudiant
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Petite fonction pour convertir les floats en Decimal
def decimalize(value):
    return Decimal(str(value))


# -----------------------------
# 1) Créer une commande
# -----------------------------
@app.post("/orders")
def create_order(order: OrderCreate):
    total = sum(item.qty * item.price for item in order.items)
    order_id = f"ORDER#{int(datetime.utcnow().timestamp())}"
    now = datetime.utcnow().isoformat()

    items = []
    for i in order.items:
        items.append({
            "name": i.name,
            "qty": i.qty,
            "price": decimalize(i.price)
        })

    item = {
        "userId": order.userId,
        "orderId": order_id,
        "status": "PENDING",
        "items": items,
        "totalAmount": decimalize(total),
        "deliveryAddress": order.deliveryAddress,
        "restaurantId": order.restaurantId,
        "createdAt": now,
        "updatedAt": now
    }

    orders_table.put_item(Item=item)

    return {"message": "Order created", "orderId": order_id}


# -----------------------------
# 2) Récupérer toutes les commandes d'un utilisateur
# -----------------------------
@app.get("/orders/user/{user_id}")
def get_orders_by_user(user_id: str):
    response = orders_table.query(
        KeyConditionExpression="userId = :uid",
        ExpressionAttributeValues={":uid": user_id}
    )

    return {
        "userId": user_id,
        "orders": response.get("Items", [])
    }


# -----------------------------
# 3) Récupérer une commande précise via son orderId
# -----------------------------
@app.get("/orders/{order_id}")
def get_order_by_id(order_id: str):
    response = orders_table.scan(
        FilterExpression="orderId = :oid",
        ExpressionAttributeValues={":oid": order_id}
    )

    items = response.get("Items", [])

    if not items:
        return {"message": "Order not found"}

    return items[0]


# -----------------------------
# 4) Mettre à jour le statut d'une commande
# -----------------------------
@app.put("/orders/{order_id}")
def update_order_status(order_id: str, new_status: str):
    allowed_status = ["PENDING", "ACCEPTED", "IN_PROGRESS", "DELIVERED"]

    if new_status not in allowed_status:
        return {"message": "Invalid status", "allowed": allowed_status}

    response = orders_table.scan(
        FilterExpression="orderId = :oid",
        ExpressionAttributeValues={":oid": order_id}
    )

    items = response.get("Items", [])

    if not items:
        return {"message": "Order not found"}

    order = items[0]
    order["status"] = new_status
    order["updatedAt"] = datetime.utcnow().isoformat()

    orders_table.put_item(Item=order)

    return {
        "message": "Order updated",
        "orderId": order_id,
        "newStatus": new_status
    }


# -----------------------------
# 5) Supprimer une commande
# -----------------------------
@app.delete("/orders/{order_id}")
def delete_order(order_id: str):
    response = orders_table.scan(
        FilterExpression="orderId = :oid",
        ExpressionAttributeValues={":oid": order_id}
    )

    items = response.get("Items", [])

    if not items:
        return {"message": "Order not found"}

    order = items[0]

    orders_table.delete_item(
        Key={
            "userId": order["userId"],
            "orderId": order["orderId"]
        }
    )

    return {
        "message": "Order deleted",
        "orderId": order_id
    }
