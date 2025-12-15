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
- Submit reviews after completion

### Guide
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

## Booking → Payment → Review Flow
1. Check availability
2. Create booking (PENDING)
3. Initiate payment
4. Payment success → booking CONFIRMED
5. Cron job marks booking COMPLETED after endDate
6. Tourist can submit review

## Cron Jobs
- Auto mark bookings as COMPLETED after endDate

## API Endpoints (Sample)
### AVAILABILITY
- GET /api/v1/availability/check

### Auth
- POST /api/v1/auth/login
- POST /api/v1/auth/register
- POST /api/v1/auth/change-password
- GET /api/v1/auth/me

### Tours
- GET /api/v1/tours/all-tours
- POST /api/v1/tours/create-tour
- GET /api/v1/tours/my-tours
- GET /api/v1/tours/my-active-tours
- GET /api/v1/tours/top-tours
- GET /api/v1/tours/pending-tours
- GET /api/v1/tours
- GET /api/v1/tours/division-stats
- GET /api/v1/tours/new-arrival
- GET /api/v1/tours/:slug
- PATCH /api/v1/tours/update/:slug
- PATCH /api/v1/tours/:slug/send-verify-req
- PATCH /api/v1/tours/:slug/verify-tour

### Users
- GET /api/v1/user/my-profile
- POST /api/v1/user/all-guides
- GET /api/v1/user/pending-guides
- GET /api/v1/user/all-tourists
- POST /api/v1/user/send-verify
- POST /api/v1/user/register/tourist
- POST /api/v1/user/register/guide
- PATCH /api/v1/user/update-profile
- PATCH /api/v1/user/:id/verify
- GET /api/v1/user/:id
- PATCH /api/v1/user/:id

### Booking
- POST /api/v1/bookings
- GET /api/v1/bookings/
- GET /api/v1/bookings/my-bookings
- GET /api/v1/bookings/:id
- PATCH /api/v1/bookings/:id/cancel

### Payment
- POST /api/v1/payment/init
- POST /api/v1/payment/success
- POST /api/v1/payment/fail
- POST /api/v1/payment/cancel

### Review
- POST /api/v1/reviews
- GET /api/v1/reviews/tour/:tourId
- GET /api/v1/reviews/eligibility

## Setup Instructions
1. Clone repo
2. Install deps: npm install
3. Setup .env
4. Run dev: npm run dev

