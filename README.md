# 🏋️ FitPlanHub - Fitness Plans & Trainer Platform

A full-stack web application where certified trainers can create and manage fitness plans, and users can browse, subscribe to plans, and follow their favorite trainers.

![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-v4.4+-green)
![React](https://img.shields.io/badge/React-18.0+-blue)

---

## 🎯 Features

### For Trainers:
- ✅ Create custom fitness plans with pricing and duration
- ✅ Edit and delete your own plans
- ✅ View all created plans in dashboard
- ✅ Manage plan details easily

### For Users:
- ✅ Browse all available fitness plans
- ✅ Preview plans before subscribing
- ✅ Subscribe to unlock full plan details
- ✅ Follow favorite trainers
- ✅ Personalized feed from followed trainers
- ✅ Track all subscriptions in dashboard

### Security:
- ✅ JWT authentication
- ✅ Password encryption with bcrypt
- ✅ Role-based access control
- ✅ Protected routes

---

## 📋 Prerequisites

Before you start, make sure you have these installed on your computer:

1. **Node.js** (version 14 or higher)
   - Download: https://nodejs.org/
   - This includes npm (Node Package Manager)

2. **MongoDB** (version 4.4 or higher)
   - Download: https://www.mongodb.com/try/download/community
   - MongoDB stores all the data

3. **Git** (to clone the repository)
   - Download: https://git-scm.com/

**To verify installation, open terminal/command prompt and run:**
```bash
node --version    # Should show v14.x.x or higher
npm --version     # Should show 6.x.x or higher
mongod --version  # Should show v4.4.x or higher
git --version     # Should show git version
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

Open terminal/command prompt and run:

```bash
# Clone this repository
git clone https://github.com/23f1000642/FITNESS_-planer-.git

# Navigate into the project folder
cd FITNESS_-planer-
```

### Step 2: Setup Backend

```bash
# Go to backend folder
cd fitplanhub-backend

# Install all required packages
npm install
```

**Create `.env` file:**

Inside the `fitplanhub-backend` folder, create a new file named `.env` and add these lines:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitplanhub
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important:** Replace `your_super_secret_key_change_this_in_production` with any random string for security.

### Step 3: Setup Frontend

Open a **NEW terminal/command prompt window** (keep the first one open):

```bash
# Navigate to project folder (if not already there)
cd FITNESS_-planer-

# Go to frontend folder
cd fitplanhub-frontend

# Install all required packages
npm install
```

---

## ▶️ Running the Application

You need **3 things running** at the same time:

### 1️⃣ Start MongoDB Database

**Windows:**
```bash
# MongoDB usually starts automatically on Windows
# Check if it's running:
Get-Service -Name MongoDB

# If not running, start it:
Start-Service MongoDB
```

**Mac:**
```bash
# Start MongoDB
brew services start mongodb-community

# Or run it in foreground:
mongod --config /usr/local/etc/mongod.conf
```

**Linux:**
```bash
# Start MongoDB
sudo systemctl start mongod

# Check status
sudo systemctl status mongod
```

### 2️⃣ Start Backend Server (Terminal 1)

```bash
# Make sure you're in the backend folder
cd fitplanhub-backend

# Start the backend server
npm run dev
```

✅ **Success! You should see:**
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

**Keep this terminal running!** Don't close it.

### 3️⃣ Start Frontend Server (Terminal 2)

Open a **NEW terminal window** and run:

```bash
# Make sure you're in the frontend folder
cd fitplanhub-frontend

# Start the React app
npm start
```

✅ **Success! You should see:**
```
Compiled successfully!
You can now view fitplanhub-frontend in the browser.

Local:            http://localhost:3000
```

**Your browser will automatically open at `http://localhost:3000`**

If it doesn't open automatically, manually go to: **http://localhost:3000**

---




## 📱 Application Structure

```
FITNESS_-planer/
│
├── fitplanhub-backend/          # Backend Server (Node.js + Express)
│   ├── config/                  # Database configuration
│   ├── controllers/             # Business logic
│   │   ├── authController.js    # Login/Register
│   │   ├── planController.js    # Plan CRUD operations
│   │   ├── subscriptionController.js  # Subscription logic
│   │   └── followController.js  # Follow/Unfollow
│   ├── models/                  # Database schemas
│   │   ├── User.js              # User schema
│   │   ├── FitnessPlan.js       # Plan schema
│   │   ├── Subscription.js      # Subscription schema
│   │   └── Follow.js            # Follow schema
│   ├── routes/                  # API endpoints
│   ├── middleware/              # Authentication middleware
│   ├── .env                     # Environment variables (YOU CREATE THIS)
│   ├── server.js                # Main entry point
│   └── package.json             # Dependencies
│
└── fitplanhub-frontend/         # Frontend (React)
    ├── src/
    │   ├── components/          # Reusable UI components
    │   │   ├── Navbar.js
    │   │   ├── PlanCard.js
    │   │   └── ProtectedRoute.js
    │   ├── pages/               # Main pages
    │   │   ├── Landing.js       # Home page
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── PlanDetails.js
    │   │   ├── TrainerDashboard.js
    │   │   └── UserDashboard.js
    │   ├── context/             # State management
    │   │   └── AuthContext.js   # Authentication state
    │   ├── services/            # API calls
    │   │   └── api.js
    │   ├── App.js               # Main app component
    │   └── index.js             # Entry point
    └── package.json
```

---

## 🐛 Troubleshooting

### Problem: "MongoDB Connection Failed"

**Solution:**
```bash
# Windows - Check MongoDB status
Get-Service -Name MongoDB

# If not running, start it
Start-Service MongoDB

# Mac
brew services restart mongodb-community

# Linux
sudo systemctl restart mongod
sudo systemctl status mongod
```

### Problem: "Port 5000 is already in use"

**Solution:** Another application is using port 5000.

1. Open `.env` file in `fitplanhub-backend`
2. Change `PORT=5000` to `PORT=5001`
3. Restart the backend server

### Problem: "Cannot find module" error

**Solution:** Dependencies not installed properly.

```bash
# For backend
cd fitplanhub-backend
rm -rf node_modules package-lock.json
npm install

# For frontend
cd fitplanhub-frontend
rm -rf node_modules package-lock.json
npm install
```

### Problem: "CORS Error" in browser console

**Solution:** 
- Make sure backend is running on port 5000
- Make sure frontend is running on port 3000
- Both servers must be running simultaneously


 

---

## ✅ Quick Start Checklist

Follow this checklist to ensure everything is set up correctly:

- [ ] Install Node.js, MongoDB, and Git
- [ ] Clone the repository
- [ ] Navigate to backend folder and run `npm install`
- [ ] Create `.env` file in backend folder
- [ ] Navigate to frontend folder and run `npm install`
- [ ] Start MongoDB service
- [ ] Start backend server (Terminal 1) - `npm run dev`
- [ ] Start frontend server (Terminal 2) - `npm start`
- [ ] Open browser at `http://localhost:3000`
- [ ] Create a trainer account
- [ ] Create some fitness plans
- [ ] Create a user account
- [ ] Subscribe to plans and follow trainers



