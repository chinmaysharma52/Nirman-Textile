## Nirman Textile - Full Stack eCommerce

Production-ready bedsheet eCommerce built with React, Tailwind, Node/Express, MongoDB, and JWT auth.

### Structure

- `server`: Express API, MongoDB (Mongoose), JWT auth, Nodemailer emails, admin APIs.
- `client`: React + TypeScript + Vite + Tailwind storefront and admin panel.

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a connection string)

### Backend setup (`server`)

```bash
cd "Nirman Textile/server"
cp .env.example .env   # or create .env based on example
```

Edit `.env` with:

- `MONGO_URI`
- `JWT_SECRET`
- SMTP settings (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `ADMIN_EMAIL`)

Install and run:

```bash
cd "Nirman Textile/server"
npm install
npm run dev
```

API will run on `http://localhost:5000`.

### Frontend setup (`client`)

```bash
cd "Nirman Textile/client"
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`.

Make sure `CLIENT_URL` in `server/.env` is `http://localhost:5173`.

### Sample admin credentials

Create an admin user manually in MongoDB using the `users` collection:

- `email`: `admin@nirmantextile.com`
- `password`: `Admin@123`
- `isAdmin`: `true`

After creating it, you can login from the UI:

- Go to `http://localhost:5173/login`
- Use `admin@nirmantextile.com` / `Admin@123`

### Features overview

- Customer:
  - Home with hero + featured products.
  - Product listing and details.
  - Cart with quantity updates and total calculation.
  - COD checkout with full address form.
  - Signup/login with JWT stored in localStorage.
  - Order history page.
- Admin:
  - Dashboard with key stats.
  - Product management (add/edit/delete).
  - Orders management (view/update status).
- Email:
  - Customer order confirmation.
  - Admin new-order notification.

