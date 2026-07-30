import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import UTurnAlertDetailsCard from '../components/police/UTurnAlertDetailsCard';
import UTurnLocationInformationCard from '../components/police/UTurnLocationInformationCard';
import UTurnNotificationMessageCard from '../components/police/UTurnNotificationMessageCard';
import { mockUTurnAlertsData } from '../data/uTurnAlertsMockData';
import '../styles/police-dashboard.css';
import '../styles/viewUTurnAlert.css';

export const ViewUTurnAlertPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Retrieve alert from router state or find by URL ID
  const selectedAlert =
    location.state?.alert ||
    mockUTurnAlertsData.find(
      (item) => item.id === id || item.roadsideAlertId === id
    ) ||
    mockUTurnAlertsData[0];

  const locationInfo = selectedAlert?.locationInfo || null;

  return (
    <div className="police-dashboard-layout">
      {/* Sidebar */}
      <PoliceSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="police-dashboard-main">
        {/* Sticky Header */}
        <PoliceDashboardHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Container */}
        <main className="view-uturn-container">
          {/* Page Title & Breadcrumbs */}
          <div className="view-uturn-header-section">
            <h1 className="view-uturn-title">View U-Turn Alert</h1>

            <nav className="uturn-alerts-breadcrumb" style={{ marginBottom: '1.25rem' }}>
              <Link to="/police/dashboard">Dashboard</Link>
              <span className="breadcrumb-separator">&gt;</span>
              <Link to="/police/u-turn-alerts">U-Turn Alerts</Link>
              <span className="breadcrumb-separator">&gt;</span>
              <span className="breadcrumb-current">View U-Turn Alert</span>
            </nav>

            {/* Back Button */}
            <Link to="/police/u-turn-alerts" className="btn-back-link">
              <ArrowLeft size={15} />
              <span>Back to U-Turn Alerts</span>
            </Link>
          </div>

          {/* Two-Column Main Grid */}
          <div className="view-uturn-main-grid">
            {/* Left Column: Alert Details + Location Info */}
            <div className="left-uturn-details-column">
              <UTurnAlertDetailsCard alert={selectedAlert} />
              <UTurnLocationInformationCard location={locationInfo} />
            </div>

            {/* Right Column: Warning Notification Message */}
            <div className="right-uturn-message-column">
              <UTurnNotificationMessageCard alert={selectedAlert} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewUTurnAlertPage;
