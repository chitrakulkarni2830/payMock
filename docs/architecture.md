# PayMock Architecture

## Overview

PayMock is a simulated payment gateway built with the MERN stack.

It recreates a real-world online payment experience where a merchant creates a payment request, generates a unique payment link, and a customer completes the payment using a mock checkout flow.

The project is intended for learning and portfolio purposes only. No real money, banking APIs, or third-party payment gateways are used.

---

## Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## Project Structure

```
paymock/

├── client/          # React application
├── server/          # Express API
├── docs/            # Project documentation
└── README.md
```

---

## Application Flow

```
Merchant
    │
    ▼
Create Payment Request
    │
    ▼
Generate Unique Payment Link
    │
    ▼
Customer Opens Link
    │
    ▼
Choose Payment Method
    │
    ▼
Complete Mock Payment
    │
    ▼
Payment Status Updated
```

---

## Frontend

The React application contains:

- Landing Page
- Merchant Payment Form
- Checkout Page
- Payment Method Components
- OTP Verification
- Success / Failure Screen

---

## Backend

The Express server is responsible for:

- Merchant Authentication
- Creating Payment Requests
- Generating Unique Payment IDs
- Retrieving Payment Details
- Updating Payment Status

---

## Database

### Users

Stores merchant accounts.

```
User
- name
- email
- password
```

### Payments

Stores payment requests.

```
Payment
- paymentId
- merchantName
- productName
- amount
- paymentMethod
- status
- createdAt
```

---

## API Endpoints

Authentication

```
POST /api/auth/signup
POST /api/auth/login
```

Payments

```
POST /api/payments
GET /api/payments/:paymentId
PATCH /api/payments/:paymentId
```

---

## Payment Status

- Pending
- Success
- Failed

---

## Project Goals

- Build a complete MERN application
- Demonstrate frontend and backend integration
- Simulate a real payment gateway experience
- Focus on clean UI and user experience
- Keep the project small, simple, and production-like