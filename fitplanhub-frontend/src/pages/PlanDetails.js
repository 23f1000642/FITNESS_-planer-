import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { plansAPI, subscriptionsAPI, followsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import './PlanDetails.css';

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isUser } = useAuth();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlanDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPlanDetails = async () => {
    try {
      const planRes = await plansAPI.getById(id);
      console.log('Plan data:', planRes.data); // Debug log
      setPlan(planRes.data.data);

      if (isAuthenticated && isUser) {
        // Check subscription status
        try {
          const subRes = await subscriptionsAPI.check(id);
          setIsSubscribed(subRes.data.data?.isSubscribed || false);
        } catch (err) {
          console.log('Not subscribed:', err);
          setIsSubscribed(false);
        }

        // Check follow status
        const trainerId = planRes.data.data.trainer?._id || planRes.data.data.trainer;
        if (trainerId) {
          try {
            const followRes = await followsAPI.check(trainerId);
            setIsFollowing(followRes.data.data?.isFollowing || false);
          } catch (err) {
            console.log('Not following:', err);
            setIsFollowing(false);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch plan:', err);
      setError('Failed to load plan details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      await subscriptionsAPI.subscribe(id);
      setIsSubscribed(true);
      alert('Successfully subscribed to the plan!');
      fetchPlanDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to subscribe');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const trainerId = plan.trainer?._id || plan.trainer;
    if (!trainerId) {
      alert('Trainer information not available');
      return;
    }

    setActionLoading(true);
    try {
      if (isFollowing) {
        await followsAPI.unfollow(trainerId);
        setIsFollowing(false);
        alert('Unfollowed trainer');
      } else {
        await followsAPI.follow(trainerId);
        setIsFollowing(true);
        alert('Now following trainer!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="error-container"><p>{error}</p></div>;
  if (!plan) return <div className="error-container"><p>Plan not found</p></div>;

  const trainerName = plan.trainer?.name || 'Unknown Trainer';
  const trainerEmail = plan.trainer?.email || '';
  const trainerId = plan.trainer?._id || plan.trainer;

  return (
    <div className="plan-details">
      <div className="plan-details-container">
        <div className="plan-header">
          <div className="plan-header-content">
            <h1 className="plan-title">{plan.title}</h1>
            {plan.category && (
              <span className="plan-category-badge">{plan.category}</span>
            )}
            <div className="plan-meta-info">
              <span>📅 {plan.duration} days</span>
              <span>💪 {plan.difficulty || 'All levels'}</span>
            </div>
          </div>
          <div className="plan-price-box">
            <span className="price-label">Price</span>
            <span className="price-amount">${plan.price}</span>
          </div>
        </div>

        {trainerId && (
          <div className="trainer-info-box">
            <div className="trainer-details">
              <div className="trainer-avatar">
                {trainerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>Created by {trainerName}</h3>
                {trainerEmail && <p>{trainerEmail}</p>}
              </div>
            </div>
            {isUser && user?.id !== trainerId && (
              <button
                onClick={handleFollow}
                disabled={actionLoading}
                className={`btn-follow ${isFollowing ? 'following' : ''}`}
              >
                {isFollowing ? '✓ Following' : '+ Follow'}
              </button>
            )}
          </div>
        )}

        <div className="plan-description-box">
          <h2>Description</h2>
          <p>{plan.description}</p>
        </div>

        {isSubscribed ? (
          <div className="subscribed-box">
            <div className="subscribed-badge">✅ You have access to this plan</div>
            <div className="plan-full-content">
              <h2>Plan Details</h2>
              {plan.workouts && plan.workouts.length > 0 ? (
                <div className="workouts-list">
                  {plan.workouts.map((workout, index) => (
                    <div key={index} className="workout-item">
                      <h3>Day {workout.day}: {workout.title}</h3>
                      {workout.exercises && workout.exercises.length > 0 && (
                        <ul>
                          {workout.exercises.map((ex, i) => (
                            <li key={i}>
                              {ex.name} - {ex.sets} sets x {ex.reps}
                              {ex.notes && <span> ({ex.notes})</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>Detailed workout plan will be provided by the trainer.</p>
              )}

              {plan.nutrition && (
                <div className="nutrition-guide">
                  <h3>Nutrition Guide</h3>
                  <p>{plan.nutrition}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="subscribe-box">
            <h3>Get Full Access</h3>
            <p>Subscribe to this plan to access:</p>
            <ul>
              <li>✅ Complete workout schedule</li>
              <li>✅ Exercise instructions</li>
              <li>✅ Nutrition guidance</li>
              <li>✅ Progress tracking</li>
            </ul>
            {isUser ? (
              <button
                onClick={handleSubscribe}
                disabled={actionLoading}
                className="btn-subscribe"
              >
                {actionLoading ? 'Processing...' : `Subscribe for $${plan.price}`}
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="btn-subscribe">
                Login to Subscribe
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDetails;