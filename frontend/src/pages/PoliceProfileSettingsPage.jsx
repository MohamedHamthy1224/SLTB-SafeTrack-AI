import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCheck, Loader2 } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import SettingsTabs from '../components/police/settings/SettingsTabs';
import ProfilePictureCard from '../components/police/settings/ProfilePictureCard';
import ProfileEditForm from '../components/police/settings/ProfileEditForm';
import PasswordCard from '../components/police/settings/PasswordCard';
import { profileService } from '../services/profileService';
import { useAuth } from '../hooks/useAuth';
import '../styles/police-dashboard.css';
import '../styles/settings.css';

/**
 * PoliceProfileSettingsPage — /police/settings/profile
 * Shows Profile Settings tab active with editable form and change password section.
 */
export const PoliceProfileSettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { updateCurrentUserProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [initialProfile, setInitialProfile] = useState(null);

  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    email: '',
    role: '',
    badgeNumber: '',
    rank: '',
    policeStation: '',
    phone: '',
    joinedDate: '',
    status: 'Active'
  });

  // Photo upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileError, setFileError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      setLoading(true);
      setServerError(null);
      try {
        const res = await profileService.getProfile();
        if (isMounted) {
          if (res && res.success && res.data) {
            const p = res.data;
            setInitialProfile(p);
            setFormData({
              displayName: p.displayName || p.fullName || p.full_name || '',
              username: p.username || '',
              email: p.email || p.emailAddress || '',
              role: p.role || p.roleName || '',
              badgeNumber: p.badgeNumber || p.badge_number || '',
              rank: p.rank || '',
              policeStation: p.policeStation || p.police_station || p.department || '',
              phone: p.phone || '',
              joinedDate: p.joinedDate || p.joined_date || '',
              status: p.status || 'Active'
            });
          } else {
            setServerError(res?.message || 'Failed to load profile data.');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('[PoliceProfileSettingsPage] load error:', err);
          setServerError(err?.message || 'Unable to connect to server.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (field, value) => {
    setServerError(null);
    setServerSuccess(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setFileError(null);
    setServerError(null);
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type.toLowerCase())) {
      setFileError('Invalid file format. Allowed formats: JPG, JPEG, PNG, GIF, WEBP.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFileError('File size exceeds maximum limit of 2 MB.');
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setServerError(null);
    setServerSuccess(null);

    try {
      const payload = {
        full_name: formData.displayName,
        displayName: formData.displayName,
        email: formData.email,
        email_address: formData.email,
        rank: formData.rank,
        police_station: formData.policeStation,
        policeStation: formData.policeStation,
        phone: formData.phone,
        badge_number: formData.badgeNumber,
        status: formData.status
      };

      const fd = new FormData();
      fd.append('profile_data', JSON.stringify(payload));
      if (selectedFile) {
        fd.append('profile_image', selectedFile);
      }

      const res = await profileService.updateProfile(fd);
      if (res && res.success && res.data) {
        setServerSuccess('Profile updated successfully.');
        if (updateCurrentUserProfile) {
          updateCurrentUserProfile(res.data);
        }
        setTimeout(() => {
          navigate('/police/settings');
        }, 800);
      } else {
        setServerError(res?.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('[PoliceProfileSettingsPage] submit error:', err);
      const msg = err?.message || err?.errors?.email_address || err?.errors?.email || 'Unable to update profile. Please check your information and try again.';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (initialProfile) {
      setFormData({
        displayName: initialProfile.displayName || initialProfile.fullName || '',
        username: initialProfile.username || '',
        email: initialProfile.email || '',
        role: initialProfile.role || '',
        badgeNumber: initialProfile.badgeNumber || '',
        rank: initialProfile.rank || '',
        policeStation: initialProfile.policeStation || '',
        phone: initialProfile.phone || '',
        joinedDate: initialProfile.joinedDate || '',
        status: initialProfile.status || 'Active'
      });
      setSelectedFile(null);
      setImagePreview(null);
      setFileError(null);
    }
    navigate('/police/settings');
  };

  return (
    <div className="police-dashboard-layout">
      <PoliceSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="police-dashboard-main">
        <PoliceDashboardHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="settings-container">
          {/* Page Title & Breadcrumb */}
          <h1 className="settings-page-title">Settings</h1>
          <nav className="settings-breadcrumb">
            <Link to="/police/dashboard">Dashboard</Link>
            <span className="bc-sep">&gt;</span>
            <span className="bc-current">Settings</span>
          </nav>

          {/* Tabs */}
          <SettingsTabs />

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px', color: '#64748b' }}>
              <Loader2 size={36} className="spinner" style={{ marginBottom: '0.75rem' }} />
              <p>Loading edit profile form...</p>
            </div>
          ) : (
            <form onSubmit={handleUpdate}>
              {serverError && (
                <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {serverError}
                </div>
              )}

              {serverSuccess && (
                <div style={{ padding: '0.75rem 1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {serverSuccess}
                </div>
              )}

              {/* Two-column: Picture | Form */}
              <div className="settings-edit-layout">
                <ProfilePictureCard
                  name={formData.displayName}
                  currentPhoto={initialProfile?.profileImage || initialProfile?.profile_image}
                  imagePreview={imagePreview}
                  updatedAt={initialProfile?.updatedAt || initialProfile?.updated_at}
                  onPhotoChange={handlePhotoChange}
                  fileError={fileError}
                />
                <ProfileEditForm formData={formData} onChange={handleChange} />
              </div>

              {/* Change Password Section */}
              <PasswordCard />

              {/* Form Footer Actions */}
              <div className="settings-form-footer">
                <button type="button" className="btn-settings-cancel" onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-update-profile" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 size={14} className="spinner" /> : <UserCheck size={14} />}
                  <span>{isSubmitting ? 'Updating Profile...' : 'Update Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <p className="settings-page-footer">
            © 2025 SLTB SafeTrack AI. All rights reserved.
          </p>
        </main>
      </div>
    </div>
  );
};

export default PoliceProfileSettingsPage;
