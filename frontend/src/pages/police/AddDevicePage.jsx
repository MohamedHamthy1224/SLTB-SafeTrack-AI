import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PoliceSidebar } from '../../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../../components/police/PoliceDashboardHeader';
import DeviceForm from '../../components/police/deviceManagement/DeviceForm';
import BusDeviceAssignment from '../../components/police/deviceManagement/BusDeviceAssignment';
import policeDeviceService from '../../services/policeDeviceService';

import '../../styles/police-dashboard.css';
import '../../styles/policeDeviceManagement.css';

const initialDeviceForm = {
  deviceCode: '',
  deviceName: '',
  deviceType: 'Bus Unit',
  macAddress: '',
  ipAddress: '',
  firmwareVersion: '',
  installationDate: new Date().toISOString().split('T')[0],
  lastSeen: '',
  isOnline: false,
  status: 'Active',
};

const initialAssignmentForm = {
  busId: '',
  installationLocation: '',
  installedDate: new Date().toISOString().split('T')[0],
  status: 'Active',
};

export const AddDevicePage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stepper state: 1 = Device Info, 2 = Bus Assignment (for Bus Unit only)
  const [currentStep, setCurrentStep] = useState(1);

  // Forms data
  const [formData, setFormData] = useState(initialDeviceForm);
  const [assignmentData, setAssignmentData] = useState(initialAssignmentForm);

  // Options
  const [deviceTypes, setDeviceTypes] = useState(['Bus Unit', 'Roadside Unit']);
  const [deviceStatuses, setDeviceStatuses] = useState(['Active', 'Inactive', 'Maintenance']);
  const [busStatuses, setBusStatuses] = useState(['Active', 'Inactive', 'Removed']);
  const [buses, setBuses] = useState([]);

  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Load dropdown options from backend
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [typesRes, statusesRes, busStatRes, busesRes] = await Promise.all([
          policeDeviceService.getDeviceTypes().catch(() => ({ data: ['Bus Unit', 'Roadside Unit'] })),
          policeDeviceService.getDeviceStatuses().catch(() => ({ data: ['Active', 'Inactive', 'Maintenance'] })),
          policeDeviceService.getBusStatuses().catch(() => ({ data: ['Active', 'Inactive', 'Removed'] })),
          policeDeviceService.getBuses().catch(() => ({ data: [] })),
        ]);

        if (typesRes && typesRes.data) setDeviceTypes(typesRes.data);
        if (statusesRes && statusesRes.data) setDeviceStatuses(statusesRes.data);
        if (busStatRes && busStatRes.data) setBusStatuses(busStatRes.data);
        if (busesRes && busesRes.data) setBuses(busesRes.data);
      } catch (err) {
        console.error('Failed to load form options:', err);
      }
    };
    loadOptions();
  }, []);

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

  // Validate Step 1
  const validateStep1 = () => {
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
    return newErrors;
  };

  // Validate Step 2 (for Bus Unit)
  const validateStep2 = () => {
    const newErrors = {};
    if (!assignmentData.busId) {
      newErrors.busId = 'Please select a bus for this unit.';
    }
    return newErrors;
  };

  // Next button click (Step 1 -> Step 2)
  const handleNext = () => {
    setApiError(null);
    const step1Errors = validateStep1();
    if (Object.keys(step1Errors).length > 0) {
      setErrors(step1Errors);
      return;
    }
    setErrors({});
    setCurrentStep(2);
  };

  // Save device submission
  const handleSave = async () => {
    setApiError(null);

    // Validate
    const step1Errors = validateStep1();
    let step2Errors = {};
    if (formData.deviceType === 'Bus Unit') {
      step2Errors = validateStep2();
    }

    const allErrors = { ...step1Errors, ...step2Errors };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      if (Object.keys(step1Errors).length > 0 && currentStep === 2) {
        setCurrentStep(1);
      }
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

      await policeDeviceService.createDevice(payload);
      // Navigate back on success
      navigate('/police/device-management');
    } catch (err) {
      console.error('Failed to create device:', err);
      if (err.errors) {
        setErrors(err.errors);
      }
      setApiError(err.message || 'Failed to save device. Please check input fields.');
    } finally {
      setIsSubmitting(false);
    }
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
        <main className="device-mgmt-container">
          {/* Breadcrumb & Title */}
          <div className="device-mgmt-header-section" style={{ marginBottom: '1.25rem' }}>
            <div className="device-mgmt-header-left">
              <nav className="view-device-breadcrumb" style={{ marginBottom: '0.4rem' }}>
                <Link to="/police/dashboard">Dashboard</Link>
                <span className="bc-sep">&gt;</span>
                <Link to="/police/device-management">Device Management</Link>
                <span className="bc-sep">&gt;</span>
                <span className="bc-current">Add New Device</span>
              </nav>
              <h1 className="device-mgmt-page-title">Add New Device</h1>
            </div>
          </div>

          {/* Error Banner */}
          {apiError && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: '#dc2626',
                fontSize: '0.825rem',
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              ⚠ {apiError}
            </div>
          )}

          {/* Form Step Rendering */}
          {currentStep === 1 ? (
            <DeviceForm
              formData={formData}
              errors={errors}
              onChange={handleDeviceChange}
              deviceTypes={deviceTypes}
              deviceStatuses={deviceStatuses}
              isEdit={false}
              onNext={handleNext}
              onSave={handleSave}
              isSubmitting={isSubmitting}
            />
          ) : (
            <BusDeviceAssignment
              deviceInfo={formData}
              assignmentData={assignmentData}
              errors={errors}
              buses={buses}
              busStatuses={busStatuses}
              onChange={handleAssignmentChange}
              onBack={() => setCurrentStep(1)}
              onSave={handleSave}
              isEdit={false}
              isSubmitting={isSubmitting}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AddDevicePage;
