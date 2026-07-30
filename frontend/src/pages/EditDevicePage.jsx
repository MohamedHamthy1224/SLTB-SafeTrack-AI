import React, { useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import DeviceInformationForm from '../components/police/device/DeviceInformationForm';
import { mockDeviceData } from '../data/deviceMockData';
import '../styles/police-dashboard.css';
import '../styles/addDevice.css';
import '../styles/editDevice.css';

const REQUIRED_FIELDS = [
  { key: 'deviceCode', label: 'Device Code' },
  { key: 'deviceName', label: 'Device Name' },
  { key: 'deviceType', label: 'Device Type' },
  { key: 'macAddress', label: 'MAC Address' },
  { key: 'ipAddress', label: 'IP Address' },
  { key: 'firmwareVersion', label: 'Firmware Version' },
  { key: 'installationDate', label: 'Installation Date' },
  { key: 'status', label: 'Status' },
];

export const EditDevicePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Resolve device from router state or mock data
  const sourceDevice =
    location.state?.device ||
    mockDeviceData.find((d) => String(d.id) === String(id)) ||
    mockDeviceData[0];

  // Pre-fill form with existing device data
  const [formData, setFormData] = useState({
    deviceId: sourceDevice.deviceId,
    deviceCode: sourceDevice.deviceCode || '',
    deviceName: sourceDevice.deviceName || '',
    deviceType: sourceDevice.deviceType || '',
    macAddress: sourceDevice.macAddress || '',
    ipAddress: sourceDevice.ipAddress || '',
    firmwareVersion: sourceDevice.firmwareVersion || '',
    installationDate: sourceDevice.installationDate || '',
    lastSeen: sourceDevice.lastSeen
      ? sourceDevice.lastSeen.replace(' ', 'T').slice(0, 16)
      : '',
    isOnline: sourceDevice.isOnline || '',
    status: sourceDevice.status || '',
    createdAt: sourceDevice.createdAt || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    REQUIRED_FIELDS.forEach(({ key, label }) => {
      if (!formData[key] || String(formData[key]).trim() === '') {
        newErrors[key] = `${label} is required.`;
      }
    });
    return newErrors;
  };

  const handleUpdate = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Frontend-only: show success toast, then navigate back to details
    setShowSuccess(true);
    setTimeout(() => {
      navigate(`/police/device-management/${sourceDevice.id}`, {
        state: { device: { ...sourceDevice, ...formData } },
      });
    }, 1500);
  };

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
        <main className="edit-device-container">
          {/* Breadcrumb */}
          <nav className="edit-device-breadcrumb">
            <Link to="/police/dashboard">Dashboard</Link>
            <span className="bc-sep">&gt;</span>
            <Link to="/police/device-management">Device Management</Link>
            <span className="bc-sep">&gt;</span>
            <span className="bc-current">Edit Device</span>
          </nav>

          {/* Action Row */}
          <div className="edit-device-actions-row">
            <Link
              to={`/police/device-management/${sourceDevice.id}`}
              state={{ device: sourceDevice }}
              className="btn-edit-back"
            >
              <ArrowLeft size={14} />
              Back to Device Details
            </Link>
            <button className="btn-edit-update" onClick={handleUpdate}>
              <Save size={14} />
              Update Device
            </button>
          </div>

          {/* Success Toast */}
          {showSuccess && (
            <div className="edit-success-toast">
              <CheckCircle size={18} />
              Device updated successfully! Redirecting…
            </div>
          )}

          {/* Prefilled Form */}
          <DeviceInformationForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            isEdit={true}
          />

          {/* Bottom Action Row (duplicate for long forms) */}
          <div className="device-form-actions">
            <Link
              to={`/police/device-management/${sourceDevice.id}`}
              state={{ device: sourceDevice }}
              className="btn-form-cancel"
            >
              <ArrowLeft size={14} />
              Back to Device Details
            </Link>
            <button className="btn-form-save" onClick={handleUpdate}>
              <Save size={14} />
              Update Device
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditDevicePage;
