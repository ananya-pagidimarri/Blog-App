# MyBlog Frontend

Frontend for MyBlog — a modern MERN stack blogging platform built using React.js and Tailwind CSS.

The frontend provides responsive UI pages for users, authors, and admins with secure JWT authentication and protected routes.

---

# Features

## User Features
- User Registration & Login
- Read Articles
- Comment on Articles
- Responsive UI

## Author Features
- Create Articles
- Edit Articles
- Delete/Restore Articles
- Manage Own Articles

## Admin Features
- Manage Users
- Block/Unblock Accounts

---

# Tech Stack

- React.js
- React Router DOM
- Tailwind CSS
- Axios
- Zustand
- React Hook Form
- React Hot Toast
- Lucide React

---

# Folder Structure

```bash
frontend/
│
├── src/
│   ├── components/
│   ├── store/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── README.md
```

---

# How It Works

## Frontend Workflow

- React handles UI rendering
- React Router manages navigation
- Zustand manages authentication state
- Axios handles API communication
- Tailwind CSS provides responsive styling

---

# Authentication Flow

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
Protected routes are accessed
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

# Setup Frontend

## Move to frontend folder

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

---

# Environment Variables

Create `.env` file:

```env
VITE_BASE_URL=http://localhost:5000
```

---

# Run Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Main Pages

- Home Page
- Login Page
- Register Page
- User Dashboard
- Author Dashboard
- Admin Dashboard
- Article Details Page

---

# Deployment

Frontend deployed using:

- Vercel

