import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, Edit2, AlertCircle } from 'lucide-react';
import { PoliceSidebar } from '../../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../../components/police/PoliceDashboardHeader';
import policeUTurnManagementService from '../../services/policeUTurnManagementService';
import '../../styles/police-dashboard.css';
import '../../styles/uturnManagement.css';

export const EditUTurnUnitPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const params = useParams();
  const activeId = params.id || params.unitId;
  const navigate = useNavigate();

  // Dropdown options
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState(['Active', 'Inactive', 'Maintenance']);

  // Loading / form states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [formData, setFormData] = useState({
    deviceId: '',
    routeId: '',
    locationName: '',
    latitude: '',
    longitude: '',
    installationDate: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!activeId) return;

    const loadData = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const [unitRes, devRes, routeRes, statusRes] = await Promise.all([
          policeUTurnManagementService.getUTurnUnitById(activeId),
          policeUTurnManagementService.getDevices(),
          policeUTurnManagementService.getRoutes(),
          policeUTurnManagementService.getStatuses()
        ]);

        if (devRes && devRes.data) {
          setDeviceOptions(devRes.data);
        }
        if (routeRes && routeRes.data) {
          setRouteOptions(routeRes.data);
        }
        if (statusRes && statusRes.data && statusRes.data.length > 0) {
          setStatusOptions(statusRes.data);
        }

        if (unitRes && unitRes.data) {
          const u = unitRes.data;
          setFormData({
            deviceId: u.deviceId || u.device_id || '',
            routeId: u.routeId || u.route_id || '',
            locationName: u.locationName || u.location_name || '',
            latitude: u.latitude !== null && u.latitude !== undefined ? String(u.latitude) : '',
            longitude: u.longitude !== null && u.longitude !== undefined ? String(u.longitude) : '',
            installationDate: u.installationDate || u.installation_date || '',
            status: u.status || 'Active',
          });
        } else {
          setApiError(`Roadside unit #${activeId} could not be loaded.`);
        }
      } catch (err) {
        console.error('Failed to load unit for edit:', err);
        setApiError(err.message || 'Unable to retrieve unit details for editing.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const strTrim = (val) => String(val).trim();

  const validate = () => {
    const newErrors = {};
    if (!formData.deviceId) {
      newErrors.deviceId = 'Device selection is required.';
    }
    if (!formData.locationName || !formData.locationName.trim()) {
      newErrors.locationName = 'Location name is required.';
    } else if (formData.locationName.trim().length > 150) {
      newErrors.locationName = 'Location name must not exceed 150 characters.';
    }

    if (formData.latitude && strTrim(formData.latitude)) {
      const latNum = parseFloat(formData.latitude);
      if (isNaN(latNum) || latNum < -90 || latNum > 90) {
        newErrors.latitude = 'Latitude must be a valid number between -90 and 90.';
      }
    }

    if (formData.longitude && strTrim(formData.longitude)) {
      const lngNum = parseFloat(formData.longitude);
      if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
        newErrors.longitude = 'Longitude must be a valid number between -180 and 180.';
      }
    }

    if (!formData.status) {
      newErrors.status = 'Status selection is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    const payload = {
      deviceId: parseInt(formData.deviceId, 10),
      routeId: formData.routeId ? parseInt(formData.routeId, 10) : null,
      locationName: formData.locationName.trim(),
      latitude: formData.latitude && strTrim(formData.latitude) ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude && strTrim(formData.longitude) ? parseFloat(formData.longitude) : null,
      installationDate: formData.installationDate || null,
      status: formData.status || 'Active'
    };

    try {
      await policeUTurnManagementService.updateUTurnUnit(activeId, payload);
      navigate(`/police/u-turn-management/${activeId}`);
    } catch (err) {
      console.error('Failed to update U-turn unit:', err);
      if (err.errors) {
        setErrors(err.errors);
      }
      setApiError(err.message || 'Failed to update U-turn unit in database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToDetails = () => {
    navigate(`/police/u-turn-management/${activeId}`);
  };

  return (
    <div className="police-dashboard-layout">
      {/* Sidebar */}
      <PoliceSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="police-dashboard-main">
        <PoliceDashboardHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="uturn-edit-container">
          {/* Header Title & Top Action Buttons */}
          <div className="uturn-header-row">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Edit2 size={20} />
                </div>
                <div>
                  <h1 className="uturn-page-title">Edit Roadside U-Turn Unit #{activeId}</h1>
                </div>
              </div>
              <nav className="uturn-breadcrumb">
                <Link to="/police/dashboard">Dashboard</Link>
                <span className="bc-sep">&gt;</span>
                <Link to="/police/u-turn-management">U-Turn Management</Link>
                <span className="bc-sep">&gt;</span>
                <Link to={`/police/u-turn-management/${activeId}`}>Unit #{activeId}</Link>
                <span className="bc-sep">&gt;</span>
                <span className="bc-current">Edit</span>
              </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-uturn-cancel"
                onClick={handleBackToDetails}
                disabled={isSubmitting}
              >
                <ArrowLeft size={14} />
                Back to Details
              </button>
              <button
                type="button"
                className="btn-uturn-save"
                onClick={handleUpdate}
                disabled={isSubmitting || isLoading}
              >
                <Save size={15} />
                {isSubmitting ? 'Updating...' : 'Update U-Turn Unit'}
              </button>
            </div>
          </div>

          {apiError && (
            <div className="uturn-alert-banner error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={18} />
              <span>{apiError}</span>
            </div>
          )}

          {isLoading ? (
            <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b' }}>
              <div className="uturn-spinner" style={{ width: 32, height: 32, margin: '0 auto 1rem' }}></div>
              <p>Loading unit #{activeId} data from database...</p>
            </div>
          ) : (
            /* Form Card */
            <form className="uturn-form-card" onSubmit={handleUpdate}>
              <h2 className="uturn-section-title" style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                U-Turn Unit Information
              </h2>

              <div className="uturn-form-grid">
                {/* Device ID */}
                <div className="uturn-field-group">
                  <label className="uturn-label">
                    Device ID <span className="req">*</span>
                  </label>
                  <select
                    className={`uturn-select ${errors.deviceId ? 'error' : ''}`}
                    value={formData.deviceId}
                    onChange={(e) => handleChange('deviceId', e.target.value)}
                  >
                    <option value="">Select registered device</option>
                    {deviceOptions.map((d) => (
                      <option key={d.deviceId || d.device_id} value={d.deviceId || d.device_id}>
                        {d.deviceCode || d.device_code} {d.deviceName ? `— ${d.deviceName}` : ''}
                      </option>
                    ))}
                  </select>
                  {errors.deviceId ? (
                    <span className="uturn-error-text">{errors.deviceId}</span>
                  ) : (
                    <span className="uturn-helper-text">Assigned device from device registry</span>
                  )}
                </div>

                {/* Route ID */}
                <div className="uturn-field-group">
                  <label className="uturn-label">Route ID (Optional)</label>
                  <select
                    className={`uturn-select ${errors.routeId ? 'error' : ''}`}
                    value={formData.routeId}
                    onChange={(e) => handleChange('routeId', e.target.value)}
                  >
                    <option value="">Select route (optional)</option>
                    {routeOptions.map((r) => {
                      const rId = r.routeId || r.route_id;
                      const rNum = r.routeNumber || r.route_number;
                      const rName = r.routeName || r.route_name;
                      return (
                        <option key={rId} value={rId}>
                          {rNum ? `Route ${rNum} — ${rName}` : rName || `Route #${rId}`}
                        </option>
                      );
                    })}
                  </select>
                  {errors.routeId ? (
                    <span className="uturn-error-text">{errors.routeId}</span>
                  ) : (
                    <span className="uturn-helper-text">Assigned bus route</span>
                  )}
                </div>

                {/* Location Name */}
                <div className="uturn-field-group">
                  <label className="uturn-label">
                    Location Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className={`uturn-input ${errors.locationName ? 'error' : ''}`}
                    placeholder="Enter location name"
                    value={formData.locationName}
                    onChange={(e) => handleChange('locationName', e.target.value)}
                    maxLength={150}
                  />
                  {errors.locationName ? (
                    <span className="uturn-error-text">{errors.locationName}</span>
                  ) : (
                    <span className="uturn-helper-text">Location junction name</span>
                  )}
                </div>

                {/* Latitude */}
                <div className="uturn-field-group">
                  <label className="uturn-label">Latitude</label>
                  <input
                    type="text"
                    className={`uturn-input ${errors.latitude ? 'error' : ''}`}
                    placeholder="e.g. 7.28920000"
                    value={formData.latitude}
                    onChange={(e) => handleChange('latitude', e.target.value)}
                  />
                  {errors.latitude ? (
                    <span className="uturn-error-text">{errors.latitude}</span>
                  ) : (
                    <span className="uturn-helper-text">Decimal latitude value</span>
                  )}
                </div>

                {/* Longitude */}
                <div className="uturn-field-group">
                  <label className="uturn-label">Longitude</label>
                  <input
                    type="text"
                    className={`uturn-input ${errors.longitude ? 'error' : ''}`}
                    placeholder="e.g. 80.63370000"
                    value={formData.longitude}
                    onChange={(e) => handleChange('longitude', e.target.value)}
                  />
                  {errors.longitude ? (
                    <span className="uturn-error-text">{errors.longitude}</span>
                  ) : (
                    <span className="uturn-helper-text">Decimal longitude value</span>
                  )}
                </div>

                {/* Installation Date */}
                <div className="uturn-field-group">
                  <label className="uturn-label">Installation Date</label>
                  <div className="uturn-date-wrap">
                    <input
                      type="date"
                      className="uturn-input"
                      value={formData.installationDate}
                      onChange={(e) => handleChange('installationDate', e.target.value)}
                    />
                    <Calendar size={15} className="uturn-date-icon" />
                  </div>
                  <span className="uturn-helper-text">Hardware installation date</span>
                </div>

                {/* Status */}
                <div className="uturn-field-group">
                  <label className="uturn-label">
                    Status <span className="req">*</span>
                  </label>
                  <select
                    className={`uturn-select ${errors.status ? 'error' : ''}`}
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.status ? (
                    <span className="uturn-error-text">{errors.status}</span>
                  ) : (
                    <span className="uturn-helper-text">Current operational status</span>
                  )}
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="uturn-footer-actions">
                <button
                  type="button"
                  className="btn-uturn-cancel"
                  onClick={handleBackToDetails}
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={14} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-uturn-save"
                  disabled={isSubmitting}
                >
                  <Save size={15} />
                  {isSubmitting ? 'Updating...' : 'Update U-Turn Unit'}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditUTurnUnitPage;
