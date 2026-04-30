# Delivery App — API + Frontend (DynamoDB)
<div align="center">

<img src="https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/AWS-DynamoDB-4053D6?logo=amazonaws&logoColor=white" />
<img src="https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-orange" />
<img src="https://img.shields.io/badge/CORS-enabled-blue" />
<img src="https://img.shields.io/badge/Status-100%25%20fonctionnel-brightgreen" />

<br/>

Application réalisée dans le cadre du projet de base de données NoSQL.
Objectif : développer une application complète (API + frontend) permettant de gérer des commandes de livraison en temps réel.

</div>

------------------------------------------------------------------------


## Présentation
**Delivery App** est une application web complète développée dans le cadre d’un projet NoSQL.  
Elle permet de gérer des commandes de livraison en temps réel via une API backend et une interface frontend simple.

---

## Objectif du projet
- Concevoir une API REST performante
- Utiliser une base de données NoSQL (DynamoDB)
- Implémenter un frontend fonctionnel
- Manipuler des requêtes avancées (PK, SK, filtres)

---

## Architecture du projet

### Backend
- Python 3.12
- FastAPI
- Uvicorn
- Boto3 (AWS SDK)

### Frontend
- HTML
- CSS
- JavaScript

### Base de données
- AWS DynamoDB (modèle clé-valeur / document)

---

## Fonctionnalités principales

### API (FastAPI)
- Créer une commande
-  Lister les commandes d’un utilisateur
-  Obtenir une commande par ID
-  Mettre à jour le statut
-  Supprimer une commande
-  Endpoint `/debug` pour vérifier AWS

### Frontend
- Formulaire de création de commande
- Affichage des commandes d’un utilisateur
- Détails d’une commande
- Actions rapides (DELIVERED / DELETE)

---

## Modélisation DynamoDB

**Table : Orders**

| Attribut          | Type   | Description                         |
|------------------|--------|-------------------------------------|
| userId           | String | Partition Key (utilisateur)         |
| orderId          | String | Sort Key (commande)                 |
| status           | String | PENDING / IN_PROGRESS / DELIVERED   |
| items            | List   | Liste des produits                  |
| totalAmount      | Number | Montant total                       |
| deliveryAddress  | String | Adresse de livraison                |
| restaurantId     | String | Identifiant du restaurant           |
| createdAt        | String | Date de création                    |
| updatedAt        | String | Date de mise à jour                 |

---

## Requêtes DynamoDB utilisées
- Lecture via **Partition Key (userId)**
- Lecture via **Sort Key (orderId)**
- Filtrage par **status**
- Scan conditionnel (fallback)

---

## Installation

```bash
git clone <repo-url>
cd delivery-app
pip install -r requirements.txt
```

Créer un fichier `.env` :

```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=eu-north-1
DYNAMODB_TABLE=Orders
```

---

## Lancement

```bash
uvicorn app:app --reload
```

- API : http://localhost:8000/docs  
- Frontend : ouvrir `index.html`

---

## Endpoints principaux

| Méthode | Endpoint | Description |
|--------|----------|-------------|
| POST | /orders | Créer une commande |
| GET | /orders/user/{userId} | Lister commandes utilisateur |
| GET | /orders/{orderId} | Détail d’une commande |
| PUT | /orders/{orderId}?new_status=DELIVERED | Mettre à jour statut |
| DELETE | /orders/{orderId} | Supprimer une commande |

---

## Exemple de requête

```bash
curl http://localhost:8000/orders/user/USER#101
```

---

## Résultats obtenus
- API complète (CRUD)
- Frontend fonctionnel
- Utilisation avancée de DynamoDB
- Application entièrement opérationnelle

---

## Auteur
**Mouad BOUNOKRA**  
