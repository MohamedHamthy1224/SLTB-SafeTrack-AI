import React from 'react';
import { AlertTriangle } from 'lucide-react';
import '../../../styles/uturnManagement.css';

const DeleteUTurnDialog = ({ isOpen, unit, onClose, onConfirm }) => {
  if (!isOpen || !unit) return null;

  return (
    <div className="uturn-modal-overlay" onClick={onClose}>
      <div className="uturn-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="uturn-modal-icon-wrap">
          <AlertTriangle size={26} />
        </div>

        <h3 className="uturn-modal-title">Delete U-Turn Unit</h3>
        <p className="uturn-modal-desc">
          Are you sure you want to delete U-turn unit{' '}
          <strong>"{unit.roadsideUnitId} - {unit.locationName}"</strong>? This action cannot be undone.
        </p>

        <div className="uturn-modal-btn-group">
          <button
            type="button"
            className="btn-uturn-modal-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-uturn-modal-delete"
            onClick={() => onConfirm(unit)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUTurnDialog;
