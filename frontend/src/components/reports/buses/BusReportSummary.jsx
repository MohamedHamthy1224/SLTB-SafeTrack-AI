import React from 'react';
import { Bus, CheckCircle2, Wrench, XCircle } from 'lucide-react';

export const BusReportSummary = ({ summary }) => {
  const total = summary?.totalBuses ?? 0;
  const active = summary?.activeBuses ?? 0;
  const maintenance = summary?.maintenanceBuses ?? 0;
  const inactive = summary?.inactiveBuses ?? 0;

  return (
    <div className="report-summary-cards">
      <div className="summary-card blue">
        <div className="card-icon">
          <Bus size={24} />
        </div>
        <div className="card-info">
          <span className="card-label">Total Buses</span>
          <h3 className="card-value">{total}</h3>
        </div>
      </div>

      <div className="summary-card green">
        <div className="card-icon">
          <CheckCircle2 size={24} />
        </div>
        <div className="card-info">
          <span className="card-label">Active Buses</span>
          <h3 className="card-value">{active}</h3>
        </div>
      </div>

      <div className="summary-card orange">
        <div className="card-icon">
          <Wrench size={24} />
        </div>
        <div className="card-info">
          <span className="card-label">Maintenance Buses</span>
          <h3 className="card-value">{maintenance}</h3>
        </div>
      </div>

      <div className="summary-card red">
        <div className="card-icon">
          <XCircle size={24} />
        </div>
        <div className="card-info">
          <span className="card-label">Inactive Buses</span>
          <h3 className="card-value">{inactive}</h3>
        </div>
      </div>
    </div>
  );
};

export default BusReportSummary;
