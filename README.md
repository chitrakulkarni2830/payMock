# 💳 PayMock — Full-Stack Simulated Payment Gateway

[![Release](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/chitrakulkarni2830/payMock)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://pay-mock.vercel.app)
[![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render&logoColor=black)](https://paymock.onrender.com)
[![React](https://img.shields.io/badge/React-v19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-v5.2.1-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-v9.8.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E%20Passed-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Postman](https://img.shields.io/badge/Postman-API_Tested-FF6C37?logo=postman&logoColor=white)](https://www.postman.com/)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)

**PayMock** is a full-stack simulated online payment gateway platform designed to replicate real-world payment processing workflows—from checkout initiation to asynchronous state resolution and transaction auditing.

Built with **React 19**, **Node.js**, **Express 5**, **MongoDB Atlas**, and automated with **Playwright E2E**, PayMock provides developers, recruiters, and technical evaluators with a complete, production-grade model of how modern payment systems handle state transitions, idempotency, API security, and UI user experience.

---

## 🌐 Live Demo

Experience the deployed production instance of PayMock:

- 🌐 **Frontend Application (Vercel)**: [https://pay-mock.vercel.app](https://pay-mock.vercel.app)
- ⚙️ **Backend REST API (Render)**: [https://paymock.onrender.com](https://paymock.onrender.com)

---

## 🎯 Why Built?

When building modern web applications, integrating real payment gateways (like Stripe or Razorpay) introduces dependency on live sandbox API keys, merchant accounts, and webhooks. 

**PayMock** solves this problem by providing a standalone, end-to-end simulated gateway that:
- **Simulates real checkout UX**: Full navigation flow covering merchant checkout, payment method selection, asynchronous processing simulation, and status verification.
- **Enforces backend state safety**: Strict payment status transition rules (`Pending` $\rightarrow$ `Success`/`Failed`) preventing race conditions, duplicate charges, or redundant database creation.
- **Offers production testing patterns**: Includes comprehensive Postman API collections and 100% automated E2E testing with Playwright.
- **Demonstrates cloud deployment**: Live cloud deployment with automated GitHub Git continuous integration.

---

## ✨ Key Features

- **🚀 Live Cloud Deployment**: Production instance running on Vercel (Frontend) and Render (Backend API).
- **🔄 Continuous GitHub Deployments**: Automatic build and deployment pipelines triggered on push to GitHub repository.
- **☁️ Cloud Database Persistence**: Production cloud storage cluster hosted on MongoDB Atlas.
- **🛍️ Merchant Checkout**: Collect order details (Merchant Name, Customer Name, Amount) and auto-generate unique 10-character NanoID transaction tokens.
- **💳 Multi-Method Payment Processing**:
  - **UPI**: Instant virtual payment address validation (e.g., `user@okaxis`).
  - **Card**: Full debit/credit card validation (Card Number, Holder Name, Expiry, CVV).
- **🔒 Idempotency & Duplicate Guard**:
  - Payment records are created **once** upon checkout.
  - Refreshing payment pages or re-submitting requests references existing `paymentId` without redundant database writes.
  - Prevents processing already completed (`Success`/`Failed`) payments with strict HTTP 400 guards.
- **⚡ Real-Time Async State Resolution**: Visual loader and simulation phase transitioning payment state from `Pending` to `Success`.
- **📊 Detailed Transaction Receipts**: View complete metadata for completed payments (Amount, Currency, Status, Method, Timestamps, Transaction ID).
- **🎨 Glassmorphic Modern UI**: Dark-mode aesthetic powered by Tailwind CSS v4, dynamic Lucide React icons, responsive layout, and interactive micro-animations.
- **🧪 Complete Test Automation**: Playwright automated suite testing UI flows, API contracts, page refresh resilience, and invalid payloads.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** + **Vite 8** | Ultra-fast single-page app architecture |
| **Styling & Icons** | **Tailwind CSS v4** + **Lucide React** | Modern glassmorphic theme with responsive utilities |
| **Routing & HTTP** | **React Router 7** + **Axios** | Declarative navigation and promise-based REST calls |
| **Backend Runtime** | **Node.js** + **Express 5** | High-performance modular REST API server |
| **Database Engine** | **MongoDB Atlas** + **Mongoose 9** | Cloud document database with strict schema validation |
| **ID Generation** | **NanoID** | Secure, collision-resistant 10-char payment identifiers |
| **Cloud Hosting** | **Vercel** | Edge CDN and static assets hosting for React Frontend |
| **API Hosting** | **Render** | Production web service hosting for Express REST Server |
| **E2E Automation** | **Playwright 1.61** | End-to-end browser testing & network assertion |
| **API Testing** | **Postman** | Comprehensive API collection test suite |

### Cloud & Deployment Infrastructure

- **Frontend Platform**: **Vercel** (`https://pay-mock.vercel.app`)
- **Backend API Platform**: **Render** (`https://paymock.onrender.com`)
- **Database Storage**: **MongoDB Atlas** (Cloud Cluster)
- **Continuous Integration**: **Automatic GitHub Deployments** (Git integration with Vercel and Render)

---

## 🏗️ Project Architecture & Application Workflow

### Architecture Overview

PayMock follows a decoupled client-server cloud architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        REACT FRONTEND (Vercel)                         │
│                       https://pay-mock.vercel.app                      │
│                                                                        │
│  /checkout ──► /payment/:id ──► /processing/:id ──► /success/:id       │
│                                                          │             │
│                                                   /payment-details/:id │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │  JSON over HTTPS
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    EXPRESS REST API SERVER (Render)                    │
│                      https://paymock.onrender.com                      │
│                                                                        │
│  • POST /api/payments                   (Initialize payment)           │
│  • POST /api/payments/:paymentId/process (Process UPI/Card payload)    │
│  • GET  /api/payments/:paymentId         (Fetch payment receipt)       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │  Mongoose ODM TLS Connection
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                             MONGODB ATLAS                              │
│                        (Cloud Database Cluster)                        │
│                                                                        │
│  Collection: payments                                                  │
│  • paymentId (indexed, unique NanoID)                                  │
│  • status ("Pending" ──► "Success" / "Failed")                         │
│  • merchantName, customerName, amount, currency, paymentMethod         │
└────────────────────────────────────────────────────────────────────────┘
```

### Deployed Layer Responsibilities

1. **React Frontend (Vercel)**:
   - Renders checkout, payment processing, success, and audit receipt views.
   - Manages client-side routing, form state validation, and interactive dark glassmorphism UI transitions.
   - Communicates asynchronously with the backend API via Axios.
2. **Express REST API Server (Render)**:
   - Receives transaction creation requests and processes payments asynchronously.
   - Enforces business logic, unique NanoID identifier generation, and idempotency status guards.
   - Validates input payloads and returns consistent JSON status envelopes.
3. **MongoDB Atlas (Cloud Storage)**:
   - Hosts the production database cluster with TLS security and automated index management.
   - Stores durable transaction documents across payment lifecycle state changes.

### Complete Sequence Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant UI as React Frontend (Vercel)
    participant API as Express API Server (Render)
    participant DB as MongoDB Atlas

    Customer->>UI: 1. Enter Order Details & Submit
    UI->>API: 2. POST /api/payments (merchantName, customerName, amount)
    API->>DB: 3. Payment.create({ paymentId: nanoid(), status: "Pending" })
    DB-->>API: 4. Payment Document Created
    API-->>UI: 5. 201 Created { success: true, data: { paymentId } }
    UI->>Customer: 6. Navigate to /payment/:paymentId

    Customer->>UI: 7. Select UPI / Card & Fill Credentials
    UI->>API: 8. POST /api/payments/:paymentId/process
    API->>DB: 9. Find payment & verify status == "Pending"
    API->>DB: 10. Update status to "Success"
    DB-->>API: 11. Updated Document Returned
    API-->>UI: 12. 200 OK { success: true, message: "Payment processed" }

    UI->>Customer: 13. Display Processing Screen -> Auto-redirect /success/:paymentId
    Customer->>UI: 14. Click "View Payment Details"
    UI->>API: 15. GET /api/payments/:paymentId
    API->>DB: 16. Payment.findOne({ paymentId })
    DB-->>API: 17. Return Payment Audit Record
    API-->>UI: 18. Render Receipt Page (/payment-details/:paymentId)
```

---

## 🚀 Deployment

PayMock is fully deployed to production using cloud infrastructure for frontend hosting, backend server execution, and database storage.

### 🌐 Frontend Deployment (Vercel)
- Deployed via **Vercel** with global CDN caching.
- Configured to build from the `/client` directory.
- Built using Vite optimized bundle output.
- Environment variable `VITE_API_URL` points directly to the Render backend API.

### ⚙️ Backend API Deployment (Render)
- Deployed via **Render** as a Node.js Web Service.
- Executed from the `/server` directory.
- Exposes REST API routes over secure HTTPS at `https://paymock.onrender.com`.
- Connects securely to the MongoDB Atlas database cluster via `MONGO_URI`.

### 🗄️ Database Hosting (MongoDB Atlas)
- Provisioned on **MongoDB Atlas** cloud infrastructure.
- Provides persistent document storage, TLS encryption, and automated indexing on `paymentId`.

### 🔄 Continuous Integration & Automatic Deployment
- Git integration is enabled across Vercel and Render.
- Every push to the `main` branch on GitHub automatically triggers a build and deployment across both platforms.

---

## 🔑 Environment Variables Section

To run PayMock locally or deploy to cloud platforms, the following environment variables are required:

### Frontend Environment Variables (`client/.env`)

| Variable | Required | Example Value | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | **Yes** | `https://paymock.onrender.com/api` (Production) <br> `http://localhost:5001/api` (Development) | Base URL for Express backend API calls |

### Backend Environment Variables (`server/.env`)

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `PORT` | No | `5001` | Express API server port number |
| `MONGO_URI` | **Yes** | `mongodb+srv://<user>:<password>@cluster.mongodb.net/paymock` | MongoDB connection string URI |

> **Security Note**: Never commit actual secret keys or database connection passwords to public GitHub repositories. Keep credentials stored securely in environment settings.

---

## 📂 Folder Structure

```
PayMock/
├── client/                     # React 19 Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI Components (Navbar, Layout, Payment Forms)
│   │   ├── pages/              # Checkout, Payment, Processing, Success, Failed, Details
│   │   ├── services/           # Axios API Client Modules (paymentApi.js)
│   │   ├── styles/             # Global CSS & Tailwind Configurations
│   │   ├── App.jsx             # React Router 7 Navigation Hierarchy
│   │   └── main.jsx            # Application Entrypoint
│   ├── .env.example            # Client Environment Variables Template
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express 5 REST API Server
│   ├── src/
│   │   ├── config/             # MongoDB Atlas Connection Setup (db.js)
│   │   ├── controllers/        # Payment Logic & Idempotency Guards (paymentController.js)
│   │   ├── models/             # Mongoose Schemas (Payment.js)
│   │   ├── routes/             # Express Endpoint Router (paymentRoutes.js)
│   │   ├── app.js              # Express Middleware Setup
│   │   └── server.js           # Server Bootstrap & Environment Validator
│   ├── .env.example            # Server Environment Variables Template
│   └── package.json
│
├── tests/                      # Automated Playwright Test Suite
│   └── e2e/
│       ├── payment-flow-card.spec.js   # Card Checkout E2E Test
│       ├── payment-flow-upi.spec.js    # UPI Checkout E2E Test
│       └── payment-edge-cases.spec.js  # Validation & Idempotency Edge Cases
│
├── docs/                       # Project Architecture & Images
│   ├── architecture.md         # Detailed System Architecture Specification
│   └── images/                 # Visual Documentation Screenshots
│
├── assets/                     # README Visual Assets
├── playwright.config.js        # Playwright E2E Test Configuration
├── package.json                # Project Root Package Manifest
└── README.md                   # Main Project Documentation
```

---

## 📸 Screenshots & Visual Tour

| Screen | Description | Visual |
| :--- | :--- | :--- |
| **1. Checkout Page** | Initiate payment with merchant details, customer name, and item amount. | ![Checkout Page](assets/checkout-page.png) |
| **2. Payment Page** | Select preferred payment method (**UPI** or **Card**) with dynamic form validation. | ![Payment Selection](assets/payment-page.png) |
| **3. Processing Screen** | Simulated asynchronous network processing phase. | ![Processing](assets/processing.png) |
| **4. Success Screen** | Transaction confirmation with payment reference ID. | ![Success Screen](assets/success.png) |
| **5. Payment Details** | Detailed transaction receipt fetched directly from MongoDB Atlas. | ![Payment Details](assets/payment-details.png) |
| **6. Postman API Testing** | Verification of backend REST endpoints using Postman. | ![Postman Testing](assets/postman-testing.png) |
| **7. Playwright E2E Report** | Automated test suite validating end-to-end flows, API contracts, and edge cases. | ![Playwright E2E Report](assets/playwright-report.png) |

---

## 📡 API Endpoints Documentation

### 1. Create Payment Request
Creates a new payment record initialized in `Pending` state with a unique `paymentId`.

- **Endpoint**: `POST /api/payments`
- **Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "merchantName": "Amazon",
  "customerName": "Chitra Kulkarni",
  "amount": 1499,
  "paymentMethod": "UPI"
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "_id": "66a12b4e8f1c2d0012345678",
    "paymentId": "k9X2mP7qL1",
    "merchantName": "Amazon",
    "customerName": "Chitra Kulkarni",
    "amount": 1499,
    "currency": "INR",
    "paymentMethod": "UPI",
    "status": "Pending",
    "createdAt": "2026-07-24T14:00:00.000Z",
    "updatedAt": "2026-07-24T14:00:00.000Z"
  }
}
```

---

### 2. Fetch Payment Details
Retrieves current payment status and details by `paymentId`. (Read-only endpoint).

- **Endpoint**: `GET /api/payments/:paymentId`

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "paymentId": "k9X2mP7qL1",
    "merchantName": "Amazon",
    "customerName": "Chitra Kulkarni",
    "amount": 1499,
    "currency": "INR",
    "paymentMethod": "UPI",
    "status": "Success",
    "createdAt": "2026-07-24T14:00:00.000Z",
    "updatedAt": "2026-07-24T14:00:05.000Z"
  }
}
```

---

### 3. Process Payment
Executes payment processing for the selected method. Validates payload and guards against duplicate processing.

- **Endpoint**: `POST /api/payments/:paymentId/process`
- **Headers**: `Content-Type: application/json`

#### Request Payload (UPI)
```json
{
  "paymentMethod": "UPI",
  "upiId": "chitra@okaxis"
}
```

#### Request Payload (Card)
```json
{
  "paymentMethod": "Card",
  "cardNumber": "4111111111111111",
  "cardHolderName": "Chitra Kulkarni",
  "expiry": "12/29",
  "cvv": "123"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "paymentId": "k9X2mP7qL1",
    "merchantName": "Amazon",
    "customerName": "Chitra Kulkarni",
    "amount": 1499,
    "paymentMethod": "Card",
    "status": "Success"
  }
}
```

#### Error Response (`400 Bad Request` — Duplicate Processing Guard)
```json
{
  "success": false,
  "message": "Payment is already Success"
}
```

---

## 🧪 Testing & Quality Assurance

PayMock includes dual-layer testing to guarantee backend robustness and frontend reliability.

### 1. API Testing (Postman)
- Verified all HTTP verbs, request schemas, status codes, and error responses.
- Tested edge cases including invalid `paymentId` lookup, missing request body parameters, and duplicate processing requests.

### 2. End-to-End Testing (Playwright)
The automated test suite in `tests/e2e/` covers 5 critical scenarios:
1. **`payment-flow-upi.spec.js`**: Complete checkout to success flow using UPI method.
2. **`payment-flow-card.spec.js`**: Complete checkout to success flow using Debit/Credit Card.
3. **`payment-edge-cases.spec.js` (Validation)**: Rejects empty UPI ID submissions with appropriate UI validation error.
4. **`payment-edge-cases.spec.js` (Refresh Resilience)**: Verifies that page refreshes during payment do NOT trigger duplicate `POST /api/payments` requests.
5. **`payment-edge-cases.spec.js` (Duplicate Guard)**: Confirms backend returns `400 Bad Request` when attempting to process an already completed transaction.

---

## ⚙️ Installation & Local Setup Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB Atlas** account (or local MongoDB instance)

### Step 1: Clone Repository
```bash
git clone https://github.com/chitrakulkarni2830/payMock.git
cd payMock
```

### Step 2: Running the Backend Server Independently

1. Navigate to the `server` directory and install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Create `.env` file inside `server/`:
   ```env
   PORT=5001
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/paymock?retryWrites=true&w=majority
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```
   > ⚙️ Backend API server running at: `http://localhost:5001`

### Step 3: Running the Frontend Application Independently

1. Open a new terminal, navigate to the `client` directory, and install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Create `.env` file inside `client/`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   > 🌐 Frontend application running at: `http://localhost:5173`

---

## 🔮 Future Improvements

- [ ] **Webhook Integration**: Support merchant webhook callbacks (`payment.success`, `payment.failed`).
- [ ] **Merchant Dashboard**: Analytics page displaying transaction volume, success rates, and revenue metrics.
- [ ] **Refund Workflow**: Allow merchants to trigger full or partial refunds on successful payments.
- [ ] **Net Banking & Wallets**: Add simulated net banking portal and wallet balance selection.
- [ ] **JWT Merchant Auth**: Secure API endpoints with token-based merchant authentication.

---

## 📜 License

Distributed under the **ISC License**. See `LICENSE` for details.

---

## 👤 Author

**Chitra Kulkarni**  
- **GitHub**: [@chitrakulkarni2830](https://github.com/chitrakulkarni2830)  
- **Repository**: [https://github.com/chitrakulkarni2830/payMock](https://github.com/chitrakulkarni2830/payMock)
