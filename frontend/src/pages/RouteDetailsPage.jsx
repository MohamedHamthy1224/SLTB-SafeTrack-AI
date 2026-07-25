import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import RouteInformation from '../components/routes/RouteInformation';
import AssignedBusesTable from '../components/routes/AssignedBusesTable';
import routeService from '../services/routeService';

export const RouteDetailsPage = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routeData, setRouteData] = useState(null);

  const fetchRouteDetails = useCallback(async () => {
    if (!routeId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await routeService.getRouteDetails(routeId);
      if (res.success && res.data) {
        setRouteData(res.data);
      } else {
        setError(res.message || 'Failed to load route details.');
      }
    } catch (err) {
      console.error('Error fetching route details:', err);
      const msg = err.response?.data?.message || 'Unable to retrieve route details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [routeId]);

  useEffect(() => {
    fetchRouteDetails();
  }, [fetchRouteDetails]);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          title="Route Details"
          subtitle="Detailed information and assigned bus fleet."
        />

        <main className="dashboard-content">
          {/* Breadcrumb & Action Header */}
          <div className="details-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="breadcrumb" style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                <Link to="/sltb/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Dashboard</Link>{' '}
                &gt;{' '}
                <Link to="/sltb/routes" style={{ color: '#3b82f6', textDecoration: 'none' }}>Route Management</Link>{' '}
                &gt; Route Details
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                Route Details
              </h1>
            </div>

            <div className="action-buttons-group-header" style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/sltb/routes')}
              >
                <ArrowLeft size={16} />
                <span>Back to Route Management</span>
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate(`/sltb/routes/${routeId}/edit`)}
                disabled={loading || !routeData}
              >
                <Edit3 size={16} />
                <span>Edit Route</span>
              </button>
            </div>
          </div>

          {/* Loading & Error States */}
          {loading && (
            <div className="content-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              <p style={{ fontSize: '1rem' }}>Loading route details...</p>
            </div>
          )}

          {error && (
            <div className="error-banner-alert" style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171' }}>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '1rem' }}>{error}</p>
            </div>
          )}

          {!loading && !error && routeData && (
            <>
              {/* 1. Route Summary Banner & Route Information */}
              <RouteInformation route={routeData} />

              {/* 2. Assigned Buses Table */}
              <AssignedBusesTable buses={routeData.assignedBuses || []} loading={false} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default RouteDetailsPage;
