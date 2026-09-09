import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { PoliceSidebar } from '../../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../../components/police/PoliceDashboardHeader';
import DeviceForm from '../../components/police/deviceManagement/DeviceForm';
import BusDeviceAssignment from '../../components/police/deviceManagement/BusDeviceAssignment';
import policeDeviceService from '../../services/policeDeviceService';

import '../../styles/police-dashboard.css';
import '../../styles/policeDeviceManagement.css';

export const EditDevicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active sub-section for Bus Unit (or tab): 'info' | 'assignment'
  const [activeTab, setActiveTab] = useState('info');

  // Form states
  const [formData, setFormData] = useState({
    deviceId: '',
    deviceCode: '',
    deviceName: '',
    deviceType: 'Roadside Unit',
    macAddress: '',
    ipAddress: '',
    firmwareVersion: '',
    installationDate: '',
    lastSeen: '',
    isOnline: false,
    status: 'Active',
    createdAt: '',
  });

  const [assignmentData, setAssignmentData] = useState({
    busId: '',
    installationLocation: '',
    installedDate: '',
    status: 'Active',
  });

  // Options
  const [deviceTypes, setDeviceTypes] = useState(['Bus Unit', 'Roadside Unit']);
  const [deviceStatuses, setDeviceStatuses] = useState(['Active', 'Inactive', 'Maintenance']);
  const [busStatuses, setBusStatuses] = useState(['Active', 'Inactive', 'Removed']);
  const [buses, setBuses] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load device data and options from database
  const loadDeviceAndOptions = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setApiError(null);
    try {
      const [deviceRes, typesRes, statusesRes, busStatRes, busesRes] = await Promise.all([
        policeDeviceService.getDeviceById(id),
        policeDeviceService.getDeviceTypes().catch(() => ({ data: ['Bus Unit', 'Roadside Unit'] })),
        policeDeviceService.getDeviceStatuses().catch(() => ({ data: ['Active', 'Inactive', 'Maintenance'] })),
        policeDeviceService.getBusStatuses().catch(() => ({ data: ['Active', 'Inactive', 'Removed'] })),
        policeDeviceService.getBuses().catch(() => ({ data: [] })),
      ]);

      if (typesRes && typesRes.data) setDeviceTypes(typesRes.data);
      if (statusesRes && statusesRes.data) setDeviceStatuses(statusesRes.data);
      if (busStatRes && busStatRes.data) setBusStatuses(busStatRes.data);
      if (busesRes && busesRes.data) setBuses(busesRes.data);

      if (deviceRes && deviceRes.data) {
        const d = deviceRes.data;
        setFormData({
          deviceId: d.deviceId || d.device_id || id,
          deviceCode: d.deviceCode || d.device_code || '',
          deviceName: d.deviceName || d.device_name || '',
          deviceType: d.deviceType || d.device_type || 'Roadside Unit',
          macAddress: d.macAddress || d.mac_address || '',
          ipAddress: d.ipAddress || d.ip_address || '',
          firmwareVersion: d.firmwareVersion || d.firmware_version || '',
          installationDate: d.installationDate || d.installation_date || '',
          lastSeen: d.lastSeen || d.last_seen || '',
          isOnline: d.isOnline !== undefined ? d.isOnline : Boolean(d.is_online),
          status: d.status || 'Active',
          createdAt: d.createdAt || d.created_at || '',
        });

        if (d.assignment || d.bus_device) {
          const a = d.assignment || d.bus_device;
          setAssignmentData({
            busId: a.busId || a.bus_id || '',
            installationLocation: a.installationLocation || a.installation_location || '',
            installedDate: a.installedDate || a.installed_date || '',
            status: a.status || 'Active',
          });
        }
      }
    } catch (err) {
      console.error('Failed to load device for edit:', err);
      setApiError(err?.message || 'Failed to load device details from database.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDeviceAndOptions();
  }, [loadDeviceAndOptions]);

  const handleDeviceChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAssignmentChange = (field, value) => {
    setAssignmentData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.deviceCode || !formData.deviceCode.trim()) {
      newErrors.deviceCode = 'Device Code is required.';
    }
    if (!formData.deviceName || !formData.deviceName.trim()) {
      newErrors.deviceName = 'Device Name is required.';
    }
    if (!formData.deviceType || !formData.deviceType.trim()) {
      newErrors.deviceType = 'Device Type is required.';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required.';
    }
    if (formData.deviceType === 'Bus Unit' && !assignmentData.busId) {
      newErrors.busId = 'Please select a bus for this unit.';
    }
    return newErrors;
  };

  const handleUpdate = async () => {
    setApiError(null);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...formData,
      };

      if (formData.deviceType === 'Bus Unit') {
        payload.assignment = {
          busId: assignmentData.busId,
          installationLocation: assignmentData.installationLocation,
          installedDate: assignmentData.installedDate || formData.installationDate,
          status: assignmentData.status || 'Active',
        };
      }

      await policeDeviceService.updateDevice(id, payload);
      setShowSuccess(true);
      setTimeout(() => {
        navigate(`/police/device-management/${id}`);
      }, 1200);
    } catch (err) {
      console.error('Failed to update device:', err);
      if (err.errors) {
        setErrors(err.errors);
      }
      setApiError(err.message || 'Failed to update device. Please review input fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusUnit = formData.deviceType === 'Bus Unit';

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

        {/* Page Content */}
        <main className="device-mgmt-container">
          {/* Breadcrumb & Title */}
          <div className="device-mgmt-header-section" style={{ marginBottom: '1.25rem' }}>
            <div className="device-mgmt-header-left">
              <nav className="view-device-breadcrumb" style={{ marginBottom: '0.4rem' }}>
                <Link to="/police/dashboard">Dashboard</Link>
                <span className="bc-sep">&gt;</span>
                <Link to="/police/device-management">Device Management</Link>
                <span className="bc-sep">&gt;</span>
                <Link to={`/police/device-management/${id}`}>Device Details</Link>
                <span className="bc-sep">&gt;</span>
                <span className="bc-current">Edit Device</span>
              </nav>
              <h1 className="device-mgmt-page-title">Edit Device</h1>
            </div>
            <div className="device-mgmt-header-right">
              <Link to={`/police/device-management/${id}`} className="btn-view-back">
                <ArrowLeft size={14} />
                Back to Details
              </Link>
              <button
                className="btn-form-save"
                onClick={handleUpdate}
                disabled={isSubmitting || loading}
              >
                <Save size={14} />
                {isSubmitting ? 'Updating...' : 'Update Device'}
              </button>
            </div>
          </div>

          {/* Success Toast */}
          {showSuccess && (
            <div
              style={{
                background: '#dcfce7',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                color: '#16a34a',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle size={18} />
              Device updated successfully! Redirecting to details…
            </div>
          )}

          {/* Error Banner */}
          {apiError && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                color: '#dc2626',
                fontSize: '0.825rem',
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              ⚠ {apiError}
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem', width: 32, height: 32 }} />
              Loading existing device record from database...
            </div>
          )}

          {/* Edit Form Rendering */}
          {!loading && (
            <>
              {/* Tab selector for Bus Unit */}
              {isBusUnit && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    className={`btn-filter-reset ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                    style={{
                      background: activeTab === 'info' ? '#0047ff' : '#ffffff',
                      color: activeTab === 'info' ? '#ffffff' : '#475569',
                      borderColor: activeTab === 'info' ? '#0047ff' : '#cbd5e1',
                    }}
                  >
                    1. Device Information
                  </button>
                  <button
                    type="button"
                    className={`btn-filter-reset ${activeTab === 'assignment' ? 'active' : ''}`}
                    onClick={() => setActiveTab('assignment')}
                    style={{
                      background: activeTab === 'assignment' ? '#0047ff' : '#ffffff',
                      color: activeTab === 'assignment' ? '#ffffff' : '#475569',
                      borderColor: activeTab === 'assignment' ? '#0047ff' : '#cbd5e1',
                    }}
                  >
                    2. Bus Device Assignment
                  </button>
                </div>
              )}

              {/* Show Device Information Form */}
              {(!isBusUnit || activeTab === 'info') && (
                <DeviceForm
                  formData={formData}
                  errors={errors}
                  onChange={handleDeviceChange}
                  deviceTypes={deviceTypes}
                  deviceStatuses={deviceStatuses}
                  isEdit={true}
                  onNext={() => setActiveTab('assignment')}
                  onSave={handleUpdate}
                  isSubmitting={isSubmitting}
                />
              )}

              {/* Show Bus Device Assignment Form */}
              {isBusUnit && activeTab === 'assignment' && (
                <BusDeviceAssignment
                  deviceInfo={formData}
                  assignmentData={assignmentData}
                  errors={errors}
                  buses={buses}
                  busStatuses={busStatuses}
                  onChange={handleAssignmentChange}
                  onBack={() => setActiveTab('info')}
                  onSave={handleUpdate}
                  isEdit={true}
                  isSubmitting={isSubmitting}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditDevicePage;
