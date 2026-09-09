import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { PoliceSidebar } from '../../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../../components/police/PoliceDashboardHeader';
import UTurnAlertDetailsCard from '../../components/police/UTurnAlertDetailsCard';
import UTurnLocationInformationCard from '../../components/police/UTurnLocationInformationCard';
import UTurnNotificationMessageCard from '../../components/police/UTurnNotificationMessageCard';
import policeUTurnAlertService from '../../services/policeUTurnAlertService';
import '../../styles/police-dashboard.css';
import '../../styles/viewUTurnAlert.css';

export const ViewUTurnAlertPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [alertData, setAlertData] = useState(location.state?.alert || null);
  const [loading, setLoading] = useState(!location.state?.alert);
  const [error, setError] = useState(null);

  const fetchAlertDetails = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await policeUTurnAlertService.getAlertById(id);
      if (response && response.data) {
        setAlertData(response.data);
      } else {
        setError('U-Turn alert not found in database.');
      }
    } catch (err) {
      console.error('Error loading alert details:', err);
      setError(err.message || 'Failed to fetch alert details from MySQL database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertDetails();
  }, [id]);

  const locationInfo = alertData?.location || alertData?.locationInfo || null;

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
            <h1 className="view-uturn-title">
              View U-Turn Alert {id ? `(#${id})` : ''}
            </h1>

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

          {/* Loading Indicator */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <RefreshCw size={24} className="spin-icon" style={{ margin: '0 auto 0.5rem auto' }} />
              <div>Loading alert record from database...</div>
            </div>
          )}

          {/* Error Banner */}
          {error && !loading && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '1.25rem',
                color: '#991b1b',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <AlertCircle size={20} color="#dc2626" />
                <span>{error}</span>
              </div>
              <div>
                <button
                  onClick={() => navigate('/police/u-turn-alerts')}
                  style={{
                    background: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.8rem'
                  }}
                >
                  Return to Alerts List
                </button>
              </div>
            </div>
          )}

          {/* Two-Column Main Grid */}
          {!loading && !error && alertData && (
            <div className="view-uturn-main-grid">
              {/* Left Column: Alert Details + Location Info */}
              <div className="left-uturn-details-column">
                <UTurnAlertDetailsCard alert={alertData} />
                <UTurnLocationInformationCard location={locationInfo} />
              </div>

              {/* Right Column: Warning Notification Message */}
              <div className="right-uturn-message-column">
                <UTurnNotificationMessageCard alert={alertData} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewUTurnAlertPage;
