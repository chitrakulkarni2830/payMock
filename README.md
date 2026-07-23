# 💳 PayMock - Mock Payment Gateway API

A simple mock payment gateway built with **Node.js**, **Express.js**, and **MongoDB** to demonstrate how an online payment system works.

This project simulates the core payment workflow—from payment creation to processing—without integrating a real payment provider.

---

## 🚀 Features

- Create a payment
- Fetch payment details
- Update payment status
- Process payments using:
  - UPI
  - Card
- Input validation
- MongoDB Atlas integration
- RESTful API design

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- NanoID
- dotenv

---

## 📁 Project Structure

```
src/
├── controllers/
│   └── paymentController.js
├── models/
│   └── Payment.js
├── routes/
│   └── paymentRoutes.js
├── config/
│   └── db.js
└── server.js
```

---

## 📌 API Endpoints

### Create Payment

**POST**

```
/api/payments
```

Request Body

```json
{
  "merchantName": "Amazon",
  "customerName": "Chitra",
  "amount": 1499,
  "paymentMethod": "UPI"
}
```

---

### Get Payment

**GET**

```
/api/payments/:paymentId
```

---

### Update Payment Status

**PATCH**

```
/api/payments/:paymentId
```

Request Body

```json
{
  "status": "Success"
}
```

---

### Process Payment

**PATCH**

```
/api/payments/:paymentId/pay
```

### UPI

```json
{
  "paymentMethod": "UPI",
  "upiId": "chitra@okaxis"
}
```

### Card

```json
{
  "paymentMethod": "Card",
  "cardNumber": "4111111111111111",
  "cardHolderName": "Chitra",
  "expiry": "12/29",
  "cvv": "123"
}
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
```

Run the server

```bash
npm run dev
```

---

## 🧪 Testing

The APIs can be tested using **Postman**.

Typical flow:

1. Create a payment
2. Get payment details
3. Process the payment
4. Verify the updated payment status
