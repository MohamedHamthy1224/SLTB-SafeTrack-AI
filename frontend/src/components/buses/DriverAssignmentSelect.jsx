import React, { useEffect, useState } from 'react';
import { driverService } from '../../services/driverService';
import { UserCheck } from 'lucide-react';

export const DriverAssignmentSelect = ({ value, onChange, error, excludeBusId = null }) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await driverService.getDriverOptions(
          excludeBusId ? { exclude_bus_id: excludeBusId } : {}
        );
        if (response.success && Array.isArray(response.data)) {
          setDrivers(response.data);
        }
      } catch (err) {
        console.error("Failed to load drivers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, [excludeBusId]);

  return (
    <div className="form-group select-assignment-group">
      <label className="form-label required">Driver</label>
      <div className="select-input-wrapper">
        <select
          className={`form-select ${error ? 'is-invalid' : ''}`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
        >
          <option value="">{loading ? "Loading drivers..." : "Select Driver"}</option>
          {drivers.map((driver) => {
            const isAvailable = driver.isAvailable;
            const isActive = driver.status === 'Active';
            const isDisabled = !isActive || (!isAvailable && String(driver.driverId) !== String(value));

            let statusLabel = '';
            if (!isActive) statusLabel = ' (Inactive)';
            else if (!isAvailable && String(driver.driverId) !== String(value)) statusLabel = ' (Already Assigned)';

            return (
              <option
                key={driver.driverId}
                value={driver.driverId}
                disabled={isDisabled}
              >
                {driver.driverId} - {driver.fullName} - {driver.licenseNumber}{statusLabel}
              </option>
            );
          })}
        </select>
        <UserCheck size={18} className="select-icon" />
      </div>
      {error && <span className="error-message">{error}</span>}
      <div className="info-box info-green" style={{ marginTop: '0.5rem' }}>
        <span>✔ Only active and available drivers are shown.</span>
      </div>
    </div>
  );
};

export default DriverAssignmentSelect;
