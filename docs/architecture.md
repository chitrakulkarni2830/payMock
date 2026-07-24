# 🏗️ PayMock Architecture & Technical Design Specification (v2.0.0)

## System Overview

**PayMock** is a simulated online payment gateway platform built with the MERN stack (**MongoDB**, **Express**, **React**, **Node.js**). It emulates real-world payment gateway lifecycle events without external banking or live credit card processing integrations.

The platform provides a seamless end-to-end user experience where a merchant creates an order checkout, the customer selects a payment method (UPI or Card), the backend handles processing asynchronously, and persistent receipts are generated.

---

## Technical Stack Architecture

### Frontend Layer
- **Framework**: React 19 + Vite 8
- **Routing**: React Router 7 (Single-Page Application)
- **Styling**: Tailwind CSS v4 (Glassmorphic dark theme)
- **State & HTTP**: Local React hooks + Axios REST client
- **Icons**: Lucide React

### Backend Layer
- **Runtime**: Node.js v18+
- **Server Framework**: Express 5
- **Identifier Generation**: NanoID (10-character collision-resistant unique tokens)
- **Environment**: Dotenv

### Database Layer
- **Engine**: MongoDB Atlas
- **ODM**: Mongoose 9

### Quality Assurance & E2E Testing
- **Browser Automation**: Playwright 1.61 (Chromium headless testing)
- **API Spec Validation**: Postman collection suite

---

## High-Level Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                            REACT FRONTEND                              │
│                                                                        │
│  /checkout ──► /payment/:id ──► /processing/:id ──► /success/:id      │
│                                                          │             │
│                                                   /payment-details/:id │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │  JSON over HTTP
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           EXPRESS REST SERVER                          │
│                                                                        │
│  • POST /api/payments                   (Initialize payment)           │
│  • POST /api/payments/:paymentId/process (Process UPI/Card payload)    │
│  • GET  /api/payments/:paymentId         (Fetch payment receipt)       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │  Mongoose ODM Connection
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                             MONGODB ATLAS                              │
│                                                                        │
│  Collection: payments                                                  │
│  • paymentId (indexed, unique NanoID)                                  │
│  • status ("Pending" ──► "Success" / "Failed")                         │
│  • merchantName, customerName, amount, currency, paymentMethod         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Core Data Schema

### Payment Document (`payments`)

```javascript
{
  paymentId: { type: String, required: true, unique: true },
  merchantName: { type: String, required: true, trim: true },
  customerName: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 1 },
  currency: { type: String, default: "INR" },
  paymentMethod: { 
    type: String, 
    enum: ["UPI", "Card", "Net Banking", "Wallet"], 
    default: "UPI" 
  },
  status: { 
    type: String, 
    enum: ["Pending", "Success", "Failed"], 
    default: "Pending" 
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## Payment State Machine

```
              ┌─────────┐
              │ Pending │ (Initial state on creation)
              └────┬────┘
                   │
         Process Request Submitted
                   │
                   ▼
              ┌─────────┐
              │ Success │ (Terminal state)
              └─────────┘
```

> **State Protection Rule**: Once a payment transitions to `Success` or `Failed`, any subsequent processing attempt returns HTTP 400 Bad Request to guarantee idempotency.

---

## API Routes & Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| `POST` | `/api/payments` | Initializes a new transaction and generates `paymentId` |
| `GET` | `/api/payments/:paymentId` | Retrieves payment audit record |
| `POST` | `/api/payments/:paymentId/process` | Processes UPI or Card details for pending payment |