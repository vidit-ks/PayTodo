# PayTodo ⚡

A modern, full-stack subscription-based to-do application showcasing **Razorpay Payment Gateway integration**, **HMAC SHA-256 signature verification**, **tiered feature gating**, and a **PostgreSQL (Supabase)** backend.

---

## ✨ Features

- **Tiered Subscriptions**:
  - **Free (₹0)**: Essential tasks (up to 10 active tasks) with standard circle checkboxes.
  - **Starter (₹5/mo)**: 50 active tasks + workspace-wide custom checkbox styles (*Circle, Square, Ballot, Check*).
  - **Pro (₹10/mo)**: 100 active tasks + priority tags (*High, Medium, Low*) & custom categories (*Work, Study, Fitness, Personal*).
  - **Business (₹20/mo)**: Unlimited tasks + recurring schedules + visual task analytics (Recharts) & CSV export.
- **Razorpay Checkout Integration**: Live order creation and cryptographic signature verification on the server.
- **Demo Switching**: Instant switching across 4 predefined persona accounts (*Vidit, Rahul, Priya, Aman*) or create custom user credentials.
- **Dynamic Modern UI**: Emerald-Teal & Electric Cyan theme, ambient aurora lighting, interactive cursor glow, and live interactive landing sandbox.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Recharts, Canvas Confetti
- **Backend**: Node.js, Express, Razorpay SDK, Crypto (HMAC SHA-256)
- **Database**: PostgreSQL (Supabase) via `pg` connection pool
- **Styling**: Modern CSS design system with glassmorphism & responsive layouts

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/vidit-ks/PayTodo.git
cd PayTodo
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env from example
cp .env.example .env
```
Configure your `.env` with your PostgreSQL `DATABASE_URL` and `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`.

Start the backend:
```bash
node src/server.js
# Running on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Create .env from example
cp .env.example .env
```

Start the Vite development server:
```bash
npm run dev
# Running on http://localhost:5173
```

---

## 🗄️ Database Schema & Seeding

The PostgreSQL database schema is available in [`server/src/db/schema.sql`](server/src/db/schema.sql).

To initialize the database:
```bash
cd server
node src/db/seed.js
```

---

## 🔒 Security & Payment Flow

1. **Order Creation**: Client calls `/api/payments/create-order` → Server requests Razorpay API.
2. **Checkout**: Razorpay modal opens in client with prefilled metadata.
3. **Cryptographic Verification**: Server generates `HMAC-SHA256(order_id + "|" + payment_id, secret)` and compares with `razorpay_signature`.
4. **Instant Unlock**: On verification, user plan tier updates immediately in PostgreSQL.

---

## 📄 License
MIT License. Built by [Vidit Kumar Singh](https://github.com/vidit-ks).
