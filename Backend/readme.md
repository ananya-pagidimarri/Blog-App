# MyBlog Backend

Backend API for MyBlog blogging platform built using Node.js, Express.js, and MongoDB.

The backend handles authentication, authorization, CRUD operations, protected APIs, and database management.

---

# Features

- JWT Authentication
- Role-Based Authorization
- REST APIs
- CRUD Operations
- MongoDB Integration
- Protected Routes
- Password Hashing

---

# Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cors
- dotenv
- cookie-parser

---

# Folder Structure

```bash
backend/
│
├── APIs/
├── Models/
├── middlewares/
├── services/
├── server.js
├── package.json
└── README.md
```

---

# How It Works

## Backend Workflow

```txt
Frontend Request
   ↓
Express Route
   ↓
JWT Middleware Verification
   ↓
Controller / Service Logic
   ↓
MongoDB Database
   ↓
Response Sent Back
```

---

# Authentication Process

```txt
Frontend Login Request
   ↓
Backend validates email & password
   ↓
JWT token generated
   ↓
Token sent to frontend
   ↓
Frontend stores token
   ↓
Protected APIs verify token
```

---

# Role-Based Authorization

The application supports 3 roles:

## USER
- Read articles
- Add comments

## AUTHOR
- Create articles
- Edit articles
- Delete/Restore articles

## ADMIN
- Manage users
- Block/unblock accounts

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

## Clone Repository

```bash
git clone <repository-url>
```

---

# Setup Backend

## Move to backend folder

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

---

# Environment Variables

Create `.env` file:

```env
PORT=5000
DB_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
```

---

# Run Backend

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
- Protected APIs
- CORS Configuration

---

# Deployment

Backend deployed using:

- Render
