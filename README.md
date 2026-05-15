# Blog App - MERN Stack

A full-stack blog application built with **MongoDB, Express, React, and Node.js**. Users can create articles, write comments, and manage their profiles.

## Features

- ✅ User & Author authentication with JWT
- ✅ Create, read, update, delete articles
- ✅ Comment system with proper user attribution
- ✅ Password visibility toggle with show/hide
- ✅ Secure password storage (bcryptjs hashing)
- ✅ Persistent authentication (localStorage)
- ✅ Profile management for users and authors
- ✅ Change password functionality

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs  
**Frontend:** React, Vite, Zustand, TailwindCSS, React Hook Form  
**Database:** MongoDB (localhost:27017/ecomdb)

## Installation

```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd blog-app-frontend
npm install
```

## Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Runs on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd blog-app-frontend
npm run dev
# Runs on http://localhost:5174
```

## Project Structure

```
├── backend/
│   ├── APIs/          # Route handlers
│   ├── Models/        # Mongoose schemas
│   ├── Middlewares/   # Auth middleware
│   └── server.js      # Entry point
└── blog-app-frontend/
    ├── src/
    │   ├── components/   # React components
    │   └── App.jsx       # Main app
    └── authStore.js      # Zustand store
```

## API Endpoints

- `POST /common-api/login` - User login
- `POST /user-api/users` - User registration
- `POST /author-api/users` - Author registration
- `GET /article-api/articles` - Get all articles
- `POST /article-api/articles/:id/comments` - Add comment
- `PUT /common-api/change-password/:userId` - Change password

## Security Features

- Passwords never stored in React state (uses refs)
- JWT authentication for protected routes
- Password hashing with bcryptjs
- CORS configured with credentials
- Secure cookies for authentication

## Author

**Harsha Vardan Madupa** - Capstone Project 2026
