import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TrainerDashboard from './pages/TrainerDashboard';
import UserDashboard from './pages/UserDashboard';
import PlanDetails from './pages/PlanDetails';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/plans/:id" element={<PlanDetails />} />

            {/* Trainer Routes */}
            <Route
              path="/trainer/dashboard"
              element={
                <ProtectedRoute requireTrainer={true}>
                  <TrainerDashboard />
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute requireUser={true}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/subscriptions"
              element={
                <ProtectedRoute requireUser={true}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;