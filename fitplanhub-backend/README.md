# FitPlanHub Backend - Trainers & Fitness Plans Platform

A comprehensive backend system for fitness trainers to create and manage fitness plans, and users to subscribe and follow trainers.

## 🚀 Features Implemented

### 1. **User & Trainer Authentication**
- User registration with role selection (user/trainer)
- Secure password hashing using bcryptjs
- JWT token-based authentication
- Protected routes with middleware

### 2. **Trainer Dashboard - Fitness Plans**
- ✅ Create fitness plans with title, description, price, and duration
- ✅ Edit own plans
- ✅ Delete own plans
- ✅ View all trainer's plans

### 3. **User Subscriptions**
- ✅ View all available fitness plans
- ✅ Subscribe to plans (simulated payment)
- ✅ View purchased subscriptions
- ✅ Automatic expiration tracking

### 4. **Access Control**
- ✅ Preview mode for non-subscribers (title, trainer name, price)
- ✅ Full access for subscribers (complete plan details)
- ✅ Role-based authorization

### 5. **Follow System**
- ✅ Follow/unfollow trainers
- ✅ View list of followed trainers
- ✅ Personalized feed from followed trainers

## 📁 Project Structure

```
fitplanhub-backend/
├── config/
│   └── db.js                 # Database connection
├── models/
│   ├── User.js              # User model (users & trainers)
│   ├── FitnessPlan.js       # Fitness plan model
│   ├── Subscription.js      # Subscription model
│   └── Follow.js            # Follow relationship model
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── planController.js    # Plan CRUD operations
│   ├── subscriptionController.js
│   └── followController.js  # Follow/unfollow logic
├── routes/
│   ├── authRoutes.js
│   ├── planRoutes.js
│   ├── subscriptionRoutes.js
│   └── followRoutes.js
├── middleware/
│   └── auth.js              # JWT verification & authorization
├── .env
├── .gitignore
├── package.json
└── server.js                # Entry point
```

## 🗄️ Database Schema

### Users Collection
- id, email, password (hashed), name, role (user/trainer), timestamps

### FitnessPlans Collection
- id, title, description, price, duration, trainer (ref), timestamps

### Subscriptions Collection
- id, user (ref), plan (ref), purchaseDate, expiresAt, status, timestamps

### Follows Collection
- id, follower (ref), trainer (ref), timestamps

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Step 1: Install Dependencies
```bash
cd fitplanhub-backend
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitplanhub
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

### Step 3: Start MongoDB
If using local MongoDB:
```bash
mongod
```

### Step 4: Run the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user/trainer | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |

### Fitness Plans (`/api/plans`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all plans (preview/full) | Public |
| GET | `/:id` | Get single plan | Public |
| POST | `/` | Create new plan | Trainer |
| GET | `/trainer/my-plans` | Get trainer's plans | Trainer |
| PUT | `/:id` | Update plan | Trainer (owner) |
| DELETE | `/:id` | Delete plan | Trainer (owner) |

### Subscriptions (`/api/subscriptions`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/:planId` | Subscribe to plan | User |
| GET | `/` | Get user's subscriptions | User |
| GET | `/check/:planId` | Check subscription status | User |

### Follows (`/api/follows`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/:trainerId` | Follow trainer | User |
| DELETE | `/:trainerId` | Unfollow trainer | User |
| GET | `/` | Get followed trainers | User |
| GET | `/check/:trainerId` | Check follow status | User |
| GET | `/feed/personalized` | Get personalized feed | User |

## 🧪 Testing with Postman

### 1. Register a Trainer
```json
POST http://localhost:5000/api/auth/register
Body:
{
  "name": "John Trainer",
  "email": "john@trainer.com",
  "password": "password123",
  "role": "trainer"
}
```

### 2. Register a User
```json
POST http://localhost:5000/api/auth/register
Body:
{
  "name": "Jane User",
  "email": "jane@user.com",
  "password": "password123",
  "role": "user"
}
```

### 3. Login
```json
POST http://localhost:5000/api/auth/login
Body:
{
  "email": "john@trainer.com",
  "password": "password123"
}

Response: { token: "..." }
```

### 4. Create Fitness Plan (Trainer)
```json
POST http://localhost:5000/api/plans
Headers: Authorization: Bearer <trainer_token>
Body:
{
  "title": "Fat Loss Beginner Plan",
  "description": "A comprehensive 30-day plan...",
  "price": 49.99,
  "duration": 30
}
```

### 5. Subscribe to Plan (User)
```json
POST http://localhost:5000/api/subscriptions/:planId
Headers: Authorization: Bearer <user_token>
```

### 6. Follow Trainer (User)
```json
POST http://localhost:5000/api/follows/:trainerId
Headers: Authorization: Bearer <user_token>
```

### 7. Get Personalized Feed
```json
GET http://localhost:5000/api/follows/feed/personalized
Headers: Authorization: Bearer <user_token>
```

## 🔐 Authentication Flow

1. User registers → receives JWT token
2. Include token in headers: `Authorization: Bearer <token>`
3. Protected routes verify token and attach user to request
4. Role-based routes check user.role

## 🎯 Key Features Explained

### Access Control
- **Non-subscribers**: See title, trainer name, price only
- **Subscribers**: See complete plan details including description

### Follow System
- Users can follow multiple trainers
- Get personalized feed showing plans from followed trainers
- Prevents self-following and duplicate follows

### Subscription Management
- Automatic expiration based on plan duration
- Status tracking (active/expired)
- Prevents duplicate active subscriptions

## 🐛 Troubleshooting

**MongoDB Connection Issues:**
```bash
# Check if MongoDB is running
mongo --version
mongod --version

# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac
```

**Port Already in Use:**
```bash
# Change PORT in .env file
PORT=3000
```

**JWT Token Issues:**
- Ensure JWT_SECRET is set in .env
- Check token format: `Bearer <token>`
- Verify token hasn't expired

## 📝 Notes

- All passwords are hashed before storage
- JWT tokens expire based on JWT_EXPIRE setting
- Subscriptions automatically calculate expiration
- Plans can only be modified by their creator
- Follow relationships are unique (no duplicates)

## 🚀 Next Steps

Ready to build the frontend? The API is complete and ready to be consumed by React/Vue/Angular applications.

---

**Author**: Built for FitPlanHub Project  
**Version**: 1.0.0  
**License**: ISC