# FitPlanHub - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Project Structure
```bash
cd gunjan
mkdir fitplanhub-backend
cd fitplanhub-backend
```

### Step 2: Initialize and Install
```bash
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv cors
npm install --save-dev nodemon
```

### Step 3: Create Folder Structure
```bash
mkdir config models controllers routes middleware
```

### Step 4: Create Files
Copy the following files from the artifacts into your project:

#### Root Files:
- `.env`
- `.gitignore`
- `package.json`
- `server.js`
- `README.md`
- `FitPlanHub.postman_collection.json`

#### config/:
- `db.js`

#### models/:
- `User.js`
- `FitnessPlan.js`
- `Subscription.js`
- `Follow.js`

#### controllers/:
- `authController.js`
- `planController.js`
- `subscriptionController.js`
- `followController.js`

#### routes/:
- `authRoutes.js`
- `planRoutes.js`
- `subscriptionRoutes.js`
- `followRoutes.js`

#### middleware/:
- `auth.js`

### Step 5: Configure Environment
Edit `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitplanhub
JWT_SECRET=your_secret_change_this_to_something_random
JWT_EXPIRE=7d
NODE_ENV=development
```

### Step 6: Start MongoDB
```bash
# If MongoDB is installed locally
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

### Step 7: Run the Server
```bash
npm run dev
```

You should see:
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

### Step 8: Test the API

#### Open Postman and import the collection:
- Import `FitPlanHub.postman_collection.json`
- Set baseUrl variable to `http://localhost:5000/api`

#### Or use cURL:

**Register a Trainer:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Trainer",
    "email": "john@trainer.com",
    "password": "password123",
    "role": "trainer"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@trainer.com",
    "password": "password123"
  }'
```

Save the token from the response!

**Create a Plan:**
```bash
curl -X POST http://localhost:5000/api/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Fat Loss Plan",
    "description": "Comprehensive fat loss program",
    "price": 49.99,
    "duration": 30
  }'
```

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Server starts without errors
- [ ] Can register a trainer
- [ ] Can register a user
- [ ] Can login and receive JWT token
- [ ] Trainer can create a plan
- [ ] User can view all plans
- [ ] User can subscribe to a plan
- [ ] User can follow a trainer
- [ ] User can view personalized feed

## 🐛 Common Issues

**"MongoServerError: connect ECONNREFUSED"**
- MongoDB is not running. Start it with `mongod`

**"Port 5000 is already in use"**
- Change PORT in .env to 3000 or another available port

**"UnauthorizedError: jwt malformed"**
- Token format should be: `Bearer <token>`
- Make sure there's a space after "Bearer"

**"Cannot find module"**
- Run `npm install` again
- Check all files are in correct folders

## 🎯 Test Workflow

1. **Register Trainer** → Get token
2. **Create Plan** → Note planId
3. **Register User** → Get token
4. **View All Plans** → See preview
5. **Subscribe to Plan** → Get full access
6. **Follow Trainer** → Get trainerId
7. **View Feed** → See plans from followed trainers

## 📚 Resources

- MongoDB Compass: Visual MongoDB GUI
- Postman: API testing
- VS Code Extensions: MongoDB for VS Code

## 🎉 Success!

If you can complete the test workflow, your backend is fully functional!

Next step: Build the frontend to interact with these APIs.