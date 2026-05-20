# MyBlog - Full Stack Blogging Platform

MyBlog is a modern full-stack blogging platform built using the MERN stack. The platform allows users to read blogs, authors to create and manage articles, and admins to manage users and platform access.

The application focuses on secure authentication, role-based authorization, responsive UI design, and REST API integration.

---

# Live Demo

## Frontend
Deployed on Vercel

## Backend
Deployed on Render

---

# Features

## User Features
- User Registration & Login
- JWT Authentication
- Read Articles
- Comment on Articles
- Responsive Modern UI

## Author Features
- Create Articles
- Edit Articles
- Delete/Restore Articles
- View Own Articles

## Admin Features
- Manage Users
- Block/Unblock Accounts

---

# Tech Stack

## Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Axios
- Zustand
- React Hook Form
- React Hot Toast
- Lucide React

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- cookie-parser
- cors
- dotenv

---

# Project Structure

```bash
MyBlog/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── APIs/
│   ├── Models/
│   ├── middlewares/
│   ├── services/
│   └── server.js
│
└── README.md
```

---

# How It Works

## Authentication Flow

```txt
User Login
   ↓
Backend validates credentials
   ↓
JWT token generated
   ↓
Frontend stores token in localStorage
   ↓
Frontend sends token in Authorization headers
   ↓
Protected APIs verify token
```

---

## Role-Based Authorization

The platform supports 3 roles:

### USER
- Read articles
- Add comments

### AUTHOR
- Create articles
- Edit articles
- Delete/Restore articles

### ADMIN
- Manage users
- Block/Unblock accounts

---

## Frontend Workflow

- React handles UI rendering
- React Router manages navigation
- Zustand manages authentication state
- Axios handles API communication
- Tailwind CSS provides responsive styling

---

## Backend Workflow

```txt
Frontend Request
   ↓
Express Route
   ↓
JWT Middleware Verification
   ↓
Controller/Service Logic
   ↓
MongoDB Database
   ↓
Response Sent Back
```

---

# Database Collections

## Users
Stores:
- User information
- Roles
- Authentication details

## Articles
Stores:
- Title
- Content
- Category
- Author reference
- Timestamps

## Comments
Stores:
- Comment content
- User reference
- Article reference

---

# Installation

# Clone Repository

```bash
git clone <repository-url>
```

---

# Frontend Setup

## Move to frontend folder

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Create .env file

```env
VITE_BASE_URL=http://localhost:5000
```

## Run frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Backend Setup

## Move to backend folder

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

## Create .env file

```env
PORT=5000
DB_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
```

## Run backend

```bash
npm start
```

Backend runs on:

```bash
http://localhost:5000
```

---

# API Routes

## Common APIs

```bash
/common-api/login
/common-api/logout
/common-api/check-auth
```

## User APIs

```bash
/user-api/articles
/user-api/comments
```

## Author APIs

```bash
/author-api/articles
```

## Admin APIs

```bash
/admin-api/users
```

---

# Security Features

- JWT Authentication
- Role-Based Authorization
- Password Hashing using bcryptjs
- Protected Routes
- CORS Configuration
- Secure API Access

---

# Deployment

## Frontend
- Vercel

## Backend
- Render

- deployed link
https://blog-app-ahtk.vercel.app/