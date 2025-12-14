import React, { useState, useEffect } from 'react';
import { followsAPI, subscriptionsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PlanCard from '../components/PlanCard';
import Loading from '../components/Loading';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [feedPlans, setFeedPlans] = useState([]);
  const [mySubscriptions, setMySubscriptions] = useState([]);
  const [followedTrainers, setFollowedTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [feedRes, subsRes, followsRes] = await Promise.all([
        followsAPI.getFeed(),
        subscriptionsAPI.getMy(),
        followsAPI.getMy(),
      ]);

      setFeedPlans(feedRes.data.data || []);
      setMySubscriptions(subsRes.data.data || []);
      setFollowedTrainers(followsRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (trainerId) => {
    if (window.confirm('Are you sure you want to unfollow this trainer?')) {
      try {
        await followsAPI.unfollow(trainerId);
        fetchDashboardData();
      } catch (err) {
        alert('Failed to unfollow trainer');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p>Your personalized fitness hub</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          📰 My Feed
        </button>
        <button
          className={`tab ${activeTab === 'subscriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          ✅ My Plans
        </button>
        <button
          className={`tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          👥 Following
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'feed' && (
          <div className="tab-content">
            <h2>Plans from Trainers You Follow</h2>
            {feedPlans.length === 0 ? (
              <div className="empty-state">
                <p>No plans in your feed yet.</p>
                <p>Follow trainers to see their plans here!</p>
              </div>
            ) : (
              <div className="plans-grid">
                {feedPlans.map((plan) => (
                  <PlanCard key={plan._id} plan={plan} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="tab-content">
            <h2>My Subscribed Plans</h2>
            {mySubscriptions.length === 0 ? (
              <div className="empty-state">
                <p>You haven't subscribed to any plans yet.</p>
                <p>Browse plans and subscribe to get started!</p>
              </div>
            ) : (
              <div className="plans-grid">
                {mySubscriptions.map((sub) => (
                  <PlanCard
                    key={sub._id}
                    plan={sub.plan}
                    isSubscribed={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'following' && (
          <div className="tab-content">
            <h2>Trainers You Follow</h2>
            {followedTrainers.length === 0 ? (
              <div className="empty-state">
                <p>You're not following any trainers yet.</p>
                <p>Visit plan details to follow trainers!</p>
              </div>
            ) : (
              <div className="trainers-list">
                {followedTrainers.map((trainer) => (
                  <div key={trainer._id} className="trainer-card">
                    <div className="trainer-info">
                      <div className="trainer-avatar">
                        {trainer.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3>{trainer.name}</h3>
                        <p>{trainer.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnfollow(trainer._id)}
                      className="btn-unfollow"
                    >
                      Unfollow
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;