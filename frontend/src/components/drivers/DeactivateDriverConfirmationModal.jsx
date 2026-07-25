import React from 'react';
import { AlertTriangle, PowerOff, X, Loader2 } from 'lucide-react';

export const DeactivateDriverConfirmationModal = ({
  isOpen,
  driver,
  isDeactivating,
  errorMessage,
  onCancel,
  onConfirm
}) => {
  if (!isOpen || !driver) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="deactivate-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-warning">
          <div style={{ padding: 8, background: '#fee2e2', borderRadius: '50%', display: 'flex' }}>
            <PowerOff size={22} color="#ef4444" />
          </div>
          <h3>Deactivate Driver</h3>
          <button 
            type="button"
            onClick={onCancel} 
            disabled={isDeactivating}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
          Are you sure you want to deactivate this driver? The driver record and history will remain in the system, but the driver will no longer be available for active bus assignments.
        </p>

        <div className="modal-info-box">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>DRIVER ID</span>
              <strong style={{ color: '#0f172a' }}>{driver.driver_id || driver.driverId}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>FULL NAME</span>
              <strong style={{ color: '#0f172a' }}>{driver.full_name || driver.fullName}</strong>
            </div>
            <div style={{ marginTop: '0.4rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>LICENCE NUMBER</span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>{driver.license_number || driver.licenseNumber || 'Not Available'}</span>
            </div>
            <div style={{ marginTop: '0.4rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>CURRENT STATUS</span>
              <span className={`badge-status ${(driver.status || '').toLowerCase()}`}>
                {driver.status || 'Active'}
              </span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div style={{ padding: '0.625rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, color: '#b91c1c', fontSize: '0.8125rem', marginBottom: '1rem' }}>
            {errorMessage}
          </div>
        )}

        <div className="modal-actions-bar">
          <button 
            type="button" 
            className="driver-btn-reset" 
            onClick={onCancel}
            disabled={isDeactivating}
          >
            Cancel
          </button>

          <button 
            type="button" 
            style={{ 
              backgroundColor: '#dc2626', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: 8, 
              padding: '0.625rem 1.25rem', 
              fontWeight: 600, 
              fontSize: '0.875rem', 
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onClick={onConfirm}
            disabled={isDeactivating}
          >
            {isDeactivating ? (
              <>
                <Loader2 size={16} className="spinner" />
                <span>Deactivating...</span>
              </>
            ) : (
              <span>Deactivate Driver</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
