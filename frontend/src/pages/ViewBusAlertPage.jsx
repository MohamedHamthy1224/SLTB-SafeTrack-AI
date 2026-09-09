import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import { AlertDetailsCard } from '../components/police/bus-alerts/AlertDetailsCard';
import { BusDetailsCard } from '../components/police/bus-alerts/BusDetailsCard';
import { NotificationMessageCard } from '../components/police/bus-alerts/NotificationMessageCard';
import policeBusAlertService from '../services/policeBusAlertService';
import '../styles/police-dashboard.css';
import '../styles/view-bus-alert.css';

export const ViewBusAlertPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [alert, setAlert] = useState(location.state?.alert || null);
  const [loading, setLoading] = useState(!location.state?.alert);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAlertDetails = async () => {
      if (!id) return;
      try {
        const res = await policeBusAlertService.getAlertById(id);
        if (isMounted && res && res.data) {
          setAlert(res.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching bus alert details:', err);
          if (!alert) {
            setError(err.message || 'Unable to load bus alert details from database.');
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAlertDetails();
    return () => { isMounted = false; };
  }, [id]);

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

          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#64748B' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem', width: 32, height: 32, border: '3px solid #E2E8F0', borderTopColor: '#0047FF', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ margin: 0, fontWeight: 500 }}>Loading alert details from database...</p>
            </div>
          ) : error && !alert ? (
            <div style={{
              background: '#FEE2E2',
              border: '1px solid #F87171',
              borderRadius: '8px',
              padding: '1.5rem',
              color: '#B91C1C',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <AlertCircle size={24} />
              <div>
                <h4 style={{ margin: 0, fontWeight: 600 }}>Error Loading Alert</h4>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>{error}</p>
              </div>
            </div>
          ) : alert ? (
            <>
              {/* Full-Width Emergency Notification Message Banner */}
              <NotificationMessageCard 
                notificationTitle={alert.notificationTitle || alert.notification_title}
                priority={alert.priority}
                description={alert.description || alert.message}
                actionRequired={alert.actionRequired}
              />

              {/* Balanced Two-Column Details Grid (50% Alert Details, 50% Bus Details) */}
              <div className="view-alert-details-grid">
                <AlertDetailsCard alertData={alert} />
                <BusDetailsCard busDetails={alert.busDetails} />
              </div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default ViewBusAlertPage;
