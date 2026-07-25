import React from 'react';
import { Bus, CheckCircle2, Wrench, AlertTriangle, Route } from 'lucide-react';

export const BusSummaryCards = ({ summary }) => {
  if (!summary) return null;

  const {
    totalBuses = 0,
    activeBuses = 0,
    activePercentage = 0,
    maintenanceBuses = 0,
    maintenancePercentage = 0,
    inactiveBuses = 0,
    inactivePercentage = 0,
    routesCovered = 0
  } = summary;

  return (
    <div className="bus-summary-cards-grid">
      {/* 1. Total Buses */}
      <div className="summary-card card-total">
        <div className="card-header-icon total-icon">
          <Bus size={22} />
        </div>
        <div className="card-info">
          <span className="card-title">Total Buses</span>
          <h3 className="card-value">{totalBuses}</h3>
          <span className="card-subtext">All registered buses</span>
        </div>
      </div>

      {/* 2. Active Buses */}
      <div className="summary-card card-active">
        <div className="card-header-icon active-icon">
          <CheckCircle2 size={22} />
        </div>
        <div className="card-info">
          <span className="card-title">Active Buses</span>
          <h3 className="card-value">{activeBuses}</h3>
          <span className="card-subtext">{activePercentage}% of total</span>
        </div>
      </div>

      {/* 3. In Maintenance */}
      <div className="summary-card card-maintenance">
        <div className="card-header-icon maintenance-icon">
          <Wrench size={22} />
        </div>
        <div className="card-info">
          <span className="card-title">In Maintenance</span>
          <h3 className="card-value">{maintenanceBuses}</h3>
          <span className="card-subtext">{maintenancePercentage}% of total</span>
        </div>
      </div>

      {/* 4. Inactive Buses */}
      <div className="summary-card card-inactive">
        <div className="card-header-icon inactive-icon">
          <AlertTriangle size={22} />
        </div>
        <div className="card-info">
          <span className="card-title">Inactive Buses</span>
          <h3 className="card-value">{inactiveBuses}</h3>
          <span className="card-subtext">{inactivePercentage}% of total</span>
        </div>
      </div>

      {/* 5. Routes Covered */}
      <div className="summary-card card-routes">
        <div className="card-header-icon routes-icon">
          <Route size={22} />
        </div>
        <div className="card-info">
          <span className="card-title">Routes Covered</span>
          <h3 className="card-value">{routesCovered}</h3>
          <span className="card-subtext">Active routes</span>
        </div>
      </div>
    </div>
  );
};

export default BusSummaryCards;
