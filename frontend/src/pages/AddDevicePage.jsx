import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import DeviceInformationForm from '../components/police/device/DeviceInformationForm';
import '../styles/police-dashboard.css';
import '../styles/addDevice.css';

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

const initialForm = {
  deviceCode: '',
  deviceName: '',
  deviceType: '',
  macAddress: '',
  ipAddress: '',
  firmwareVersion: '',
  installationDate: '',
  lastSeen: '',
  isOnline: '',
  status: '',
};

export const AddDevicePage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
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
      if (!formData[key] || formData[key].trim() === '') {
        newErrors[key] = `${label} is required.`;
      }
    });
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Frontend-only: simulate success and navigate back
    navigate('/police/device-management');
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
        <main className="add-device-container">
          {/* Page Title & Breadcrumb */}
          <div className="add-device-header-section">
            <h1 className="add-device-page-title">Add New Device</h1>
            <nav className="add-device-breadcrumb">
              <Link to="/police/device-management">Device Management</Link>
              <span className="bc-sep">&gt;</span>
              <span className="bc-current">Add New Device</span>
            </nav>
          </div>

          {/* Form */}
          <DeviceInformationForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            isEdit={false}
          />

          {/* Form Action Buttons */}
          <div className="device-form-actions">
            <Link to="/police/device-management" className="btn-form-cancel">
              <ArrowLeft size={14} />
              Cancel
            </Link>
            <button className="btn-form-save" onClick={handleSave}>
              <Save size={14} />
              Save Device
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddDevicePage;
