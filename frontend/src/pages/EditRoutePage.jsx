import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import RouteForm from '../components/routes/RouteForm';
import routeService from '../services/routeService';

export const EditRoutePage = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [serverErrors, setServerErrors] = useState({});
  const [initialData, setInitialData] = useState(null);

  const fetchRouteForEdit = useCallback(async () => {
    if (!routeId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await routeService.getRouteDetails(routeId);
      if (res.success && res.data) {
        setInitialData(res.data);
      } else {
        setError(res.message || 'Failed to load route data for editing.');
      }
    } catch (err) {
      console.error('Error fetching route for edit:', err);
      setError(err.response?.data?.message || 'Unable to retrieve route for editing.');
    } finally {
      setLoading(false);
    }
  }, [routeId]);

  useEffect(() => {
    fetchRouteForEdit();
  }, [fetchRouteForEdit]);

  const handleUpdateSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerErrors({});
    setError(null);

    try {
      const res = await routeService.updateRoute(routeId, formData);
      if (res.success) {
        navigate(`/sltb/routes/${routeId}`);
      } else {
        if (res.errors) {
          setServerErrors(res.errors);
        }
        setError(res.message || 'Failed to update route.');
      }
    } catch (err) {
      console.error('Error updating route:', err);
      const resData = err.response?.data;
      if (resData?.errors) {
        setServerErrors(resData.errors);
      }
      setError(resData?.message || 'Unable to update route. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/sltb/routes/${routeId}`);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          title="Edit Route"
          subtitle="Modify route details and status."
        />

        <main className="dashboard-content">
          {/* Breadcrumbs & Header */}
          <div className="page-header-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="breadcrumb" style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                <Link to="/sltb/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Dashboard</Link>{' '}
                &gt;{' '}
                <Link to="/sltb/routes" style={{ color: '#94a3b8', textDecoration: 'none' }}>Route Management</Link>{' '}
                &gt; Edit Route
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                Edit Route
              </h1>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              <ArrowLeft size={16} />
              <span>Back to Route Details</span>
            </button>
          </div>

          {loading && (
            <div className="content-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              <p style={{ fontSize: '1rem' }}>Loading route data...</p>
            </div>
          )}

          {error && (
            <div className="error-banner-alert" style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171' }}>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '1rem' }}>{error}</p>
            </div>
          )}

          {!loading && initialData && (
            <div className="content-card form-card">
              <RouteForm
                initialValues={initialData}
                isEditMode={true}
                onSubmit={handleUpdateSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
                serverErrors={serverErrors}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditRoutePage;
