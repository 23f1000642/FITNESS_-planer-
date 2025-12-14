import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PlanCard.css';

const PlanCard = ({ plan, isSubscribed = false, showActions = false, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/plans/${plan._id}`);
  };

  return (
    <div className="plan-card">
      <div className="plan-card-header">
        <h3 className="plan-card-title">{plan.title}</h3>
        <span className="plan-card-price">${plan.price}</span>
      </div>

      <p className="plan-card-description">
        {plan.description?.substring(0, 100)}
        {plan.description?.length > 100 ? '...' : ''}
      </p>

      <div className="plan-card-meta">
        <span className="plan-card-duration">📅 {plan.duration} days</span>
        {plan.trainer && (
          <span className="plan-card-trainer">
            👤 {plan.trainer.name || 'Trainer'}
          </span>
        )}
      </div>

      {plan.category && (
        <span className="plan-card-category">{plan.category}</span>
      )}

      {isSubscribed && (
        <div className="plan-card-badge">✅ Subscribed</div>
      )}

      <div className="plan-card-actions">
        {showActions ? (
          <>
            <button onClick={() => onEdit(plan)} className="btn btn-secondary">
              Edit
            </button>
            <button onClick={() => onDelete(plan._id)} className="btn btn-danger">
              Delete
            </button>
          </>
        ) : (
          <button onClick={handleClick} className="btn btn-primary">
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default PlanCard;