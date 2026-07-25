import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Loader2 } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { ProfilePhotoEditor } from '../components/profile/ProfilePhotoEditor';
import { ProfileForm } from '../components/profile/ProfileForm';
import { ChangePasswordForm } from '../components/profile/ChangePasswordForm';
import { profileSchema } from '../schemas/profileSchemas';
import { profileService } from '../services/profileService';
import { useAuth } from '../hooks/useAuth';
import { useProfileSocket } from '../hooks/useProfileSocket';
import '../styles/profile.css';

export const EditProfilePage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { updateCurrentUserProfile } = useAuth();
  useProfileSocket();

  const [initialLoading, setInitialLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  // Photo upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileError, setFileError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(profileSchema)
  });

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      setInitialLoading(true);
      setServerError(null);
      try {
        const res = await profileService.getProfile();
        if (isMounted) {
          if (res && res.success && res.data) {
            const p = res.data;
            setProfileData(p);

            setValue('full_name', p.fullName || '');
            setValue('username', p.username || '');
            setValue('email_address', p.emailAddress || '');
            setValue('employee_id', p.employeeId || '');
            setValue('department', p.department || '');
            setValue('designation', p.designation || '');
            setValue('phone', p.phone || '');
            setValue('joined_date', p.joinedDate || '');
          } else {
            setServerError(res?.message || 'Failed to load profile data for editing.');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('[EditProfile] loadProfile error:', err);
          setServerError(err?.message || 'Error connecting to server.');
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [setValue]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setFileError(null);
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

  const onSubmitProfile = async (data) => {
    setIsSubmitting(true);
    setServerError(null);
    setServerSuccess(null);

    try {
      const formData = new FormData();
      const payload = {
        full_name: data.full_name,
        email_address: data.email_address,
        employee_id: data.employee_id,
        department: data.department,
        designation: data.designation,
        phone: data.phone,
        joined_date: data.joined_date
      };
      formData.append('profile_data', JSON.stringify(payload));

      if (selectedFile) {
        formData.append('profile_image', selectedFile);
      }

      const res = await profileService.updateProfile(formData);
      if (res && res.success && res.data) {
        setServerSuccess('Profile updated successfully.');
        if (updateCurrentUserProfile) {
          updateCurrentUserProfile(res.data);
        }
        setTimeout(() => {
          navigate('/sltb/profile');
        }, 800);
      } else {
        setServerError(res?.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('[EditProfile] submit error:', err);
      setServerError(err?.message || 'An error occurred while updating profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="profile-container">
          <div className="profile-breadcrumbs">
            <Link to="/sltb/dashboard">Home</Link> &gt; <Link to="/sltb/profile">Profile</Link> &gt; Edit Profile
          </div>
          <h1 className="profile-page-title">Edit Profile</h1>

          {initialLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', color: '#64748b' }}>
              <Loader2 size={36} className="spinner" style={{ marginBottom: '0.75rem' }} />
              <p>Loading edit form...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitProfile)}>
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

              <div className="edit-profile-top-grid">
                <ProfilePhotoEditor
                  currentPhoto={profileData?.profileImage}
                  imagePreview={imagePreview}
                  updatedAt={profileData?.updatedAt}
                  onPhotoChange={handlePhotoChange}
                  fileError={fileError}
                />

                <ProfileForm
                  register={register}
                  errors={errors}
                  roleName={profileData?.roleName}
                  username={profileData?.username}
                />
              </div>

              <ChangePasswordForm />

              <div className="profile-actions-bar">
                <Link to="/sltb/profile" className="btn-cancel-profile">
                  Cancel
                </Link>
                <button type="submit" className="btn-update-profile" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
                  <span>{isSubmitting ? 'Saving Profile...' : 'Update Profile'}</span>
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditProfilePage;
