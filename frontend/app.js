// ------------------------------
// 1) Formulaire : Créer une commande
// ------------------------------

const createOrderForm = document.getElementById("createOrderForm");
const createResult = document.getElementById("createResult");

createOrderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.getElementById("userId").value;
    const deliveryAddress = document.getElementById("deliveryAddress").value;
    const restaurantId = document.getElementById("restaurantId").value;
    const itemsInput = document.getElementById("itemsInput").value;

    const items = itemsInput.split("\n").map(line => {
        const [name, qty, price] = line.split(",");
        return {
            name: name.trim(),
            qty: Number(qty),
            price: Number(price)
        };
    });

    const orderData = {
        userId: userId,
        items: items,
        deliveryAddress: deliveryAddress,
        restaurantId: restaurantId
    };

    try {
        const response = await fetch("http://localhost:8000/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        createResult.innerHTML = `
            <p><strong>${data.message}</strong></p>
            <p>Order ID : ${data.orderId}</p>
        `;

    } catch (error) {
        createResult.innerHTML = "<p style='color:red;'>Erreur lors de la création de la commande.</p>";
        console.error(error);
    }
});


// ------------------------------
// 2) Formulaire : Voir les commandes d’un utilisateur (avec actions)
// ------------------------------

const getUserOrdersForm = document.getElementById("getUserOrdersForm");
const ordersList = document.getElementById("ordersList");

getUserOrdersForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.getElementById("searchUserId").value;
    await loadUserOrders(userId);
});


// Fonction pour charger les commandes d’un user
async function loadUserOrders(userId) {
    try {
        const response = await fetch(`http://localhost:8000/orders/user/${userId}`);
        const data = await response.json();
        const orders = data.orders;

        if (orders.length === 0) {
            ordersList.innerHTML = "<p>Aucune commande trouvée.</p>";
            return;
        }

        let html = "<h3>Commandes trouvées :</h3>";

        orders.forEach(order => {
            html += `
                <div class="order-card">
                    <p><strong>Order ID :</strong> ${order.orderId}</p>
                    <p><strong>Status :</strong> ${order.status}</p>
                    <p><strong>Total :</strong> ${order.totalAmount} €</p>
                    <p><strong>Restaurant :</strong> ${order.restaurantId}</p>
                    <p><strong>Date :</strong> ${order.createdAt}</p>

                    <button onclick="markDelivered('${order.orderId}', '${order.userId}')">
                        Marquer comme DELIVERED
                    </button>

                    <button onclick="deleteOrder('${order.orderId}', '${order.userId}')"
                            style="background:red;color:white;">
                        Supprimer
                    </button>

                    <hr>
                </div>
            `;
        });

        ordersList.innerHTML = html;

    } catch (error) {
        ordersList.innerHTML = "<p style='color:red;'>Erreur lors du chargement des commandes.</p>";
        console.error(error);
    }
}


// ------------------------------
// 2.1) PUT : Marquer comme DELIVERED
// ------------------------------

async function markDelivered(orderId, userId) {
    try {
        await fetch(`http://localhost:8000/orders/${orderId}?new_status=DELIVERED`, {
            method: "PUT"
        });

        loadUserOrders(userId);

    } catch (error) {
        alert("Erreur lors de la mise à jour du statut.");
        console.error(error);
    }
}


// ------------------------------
// 2.2) DELETE : Supprimer une commande
// ------------------------------

async function deleteOrder(orderId, userId) {
    try {
        await fetch(`http://localhost:8000/orders/${orderId}`, {
            method: "DELETE"
        });

        loadUserOrders(userId);

    } catch (error) {
        alert("Erreur lors de la suppression.");
        console.error(error);
    }
}


// ------------------------------
// 3) Formulaire : Voir une commande par ID
// ------------------------------

const getOrderByIdForm = document.getElementById("getOrderByIdForm");
const singleOrder = document.getElementById("singleOrder");

getOrderByIdForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const orderId = document.getElementById("searchOrderId").value;

    try {
        const response = await fetch(`http://localhost:8000/orders/${orderId}`);
        const order = await response.json();

        if (order.message === "Order not found") {
            singleOrder.innerHTML = "<p>Aucune commande trouvée.</p>";
            return;
        }

        let html = `
            <h3>Détails de la commande</h3>
            <p><strong>User ID :</strong> ${order.userId}</p>
            <p><strong>Status :</strong> ${order.status}</p>
            <p><strong>Total :</strong> ${order.totalAmount} €</p>
            <p><strong>Adresse :</strong> ${order.deliveryAddress}</p>
            <p><strong>Restaurant :</strong> ${order.restaurantId}</p>
            <p><strong>Date :</strong> ${order.createdAt}</p>

            <h4>Items :</h4>
            <ul>
        `;

        order.items.forEach(item => {
            html += `
                <li>
                    ${item.name} — ${item.qty} × ${item.price} €
                </li>
            `;
        });

        html += "</ul>";

        singleOrder.innerHTML = html;

    } catch (error) {
        singleOrder.innerHTML = "<p style='color:red;'>Erreur lors de la récupération de la commande.</p>";
        console.error(error);
    }
});
