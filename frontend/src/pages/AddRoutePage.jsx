import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import RouteForm from '../components/routes/RouteForm';
import routeService from '../services/routeService';

export const AddRoutePage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const handleCreateSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerErrors({});
    setGeneralError('');

    try {
      const res = await routeService.createRoute(formData);
      if (res.success) {
        navigate('/sltb/routes');
      } else {
        if (res.errors) {
          setServerErrors(res.errors);
        }
        setGeneralError(res.message || 'Failed to create route.');
      }
    } catch (err) {
      console.error('Error creating route:', err);
      const resData = err.response?.data;
      if (resData?.errors) {
        setServerErrors(resData.errors);
      }
      setGeneralError(resData?.message || 'Unable to register route. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/sltb/routes');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          title="Add New Route"
          subtitle="Register a new SLTB bus route."
        />

        <main className="dashboard-content">
          {/* Breadcrumbs & Header */}
          <div className="page-header-nav" style={{ marginBottom: '1.5rem' }}>
            <div className="breadcrumb" style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
              <Link to="/sltb/routes" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Route Management
              </Link>{' '}
              &gt; Add New Route
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', margin: 0 }}>
              Add New Route
            </h1>
          </div>

          {generalError && (
            <div className="error-banner-alert" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171' }}>
              <p style={{ margin: 0, fontWeight: '500' }}>{generalError}</p>
            </div>
          )}

          <div className="content-card form-card">
            <RouteForm
              initialValues={{ status: 'Active' }}
              isEditMode={false}
              onSubmit={handleCreateSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              serverErrors={serverErrors}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddRoutePage;
