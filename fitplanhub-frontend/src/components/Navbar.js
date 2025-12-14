import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isTrainer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          💪 FitPlanHub
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Plans
          </Link>

          {isAuthenticated ? (
            <>
              {isTrainer ? (
                <Link to="/trainer/dashboard" className="navbar-link">
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/user/dashboard" className="navbar-link">
                    My Feed
                  </Link>
                  <Link to="/user/subscriptions" className="navbar-link">
                    My Plans
                  </Link>
                </>
              )}

              <div className="navbar-user">
                <span className="navbar-username">
                  {user?.name} ({user?.role})
                </span>
                <button onClick={handleLogout} className="navbar-btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/signup" className="navbar-btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;