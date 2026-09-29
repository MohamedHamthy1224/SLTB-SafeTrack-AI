import React from 'react';
import { AlertTriangle, Ban, X } from 'lucide-react';
import '../../../styles/uturnManagement.css';

export const DeactivateUTurnDialog = ({
  isOpen,
  unit,
  onClose,
  onConfirm,
  isSubmitting = false
}) => {
  if (!isOpen || !unit) return null;

  const unitId = unit.roadsideUnitId || unit.roadside_unit_id || unit.id;
  const locationName = unit.locationName || unit.location_name || `Unit #${unitId}`;

  return (
    <div className="uturn-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="uturn-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="uturn-modal-header">
          <div className="uturn-modal-title-wrap">
            <div className="uturn-modal-icon-badge warning">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="uturn-modal-title">Deactivate U-Turn Unit</h3>
              <p className="uturn-modal-subtitle">Roadside Unit #{unitId}</p>
            </div>
          </div>
          <button type="button" className="uturn-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="uturn-modal-body">
          <p className="uturn-modal-text">
            Are you sure you want to deactivate <strong>"{locationName}"</strong>?
          </p>
          <div className="uturn-modal-notice">
            <span className="notice-dot"></span>
            <span>
              This will update the unit status to <strong>Inactive</strong>. The historical record and logs will NOT be deleted from the database.
            </span>
          </div>
        </div>

        <div className="uturn-modal-footer">
          <button
            type="button"
            className="btn-uturn-modal-cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-uturn-modal-confirm"
            onClick={() => onConfirm(unit)}
            disabled={isSubmitting}
          >
            <Ban size={15} />
            {isSubmitting ? 'Deactivating...' : 'Deactivate Unit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeactivateUTurnDialog;
