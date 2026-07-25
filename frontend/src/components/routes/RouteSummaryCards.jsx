import React from 'react';
import { GitFork, CheckCircle2, PauseCircle, MapPin } from 'lucide-react';

export const RouteSummaryCards = ({ summary, loading = false }) => {
  const cardData = summary || {};

  const {
    totalRoutes = 0,
    activeRoutes = 0,
    inactiveRoutes = 0,
    activePercentage = 0,
    inactivePercentage = 0,
    totalDistanceKm = 0
  } = cardData;

  const formattedDistance = Number(totalDistanceKm).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  return (
    <div className="route-summary-cards">
      {/* 1. Total Routes */}
      <div className="summary-card">
        <div className="summary-card-icon blue">
          <GitFork size={24} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-title">Total Routes</span>
          <h3 className="summary-card-value">{loading ? '...' : totalRoutes}</h3>
          <span className="summary-card-subtext">All registered routes</span>
        </div>
      </div>

      {/* 2. Active Routes */}
      <div className="summary-card">
        <div className="summary-card-icon green">
          <CheckCircle2 size={24} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-title">Active Routes</span>
          <h3 className="summary-card-value">{loading ? '...' : activeRoutes}</h3>
          <span className="summary-card-subtext">
            {loading ? '...' : `${Math.round(activePercentage)}% of total`}
          </span>
        </div>
      </div>

      {/* 3. Inactive Routes */}
      <div className="summary-card">
        <div className="summary-card-icon orange">
          <PauseCircle size={24} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-title">Inactive Routes</span>
          <h3 className="summary-card-value">{loading ? '...' : inactiveRoutes}</h3>
          <span className="summary-card-subtext">
            {loading ? '...' : `${Math.round(inactivePercentage)}% of total`}
          </span>
        </div>
      </div>

      {/* 4. Total Distance */}
      <div className="summary-card">
        <div className="summary-card-icon purple">
          <MapPin size={24} />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-title">Total Distance</span>
          <h3 className="summary-card-value">
            {loading ? '...' : `${formattedDistance} km`}
          </h3>
          <span className="summary-card-subtext">All routes combined</span>
        </div>
      </div>
    </div>
  );
};

export default RouteSummaryCards;
