import React, { useEffect } from 'react';
import { AlertTriangle, PowerOff, X } from 'lucide-react';
import RouteStatusBadge from './RouteStatusBadge';

export const DeactivateRouteConfirmationModal = ({
  isOpen = false,
  route = null,
  isDeactivating = false,
  errorMessage = '',
  onCancel,
  onConfirm
}) => {
  // Handle escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeactivating && onCancel) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeactivating, onCancel]);

  if (!isOpen || !route) return null;

  const routeNumber = route.route_number || route.routeNumber || 'N/A';
  const routeName = route.route_name || route.routeName || 'N/A';
  const status = route.status || 'Active';

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isDeactivating && onCancel) {
      onCancel();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleOverlayClick}>
      <div className="modal-container deactivate-modal">
        {/* Close icon button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onCancel}
          disabled={isDeactivating}
          title="Close Modal"
        >
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-icon-badge warning">
            <PowerOff size={24} />
          </div>
          <h3 className="modal-title">Deactivate Route</h3>
        </div>

        <div className="modal-body">
          {errorMessage && (
            <div className="modal-error-alert">
              <AlertTriangle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="route-deactivate-details">
            <div className="deactivate-detail-row">
              <span className="detail-label">Route Number:</span>
              <strong className="detail-value font-mono">{routeNumber}</strong>
            </div>
            <div className="deactivate-detail-row">
              <span className="detail-label">Route Name:</span>
              <span className="detail-value font-semibold">{routeName}</span>
            </div>
            <div className="deactivate-detail-row">
              <span className="detail-label">Current Status:</span>
              <RouteStatusBadge status={status} />
            </div>
          </div>

          <p className="deactivate-warning-message">
            Are you sure you want to deactivate this route? The route and its history will remain in the system, but it will no longer be available for active bus assignments.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeactivating}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-danger btn-deactivate-confirm"
            onClick={onConfirm}
            disabled={isDeactivating}
          >
            <PowerOff size={16} />
            <span>{isDeactivating ? 'Deactivating...' : 'Deactivate Route'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeactivateRouteConfirmationModal;
