import React, { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import defaultAvatar from '../../../assets/images/default_driver_avatar.png';
import { getProfileImageUrl } from '../../../utils/profileImageUrl';
import '../../../styles/settings.css';

/**
 * ProfilePictureCard — left column of the Profile Settings (edit) page.
 * Shows avatar with camera overlay, Change Photo button, and upload hints.
 */
const ProfilePictureCard = ({ name, currentPhoto, imagePreview, updatedAt, onPhotoChange, fileError }) => {
  const fileInputRef = useRef(null);

  const displaySrc = imagePreview || getProfileImageUrl(currentPhoto, updatedAt);

  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="settings-picture-card">
      <h3 className="settings-picture-card-title">Profile Picture</h3>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onPhotoChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: 'none' }}
      />

      {fileError && (
        <div style={{ color: '#ef4444', fontSize: '0.78rem', marginBottom: '0.75rem', textAlign: 'center' }}>
          {fileError}
        </div>
      )}

      {/* Avatar with camera button */}
      <div className="settings-picture-avatar-wrap" onClick={handleTriggerUpload} style={{ cursor: 'pointer' }}>
        <img
          src={displaySrc}
          alt={name || 'Profile'}
          className="settings-picture-avatar-img"
          onError={(e) => {
            e.currentTarget.src = defaultAvatar;
          }}
        />
        <div className="settings-picture-camera-btn">
          <Camera size={12} />
        </div>
      </div>

      {/* Change Photo */}
      <button className="btn-change-photo" type="button" onClick={handleTriggerUpload}>
        <Upload size={13} />
        Change Photo
      </button>

      <p className="settings-picture-hint">
        JPG, PNG, GIF or WEBP. Max size 2MB.
      </p>
    </div>
  );
};

export default ProfilePictureCard;
