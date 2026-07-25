import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { getProfileImageUrl } from '../../utils/profileImageUrl';

export const ProfilePhotoEditor = ({
  currentPhoto,
  imagePreview,
  updatedAt,
  onPhotoChange,
  fileError
}) => {
  const fileInputRef = useRef(null);

  const displayUrl = imagePreview || getProfileImageUrl(currentPhoto, updatedAt);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="profile-card photo-editor-card">
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', width: '100%', textAlign: 'left', marginBottom: '1.5rem' }}>
        Profile Picture
      </h3>

      <div className="profile-avatar-wrapper">
        <div className="profile-avatar-circle">
          <img
            src={displayUrl}
            alt="Profile Preview"
            className="profile-avatar-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        <div className="profile-avatar-badge">
          <Camera size={16} />
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onPhotoChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: 'none' }}
      />

      <button type="button" className="btn-change-photo" onClick={handleButtonClick}>
        <span>Change Photo</span>
      </button>

      <p className="photo-hint-text">JPG, PNG or GIF. Max size 2MB.</p>

      {fileError && <p className="error-text" style={{ marginTop: '0.5rem' }}>{fileError}</p>}
    </div>
  );
};

export default ProfilePhotoEditor;
