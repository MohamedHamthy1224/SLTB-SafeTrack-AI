import React from 'react';
import { Camera, Upload } from 'lucide-react';
import defaultAvatar from '../../../assets/images/default_driver_avatar.png';
import '../../../styles/settings.css';

/**
 * ProfilePictureCard — left column of the Profile Settings (edit) page.
 * Shows avatar with camera overlay, Change Photo button, and upload hints.
 */
const ProfilePictureCard = ({ name }) => {
  return (
    <div className="settings-picture-card">
      <h3 className="settings-picture-card-title">Profile Picture</h3>

      {/* Avatar with camera button */}
      <div className="settings-picture-avatar-wrap">
        <img
          src={defaultAvatar}
          alt={name}
          className="settings-picture-avatar-img"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="settings-picture-camera-btn">
          <Camera size={12} />
        </div>
      </div>

      {/* Change Photo */}
      <button className="btn-change-photo">
        <Upload size={13} />
        Change Photo
      </button>

      <p className="settings-picture-hint">
        JPG, PNG or GIF. Max size 2MB.
      </p>
    </div>
  );
};

export default ProfilePictureCard;
