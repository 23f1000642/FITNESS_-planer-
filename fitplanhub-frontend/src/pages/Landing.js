import React, { useState, useEffect } from 'react';
import { plansAPI } from '../services/api';
import PlanCard from '../components/PlanCard';
import Loading from '../components/Loading';
import './Landing.css';

const Landing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await plansAPI.getAll();
      setPlans(response.data.data);
    } catch (err) {
      setError('Failed to load plans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="landing">
      <div className="landing-hero">
        <h1 className="landing-title">🏋️ Find Your Perfect Fitness Plan</h1>
        <p className="landing-subtitle">
          Browse fitness plans created by certified trainers
        </p>
      </div>

      <div className="landing-container">
        {error && <div className="error-message">{error}</div>}

        {plans.length === 0 ? (
          <div className="no-plans">
            <h3>No plans available yet</h3>
            <p>Check back soon for new fitness plans!</p>
          </div>
        ) : (
          <>
            <h2 className="section-title">Available Plans ({plans.length})</h2>
            <div className="plans-grid">
              {plans.map((plan) => (
                <PlanCard key={plan._id} plan={plan} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Landing;