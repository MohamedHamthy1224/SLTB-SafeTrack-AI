import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import { AlertDetailsCard } from '../components/police/bus-alerts/AlertDetailsCard';
import { BusDetailsCard } from '../components/police/bus-alerts/BusDetailsCard';
import { NotificationMessageCard } from '../components/police/bus-alerts/NotificationMessageCard';
import { mockBusAlertsData } from '../data/busAlertsMockData';
import '../styles/police-dashboard.css';
import '../styles/view-bus-alert.css';

export const ViewBusAlertPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Retrieve alert item from router state or find by URL ID
  const selectedAlert = location.state?.alert || 
    mockBusAlertsData.find((item) => item.id === id || item.busAlertId === id) || 
    mockBusAlertsData[0];

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
        <main className="view-alert-container">
          {/* Header & Breadcrumbs */}
          <div className="view-alert-header-section">
            <h1 className="view-alert-title">View Bus Alert</h1>
            
            <nav className="bus-alerts-breadcrumb" style={{ marginBottom: '1.25rem' }}>
              <Link to="/police/dashboard">Dashboard</Link>
              <span className="breadcrumb-separator">&gt;</span>
              <Link to="/police/bus-alerts">Bus Alerts</Link>
              <span className="breadcrumb-separator">&gt;</span>
              <span className="breadcrumb-current">View Bus Alert</span>
            </nav>

            {/* Back Button */}
            <Link to="/police/bus-alerts" className="btn-back-link">
              <ArrowLeft size={16} />
              <span>Back to Bus Alerts</span>
            </Link>
          </div>

          {/* Full-Width Emergency Notification Message Banner */}
          <NotificationMessageCard 
            notificationTitle={selectedAlert.notificationTitle}
            priority={selectedAlert.priority}
            description={selectedAlert.description}
            actionRequired={selectedAlert.actionRequired}
          />

          {/* Balanced Two-Column Details Grid (50% Alert Details, 50% Bus Details) */}
          <div className="view-alert-details-grid">
            <AlertDetailsCard alertData={selectedAlert} />
            <BusDetailsCard busDetails={selectedAlert.busDetails} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewBusAlertPage;
