import React from 'react';
import { AlertTriangle } from 'lucide-react';
import '../../../styles/userManagement.css';

const DeleteUserDialog = ({ isOpen, user, onClose, onConfirm, isSubmitting = false }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="user-modal-icon-wrap">
          <AlertTriangle size={24} />
        </div>

        <h3 className="user-modal-title">Delete User</h3>
        <p className="user-modal-desc">
          Are you sure you want to delete user{' '}
          <strong>"{user.fullName || user.username}"</strong>? This action cannot be undone.
        </p>

        <div className="user-modal-btn-group">
          <button className="btn-user-modal-cancel" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button className="btn-user-modal-delete" onClick={() => onConfirm(user)} disabled={isSubmitting}>
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserDialog;
