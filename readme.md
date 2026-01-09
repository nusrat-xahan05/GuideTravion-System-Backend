# GuideTravion Backend

## Project Overview

GuideTravion is a role-based tour booking platform where tourists can discover tours, book guides, make payments, and leave reviews after completing tours. Guides can create and manage tours, while admins oversee the system.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- SSLCommerz Payment Gateway
- node-cron
- Zod (validation)

## Roles & Features

### Tourist

- Browse tours
- Check availability
- Book tours
- Make payments
- View bookings
- Submit rating & reviews after completion
- Save tours in wishlist

### Guide

- Manage & Setup Profile
- Create & manage tours
- View assigned bookings
- Earn from confirmed bookings

### Admin

- Manage users
- Verify Guides
- Approve/reject tours
- Monitor system activity

## Auth Flow

1. User registers/login
2. Role-based route protection via middleware

## Booking → Payment → Rating & Review Flow

1. Check availability
2. Create booking (PENDING)
3. Initiate payment
4. Payment success → booking CONFIRMED
5. Cron job marks booking COMPLETED after endDate
6. Tourist can submit review, rating

## Cron Jobs

- Auto mark bookings as COMPLETED after endDate for confirmed bookings

## API Endpoints (Sample)

### STATS (`/api/v1/stats`)

- GET `/all-stats`

### AVAILABILITY (`/api/v1/availability`)

- GET `/check`

### Auth (`/api/v1/auth`)

- POST `/login`
- GET `/logout`
- POST `/change-password`
- GET `/me`

### Tours (`/api/v1/tours`)

- GET `/all-tours`
- POST `/create-tour`
- GET `/my-tours`
- GET `/my-active-tours`
- GET `/top-tours`
- GET `/pending-tours`
- GET `/`
- GET `/division-stats`
- GET `/new-arrival`
- GET `/:slug`
- PATCH `/update/:slug`
- PATCH `/:slug/send-verify-req`
- PATCH `/:slug/verify-tour`
- DELETE `/:slug`

### Users (`/api/v1/user`)

- GET `/my-profile`
- POST `/all-guides`
- GET `/pending-guides`
- GET `/all-tourists`
- POST `/send-verify`
- POST `/register/tourist`
- POST `/register/guide`
- PATCH `/update-profile`
- PATCH `/:id/verify`
- GET `/:id`
- PATCH `/:id`

### Booking (`/api/v1/bookings`)

- GET `/active-booked-tours`
- GET `/upcoming-booked-tours`
- GET `/completed-booked-tours`
- GET `/cancelled-booked-tours`
- GET `/cancelled-booked-tours`
- POST `/`
- GET `/:id`
- PATCH `/:id/cancel`

### Payment (`/api/v1/payment`)

- POST `/init`
- POST `/success`
- POST `/fail`
- POST `/cancel`

### Review (`/api/v1/reviews`)

- POST `/`
- GET `/tour/:tourId`
- GET `/eligibility`

## ⚙️ Setup & Environment Instructions

### 🔧 Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas or Local MongoDB
- Postman (for API testing)

### 📥 Installation

1. Clone the repository:

```
git clone https://github.com/nusrat-xahan05/GuideTravion-System-Backend
cd GuideTravion-System-Backend
npm install
```

2. Create a `.env` file in the root and add the following:

```env
PORT = 5000
DB_URL = your_mongodb_connection_string
NODE_ENV = Development
FRONTEND_URL = provide_frontend_url
BCRYPT_SALT_ROUND = your_desired_round_number
SUPER_ADMIN_NAME = provide_name
SUPER_ADMIN_EMAIL = provide_email
SUPER_ADMIN_PASSWORD = provide_password
SUPER_ADMIN_PHONE = provide_phone_number
SUPER_ADMIN_COUNTRY = provide_country
JWT_ACCESS_SECRET = your_jwt_access_secret
JWT_ACCESS_EXPIRES = -d
JWT_REFRESH_SECRET = your_jwt_refresh_secret
JWT_REFRESH_EXPIRES = --d
CLOUDINARY_CLOUD_NAME=provide_your_name
CLOUDINARY_API_KEY=provide_yourapi_key
CLOUDINARY_API_SECRET=provide_your_secret
SSL_STORE_ID=provide_your_store_id
SSL_STORE_PASS=provide_password
SSL_PAYMENT_API=provide_your_payment_api
SSL_VALIDATION_API=provide_your_validation_api
SSL_SUCCESS_BACKEND_URL=provide_ssl_backend_url
SSL_FAIL_BACKEND_URL=provide_ssl_backend_url
SSL_CANCEL_BACKEND_URL=provide_ssl_backend_url
SSL_SUCCESS_FRONTEND_URL=provide_ssl_frontend_url
SSL_FAIL_FRONTEND_URL=provide_ssl_frontend_url
SSL_CANCEL_FRONTEND_URL=provide_ssl_frontend_url
```

4. Run in development mode:

```bash
npm run dev
```

5. Build & start production server:

```bash
npm run build
npm start
```
