import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, AlertCircle } from 'lucide-react';
import { PoliceSidebar } from '../../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../../components/police/PoliceDashboardHeader';
import policeUTurnManagementService from '../../services/policeUTurnManagementService';
import '../../styles/police-dashboard.css';
import '../../styles/uturnManagement.css';

export const AddUTurnUnitPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Options from backend
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState(['Active', 'Inactive', 'Maintenance']);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    deviceId: '',
    routeId: '',
    locationName: '',
    latitude: '',
    longitude: '',
    installationDate: new Date().toISOString().slice(0, 10),
    status: 'Active',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Load dropdown options from backend
  useEffect(() => {
    const loadMetadata = async () => {
      setIsLoadingMetadata(true);
      try {
        const [devRes, routeRes, statusRes] = await Promise.all([
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
      } catch (err) {
        console.error('Failed to load metadata options:', err);
        setApiError('Unable to load device or route lists from server.');
      } finally {
        setIsLoadingMetadata(false);
      }
    };
    loadMetadata();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

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

  const strTrim = (val) => String(val).trim();

  const handleSave = async (e) => {
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
      await policeUTurnManagementService.createUTurnUnit(payload);
      navigate('/police/u-turn-management');
    } catch (err) {
      console.error('Failed to create U-turn unit:', err);
      if (err.errors) {
        setErrors(err.errors);
      }
      setApiError(err.message || 'Failed to save U-turn unit to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/police/u-turn-management');
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

        <main className="uturn-add-container">
          {/* Header Title & Breadcrumb */}
          <div className="uturn-header-section">
            <h1 className="uturn-page-title">Add New U-Turn Unit</h1>
            <nav className="uturn-breadcrumb">
              <Link to="/police/u-turn-management">U-Turn Management</Link>
              <span className="bc-sep">&gt;</span>
              <span className="bc-current">Add New U-Turn Unit</span>
            </nav>
          </div>

          {apiError && (
            <div className="uturn-alert-banner error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={18} />
              <span>{apiError}</span>
            </div>
          )}

          {/* Form Card */}
          <form className="uturn-form-card" onSubmit={handleSave}>
            <div className="uturn-section-header">
              <div className="uturn-section-badge">1</div>
              <h2 className="uturn-section-title">U-Turn Unit Information</h2>
            </div>

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
                  disabled={isLoadingMetadata}
                >
                  <option value="">
                    {isLoadingMetadata ? 'Loading devices...' : 'Select registered device'}
                  </option>
                  {deviceOptions.map((d) => (
                    <option key={d.deviceId || d.device_id} value={d.deviceId || d.device_id}>
                      {d.deviceCode || d.device_code} {d.deviceName ? `— ${d.deviceName}` : ''}
                    </option>
                  ))}
                </select>
                {errors.deviceId ? (
                  <span className="uturn-error-text">{errors.deviceId}</span>
                ) : (
                  <span className="uturn-helper-text">Select registered device from device registry</span>
                )}
              </div>

              {/* Route ID */}
              <div className="uturn-field-group">
                <label className="uturn-label">Route ID (Optional)</label>
                <select
                  className={`uturn-select ${errors.routeId ? 'error' : ''}`}
                  value={formData.routeId}
                  onChange={(e) => handleChange('routeId', e.target.value)}
                  disabled={isLoadingMetadata}
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
                  <span className="uturn-helper-text">Assign to a bus route if available</span>
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
                  placeholder="e.g. Kandy-Matale Junction, 18 Bend"
                  value={formData.locationName}
                  onChange={(e) => handleChange('locationName', e.target.value)}
                  maxLength={150}
                />
                {errors.locationName ? (
                  <span className="uturn-error-text">{errors.locationName}</span>
                ) : (
                  <span className="uturn-helper-text">Specific junction or geographic identifier</span>
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
                  <span className="uturn-helper-text">Decimal latitude (-90 to 90)</span>
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
                  <span className="uturn-helper-text">Decimal longitude (-180 to 180)</span>
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
                <span className="uturn-helper-text">Date when hardware was installed</span>
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
                  <span className="uturn-helper-text">Initial operational status</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="uturn-footer-actions">
              <button
                type="button"
                className="btn-uturn-cancel"
                onClick={handleCancel}
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
                {isSubmitting ? 'Saving...' : 'Save U-Turn Unit'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddUTurnUnitPage;
