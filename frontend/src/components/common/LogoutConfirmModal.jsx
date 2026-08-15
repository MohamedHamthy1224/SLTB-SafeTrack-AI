import React, { useEffect, useRef } from 'react';
import { LogOut, X, Loader2, AlertCircle } from 'lucide-react';
import '../../styles/logoutModal.css';

export const LogoutConfirmModal = ({
  isOpen = false,
  isLoggingOut = false,
  errorMessage = null,
  onCancel,
  onConfirm
}) => {
  const cancelBtnRef = useRef(null);
  const confirmBtnRef = useRef(null);
  const modalBoxRef = useRef(null);

  // Keyboard navigation: Escape to cancel
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoggingOut) {
        e.preventDefault();
        onCancel?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoggingOut, onCancel]);

  // Focus management: Shift focus into modal when opened
  useEffect(() => {
    if (isOpen) {
      // Focus cancel button by default to prevent accidental logouts
      const timer = setTimeout(() => {
        if (cancelBtnRef.current) {
          cancelBtnRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isLoggingOut) {
      onCancel?.();
    }
  };

  return (
    <div 
      className="logout-modal-overlay" 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      aria-describedby="logout-modal-desc"
    >
      <div 
        className="logout-modal-card" 
        ref={modalBoxRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-right close button */}
        <button
          type="button"
          className="logout-modal-close-btn"
          onClick={onCancel}
          disabled={isLoggingOut}
          aria-label="Close logout confirmation"
          title="Cancel"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="logout-modal-header">
          <div className="logout-modal-icon-badge" aria-hidden="true">
            <LogOut size={26} />
          </div>

          <h3 id="logout-modal-title" className="logout-modal-title">
            Confirm Logout
          </h3>

          <p id="logout-modal-desc" className="logout-modal-message">
            Are you sure you want to logout?
          </p>
        </div>

        {/* Error message banner if any */}
        {errorMessage && (
          <div className="logout-modal-error" role="alert">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="logout-modal-footer">
          <button
            type="button"
            ref={cancelBtnRef}
            className="logout-btn-cancel"
            onClick={onCancel}
            disabled={isLoggingOut}
          >
            Cancel
          </button>

          <button
            type="button"
            ref={confirmBtnRef}
            className="logout-btn-confirm"
            onClick={onConfirm}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 size={16} className="logout-spinner" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut size={16} />
                <span>Yes, Logout</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
