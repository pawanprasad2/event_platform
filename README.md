🔗 Live Demo

(Add after deployment)

Frontend: https://eventify.vercel.app

Backend: https://eventify-api.onrender.com

Tech Stack
Frontend

React (Vite)

React Router

Axios

Tailwind CSS (utility-only, no custom config)

Context API

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

MongoDB Transactions

Multer + Cloudinary (image upload)

⚙️ Features Implemented
🔐 Authentication & Security

User Signup & Login

JWT-based authentication

Protected routes

Logout support

Auth state persistence

📅 Event Management (CRUD)

Create events with:

Title

Description

Date & Time

Location

Capacity

Image upload

View all upcoming events

Edit & delete only events created by the logged-in user

Event ownership enforced on frontend and backend

🎟️ RSVP System (Critical Business Logic)

Join / Leave events

Capacity enforcement (no overbooking)

Prevent duplicate RSVPs

Real-time attendee count updates

Joined events shown on dashboard

📊 Dashboard

My Created Events

Events I Joined

Edit / delete owned events

🔍 Search

Search events by title or location

Instant client-side filtering

🎨 UI / UX

Modern responsive UI

Dark & Light theme (CSS variables, no Tailwind config)

Clean cards, modals, and navigation

Mobile-friendly design

Multiple users may attempt to RSVP for the same event simultaneously, which can lead to:

Overbooking

Inconsistent attendee counts

Duplicate RSVPs

✅ Solution Strategy

This project uses MongoDB transactions combined with atomic updates to guarantee data integrity under concurrency. 

Leaving an Event

Deletes RSVP document

Atomically decrements attendeesCount

Uses the same transactional guarantees
