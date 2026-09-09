import React from 'react';
import { ArrowLeft, Save, Bus, Info } from 'lucide-react';
import '../../../styles/policeDeviceManagement.css';

export const BusDeviceAssignment = ({
  deviceInfo,
  assignmentData,
  errors = {},
  buses = [],
  busStatuses = ['Active', 'Inactive', 'Removed'],
  onChange,
  onBack,
  onSave,
  isEdit = false,
  isSubmitting = false,
}) => {
  const handleChange = (field) => (e) => {
    onChange(field, e.target.value);
  };

  return (
    <div className="bus-assignment-container">
      {/* Wizard Stepper if Adding */}
      {!isEdit && (
        <div className="device-wizard-stepper">
          <div className="wizard-step-item completed">
            <div className="wizard-step-circle">✓</div>
            <span>Device Information</span>
          </div>
          <div className="wizard-step-line" />
          <div className="wizard-step-item active">
            <div className="wizard-step-circle">2</div>
            <span>Bus Device Assignment</span>
          </div>
        </div>
      )}

      {/* Device Info Summary Box */}
      <div className="device-info-card" style={{ marginBottom: '1.25rem' }}>
        <div className="device-info-card-header">
          <div className="device-info-card-icon">
            <Info size={16} />
          </div>
          <h3 className="device-info-card-title">Device Summary (Step 1)</h3>
        </div>
        <div className="device-top-summary-grid">
          <div className="device-summary-item">
            <span className="device-summary-item-label">Device Code</span>
            <span className="device-summary-item-value">{deviceInfo.deviceCode || '—'}</span>
          </div>
          <div className="device-summary-item">
            <span className="device-summary-item-label">Device Name</span>
            <span className="device-summary-item-value">{deviceInfo.deviceName || '—'}</span>
          </div>
          <div className="device-summary-item">
            <span className="device-summary-item-label">Device Type</span>
            <span className="device-summary-item-value">{deviceInfo.deviceType || 'Bus Unit'}</span>
          </div>
          <div className="device-summary-item">
            <span className="device-summary-item-label">MAC Address</span>
            <span className="device-summary-item-value" style={{ fontFamily: 'monospace' }}>
              {deviceInfo.macAddress || '—'}
            </span>
          </div>
          <div className="device-summary-item">
            <span className="device-summary-item-label">Status</span>
            <span className="device-summary-item-value">{deviceInfo.status || 'Active'}</span>
          </div>
          <div className="device-summary-item">
            <span className="device-summary-item-label">Firmware</span>
            <span className="device-summary-item-value">{deviceInfo.firmwareVersion || '—'}</span>
          </div>
        </div>
      </div>

      {/* Bus Device Assignment Form Card */}
      <div className="device-form-card">
        <div className="device-form-section-header">
          <div className="device-form-section-num">
            <Bus size={15} />
          </div>
          <h2 className="device-form-section-title">Bus Device Assignment</h2>
        </div>

        <div className="device-form-grid">
          {/* Bus ID Selection Dropdown */}
          <div className="device-form-field">
            <label className="device-form-label">
              Assigned Bus <span className="required-star">*</span>
            </label>
            <select
              className={`device-form-select ${errors.busId ? 'error' : ''}`}
              value={assignmentData.busId || assignmentData.bus_id || ''}
              onChange={handleChange('busId')}
            >
              <option value="">Select a Bus</option>
              {buses.map((b) => {
                const id = b.busId || b.bus_id;
                const num = b.busNumber || b.bus_number;
                const reg = b.registrationNumber || b.registration_number;
                return (
                  <option key={id} value={id}>
                    {num} ({reg})
                  </option>
                );
              })}
            </select>
            <span className="device-form-hint">Select the bus where this unit is installed</span>
            {errors.busId && (
              <span className="device-form-error">⚠ {errors.busId}</span>
            )}
          </div>

          {/* Installation Location */}
          <div className="device-form-field">
            <label className="device-form-label">Installation Location</label>
            <input
              className="device-form-input"
              type="text"
              placeholder="e.g. Front Dashboard, Rear Door, Driver Cabin"
              value={assignmentData.installationLocation || assignmentData.installation_location || ''}
              onChange={handleChange('installationLocation')}
            />
            <span className="device-form-hint">Physical mounting spot inside the vehicle</span>
          </div>

          {/* Installed Date */}
          <div className="device-form-field">
            <label className="device-form-label">Installed Date</label>
            <input
              className="device-form-input"
              type="date"
              value={assignmentData.installedDate || assignmentData.installed_date || ''}
              onChange={handleChange('installedDate')}
            />
            <span className="device-form-hint">Date when device was mounted on the bus</span>
          </div>

          {/* Assignment Status */}
          <div className="device-form-field">
            <label className="device-form-label">Assignment Status</label>
            <select
              className="device-form-select"
              value={assignmentData.status || 'Active'}
              onChange={handleChange('status')}
            >
              {busStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="device-form-hint">Active mounting / assignment state</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="device-form-actions">
        <button type="button" className="btn-form-back" onClick={onBack}>
          <ArrowLeft size={14} />
          Back to Device Information
        </button>

        <button
          type="button"
          className="btn-form-save"
          onClick={onSave}
          disabled={isSubmitting}
        >
          <Save size={14} />
          {isSubmitting
            ? isEdit ? 'Updating...' : 'Saving...'
            : isEdit ? 'Update Device & Assignment' : 'Save Device'}
        </button>
      </div>
    </div>
  );
};

export default BusDeviceAssignment;
