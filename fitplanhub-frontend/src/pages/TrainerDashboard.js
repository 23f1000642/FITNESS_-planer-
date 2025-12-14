import React, { useState, useEffect } from 'react';
import { plansAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PlanCard from '../components/PlanCard';
import Loading from '../components/Loading';
import './TrainerDashboard.css';

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    category: 'general',
  });

  useEffect(() => {
    fetchMyPlans();
  }, []);

  const fetchMyPlans = async () => {
    try {
      const response = await plansAPI.getAll();
      // Filter plans created by this trainer
      const myPlans = response.data.data.filter(
        (plan) => plan.trainer?._id === user.id || plan.trainer === user.id
      );
      setPlans(myPlans);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingPlan) {
        await plansAPI.update(editingPlan._id, formData);
      } else {
        await plansAPI.create(formData);
      }
      
      setShowModal(false);
      setEditingPlan(null);
      setFormData({ title: '', description: '', price: '', duration: '', category: 'general' });
      fetchMyPlans();
    } catch (err) {
      alert('Failed to save plan: ' + err.response?.data?.message);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      category: plan.category || 'general',
    });
    setShowModal(true);
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await plansAPI.delete(planId);
        fetchMyPlans();
      } catch (err) {
        alert('Failed to delete plan');
      }
    }
  };

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({ title: '', description: '', price: '', duration: '', category: 'general' });
    setShowModal(true);
  };

  if (loading) return <Loading />;

  return (
    <div className="trainer-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>My Fitness Plans</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>
        <button onClick={openCreateModal} className="btn-create">
          + Create New Plan
        </button>
      </div>

      <div className="dashboard-container">
        {plans.length === 0 ? (
          <div className="no-plans">
            <h3>You haven't created any plans yet</h3>
            <p>Click "Create New Plan" to get started!</p>
          </div>
        ) : (
          <div className="plans-grid">
            {plans.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Fat Loss Beginner Plan"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe your fitness plan..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Duration (days)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="general">General</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                  <option value="flexibility">Flexibility</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingPlan ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;