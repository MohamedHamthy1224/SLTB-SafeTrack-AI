import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import '../../../styles/policeDeviceManagement.css';

export const DeviceForm = ({
  formData,
  errors = {},
  onChange,
  isEdit = false,
  deviceTypes = ['Bus Unit', 'Roadside Unit'],
  deviceStatuses = ['Active', 'Inactive', 'Maintenance'],
  onNext,
  onSave,
  isSubmitting = false,
}) => {
  const handleChange = (field) => (e) => {
    onChange(field, e.target.value);
  };

  const isBusUnit = formData.deviceType === 'Bus Unit';

  return (
    <div className="device-form-container">
      {/* Wizard Stepper if Adding Bus Unit */}
      {!isEdit && (
        <div className="device-wizard-stepper">
          <div className="wizard-step-item active">
            <div className="wizard-step-circle">1</div>
            <span>Device Information</span>
          </div>
          {isBusUnit && (
            <>
              <div className="wizard-step-line" />
              <div className="wizard-step-item">
                <div className="wizard-step-circle">2</div>
                <span>Bus Device Assignment</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Form Card */}
      <div className="device-form-card">
        <div className="device-form-section-header">
          <div className="device-form-section-num">
            {isEdit ? '✎' : '1'}
          </div>
          <h2 className="device-form-section-title">
            {isEdit ? 'Edit Device Information' : 'Step 1: Device Information'}
          </h2>
        </div>

        <div className="device-form-grid">
          {/* Device ID (Read-only) */}
          <div className="device-form-field">
            <label className="device-form-label">Device ID</label>
            <input
              className="device-form-input readonly"
              type="text"
              value={isEdit ? (formData.deviceId || formData.device_id || '') : 'Auto-generated on save'}
              readOnly
            />
            <span className="device-form-hint">
              {isEdit ? 'System-generated unique identifier' : 'Automatically assigned by MySQL database'}
            </span>
          </div>

          {/* Device Code */}
          <div className="device-form-field">
            <label className="device-form-label">
              Device Code <span className="required-star">*</span>
            </label>
            <input
              className={`device-form-input ${errors.deviceCode ? 'error' : ''}`}
              type="text"
              placeholder="e.g. DEV-BUS-1001 or RSU-001"
              value={formData.deviceCode || ''}
              onChange={handleChange('deviceCode')}
            />
            <span className="device-form-hint">Unique alphanumeric code for this device</span>
            {errors.deviceCode && (
              <span className="device-form-error">⚠ {errors.deviceCode}</span>
            )}
          </div>

          {/* Device Name */}
          <div className="device-form-field">
            <label className="device-form-label">
              Device Name <span className="required-star">*</span>
            </label>
            <input
              className={`device-form-input ${errors.deviceName ? 'error' : ''}`}
              type="text"
              placeholder="e.g. Front Bus Camera Unit or Junction 4 RSU"
              value={formData.deviceName || ''}
              onChange={handleChange('deviceName')}
            />
            <span className="device-form-hint">Descriptive name for the device</span>
            {errors.deviceName && (
              <span className="device-form-error">⚠ {errors.deviceName}</span>
            )}
          </div>

          {/* Device Type */}
          <div className="device-form-field">
            <label className="device-form-label">
              Device Type <span className="required-star">*</span>
            </label>
            <select
              className={`device-form-select ${errors.deviceType ? 'error' : ''}`}
              value={formData.deviceType || ''}
              onChange={handleChange('deviceType')}
            >
              <option value="">Select Device Type</option>
              {deviceTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <span className="device-form-hint">
              {formData.deviceType === 'Bus Unit'
                ? 'Requires Bus Assignment in Step 2'
                : 'Standalone roadside monitoring device'}
            </span>
            {errors.deviceType && (
              <span className="device-form-error">⚠ {errors.deviceType}</span>
            )}
          </div>

          {/* MAC Address */}
          <div className="device-form-field">
            <label className="device-form-label">MAC Address</label>
            <input
              className={`device-form-input ${errors.macAddress ? 'error' : ''}`}
              type="text"
              placeholder="e.g. 00:1A:2B:3C:4D:5E"
              value={formData.macAddress || ''}
              onChange={handleChange('macAddress')}
            />
            <span className="device-form-hint">Physical hardware address (must be unique if provided)</span>
            {errors.macAddress && (
              <span className="device-form-error">⚠ {errors.macAddress}</span>
            )}
          </div>

          {/* IP Address */}
          <div className="device-form-field">
            <label className="device-form-label">IP Address</label>
            <input
              className={`device-form-input ${errors.ipAddress ? 'error' : ''}`}
              type="text"
              placeholder="e.g. 10.10.1.101"
              value={formData.ipAddress || ''}
              onChange={handleChange('ipAddress')}
            />
            <span className="device-form-hint">Network IP address of the device</span>
            {errors.ipAddress && (
              <span className="device-form-error">⚠ {errors.ipAddress}</span>
            )}
          </div>

          {/* Firmware Version */}
          <div className="device-form-field">
            <label className="device-form-label">Firmware Version</label>
            <input
              className={`device-form-input ${errors.firmwareVersion ? 'error' : ''}`}
              type="text"
              placeholder="e.g. v2.3.4"
              value={formData.firmwareVersion || ''}
              onChange={handleChange('firmwareVersion')}
            />
            <span className="device-form-hint">Current firmware or software build</span>
            {errors.firmwareVersion && (
              <span className="device-form-error">⚠ {errors.firmwareVersion}</span>
            )}
          </div>

          {/* Installation Date */}
          <div className="device-form-field">
            <label className="device-form-label">Installation Date</label>
            <input
              className={`device-form-input ${errors.installationDate ? 'error' : ''}`}
              type="date"
              value={formData.installationDate || ''}
              onChange={handleChange('installationDate')}
            />
            <span className="device-form-hint">Date when device was physically installed</span>
            {errors.installationDate && (
              <span className="device-form-error">⚠ {errors.installationDate}</span>
            )}
          </div>

          {/* Last Seen */}
          <div className="device-form-field">
            <label className="device-form-label">Last Seen</label>
            <input
              className="device-form-input"
              type="datetime-local"
              value={formData.lastSeen ? formData.lastSeen.replace(' ', 'T').slice(0, 16) : ''}
              onChange={handleChange('lastSeen')}
            />
            <span className="device-form-hint">Last communication timestamp</span>
          </div>

          {/* Online Status */}
          <div className="device-form-field">
            <label className="device-form-label">Online Status</label>
            <select
              className="device-form-select"
              value={formData.isOnline === true || formData.isOnline === 'true' ? 'true' : 'false'}
              onChange={(e) => onChange('isOnline', e.target.value === 'true')}
            >
              <option value="false">Offline</option>
              <option value="true">Online</option>
            </select>
            <span className="device-form-hint">Current online connectivity state</span>
          </div>

          {/* Device Status */}
          <div className="device-form-field">
            <label className="device-form-label">
              Status <span className="required-star">*</span>
            </label>
            <select
              className={`device-form-select ${errors.status ? 'error' : ''}`}
              value={formData.status || 'Active'}
              onChange={handleChange('status')}
            >
              {deviceStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="device-form-hint">Operational lifecycle status</span>
            {errors.status && (
              <span className="device-form-error">⚠ {errors.status}</span>
            )}
          </div>

          {/* Created At (Read-only) */}
          <div className="device-form-field">
            <label className="device-form-label">Created At</label>
            <input
              className="device-form-input readonly"
              type="text"
              value={isEdit ? (formData.createdAt || formData.created_at || '') : 'Auto-generated on save'}
              readOnly
            />
            <span className="device-form-hint">
              {isEdit ? 'Timestamp when device record was created' : 'Set automatically upon registration'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons for Step 1 (or standalone Roadside Unit) */}
      <div className="device-form-actions">
        <Link to="/police/device-management" className="btn-form-cancel">
          <ArrowLeft size={14} />
          Cancel
        </Link>

        {isBusUnit && !isEdit ? (
          <button type="button" className="btn-form-next" onClick={onNext}>
            Next: Bus Assignment
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            className="btn-form-save"
            onClick={onSave}
            disabled={isSubmitting}
          >
            <Save size={14} />
            {isSubmitting
              ? isEdit ? 'Updating...' : 'Saving...'
              : isEdit ? 'Update Device' : 'Save Device'}
          </button>
        )}
      </div>
    </div>
  );
};

export default DeviceForm;
