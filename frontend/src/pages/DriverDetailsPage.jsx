import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Info, Loader2 } from 'lucide-react';

import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { driverService } from '../services/driverService';
import defaultAvatar from '../assets/images/default_driver_avatar.png';
import '../styles/driverManagement.css';

export const DriverDetailsPage = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await driverService.getDriverById(driverId);
        if (res && res.success) {
          setDriver(res.data);
        } else {
          setError(res?.message || 'Driver not found.');
        }
      } catch (err) {
        console.error('[DriverDetails] fetch error:', err);
        setError(err?.message || 'Error loading driver details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [driverId]);

  const getProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return defaultAvatar;
    if (photoPath.startsWith('http')) return photoPath;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    return `${baseUrl}/api/v1/sltb/${photoPath}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not Available';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="driver-management-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <div style={{ textAlign: 'center', color: '#64748b' }}>
              <Loader2 size={36} className="spinner" style={{ margin: '0 auto 0.5rem auto' }} />
              <p>Loading driver details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="driver-management-container">
            <div style={{ padding: '2rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, textAlign: 'center' }}>
              <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>{error || 'Driver Not Found'}</h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>The driver record could not be loaded.</p>
              <button type="button" className="add-driver-btn" onClick={() => navigate('/sltb/drivers')}>
                Back to Driver List
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const dId = driver.driver_id || driver.driverId;

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="driver-management-container">
          {/* Breadcrumbs & Header Actions */}
          <div className="driver-header-flex">
            <div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                <Link to="/sltb/drivers" style={{ color: '#0240bf', textDecoration: 'none' }}>Driver Management</Link> &gt; Driver Details
              </div>
              <h1 className="driver-page-title">Driver Details</h1>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="driver-btn-reset"
                onClick={() => navigate('/sltb/drivers')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <ArrowLeft size={16} />
                <span>Back to Driver List</span>
              </button>

              <button
                type="button"
                className="add-driver-btn"
                onClick={() => navigate(`/sltb/drivers/${dId}/edit`)}
              >
                <Pencil size={16} />
                <span>Edit Driver</span>
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="driver-details-grid">
            {/* Left Profile Sidebar Card */}
            <div className="profile-card-sidebar">
              <img
                src={getProfilePhotoUrl(driver.profile_picture || driver.profilePicture)}
                alt={driver.full_name || driver.fullName}
                className="profile-card-avatar"
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
              <div className="profile-card-name">{driver.full_name || driver.fullName}</div>
              <div className="profile-card-role">Professional Driver</div>

              <div style={{ marginTop: '0.75rem' }}>
                <span className={`badge-status ${(driver.status || 'Active').toLowerCase()}`}>
                  {driver.status || 'Active'}
                </span>
              </div>
            </div>

            {/* Right Information Cards */}
            <div className="details-content-cards">
              {/* Personal Information */}
              <div className="details-info-card">
                <h4>Personal Information</h4>
                <div className="info-display-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <span>{driver.full_name || driver.fullName || 'Not Available'}</span>
                  </div>
                  <div className="info-item">
                    <label>Date of Birth</label>
                    <span>{formatDate(driver.date_of_birth || driver.dateOfBirth)}</span>
                  </div>
                  <div className="info-item">
                    <label>Gender</label>
                    <span>{driver.gender || 'Not Available'}</span>
                  </div>
                  <div className="info-item">
                    <label>NIC Number</label>
                    <span>{driver.nic || 'Not Available'}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone Number</label>
                    <span>{driver.phone || 'Not Available'}</span>
                  </div>
                  <div className="info-item">
                    <label>Alternative Phone Number</label>
                    <span>{driver.alternative_phone_number || driver.alternativePhoneNumber || 'Not Available'}</span>
                  </div>
                  <div className="info-item" style={{ gridColumn: 'span 2' }}>
                    <label>Email Address</label>
                    <span>{driver.email_address || driver.emailAddress || 'Not Available'}</span>
                  </div>
                  <div className="info-item" style={{ gridColumn: 'span 3' }}>
                    <label>Address</label>
                    <span>{driver.address || 'Not Available'}</span>
                  </div>
                </div>
              </div>

              {/* License Information */}
              <div className="details-info-card">
                <h4>License Information</h4>
                <div className="info-display-grid">
                  <div className="info-item">
                    <label>License Number</label>
                    <span>{driver.license_number || driver.licenseNumber || 'Not Available'}</span>
                  </div>
                  <div className="info-item">
                    <label>Issue Date</label>
                    <span>{formatDate(driver.issue_date || driver.issueDate)}</span>
                  </div>
                  <div className="info-item">
                    <label>Expiry Date</label>
                    <span>{formatDate(driver.expiry_date || driver.expiryDate)}</span>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="details-info-card">
                <h4>Professional Information</h4>
                <div className="info-display-grid">
                  <div className="info-item">
                    <label>Driver ID</label>
                    <span>{`DRV${dId}`}</span>
                  </div>
                  <div className="info-item">
                    <label>Experience (Years)</label>
                    <span>{driver.experience_years ?? driver.experienceYears ?? 0}</span>
                  </div>
                  <div className="info-item">
                    <label>Join Date</label>
                    <span>{formatDate(driver.join_date || driver.joinDate)}</span>
                  </div>
                  <div className="info-item">
                    <label>Status</label>
                    <span className={`badge-status ${(driver.status || 'Active').toLowerCase()}`}>
                      {driver.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Blue Note Banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, color: '#1e40af', fontSize: '0.875rem' }}>
                <Info size={20} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Note:</strong> This information is retrieved from the system. For any changes, click the Edit Driver button.
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
