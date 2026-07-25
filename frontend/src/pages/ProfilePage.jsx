import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { ProfileSummaryCard } from '../components/profile/ProfileSummaryCard';
import { PersonalInformationCard } from '../components/profile/PersonalInformationCard';
import { profileService } from '../services/profileService';
import { useProfileSocket } from '../hooks/useProfileSocket';
import '../styles/profile.css';

export const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Callback when a real WebSocket profile_updated event arrives
  const handleProfileUpdatedFromSocket = useCallback((updatedProfile) => {
    if (updatedProfile) {
      setProfile((prev) => ({
        ...(prev || {}),
        fullName: updatedProfile.fullName ?? updatedProfile.full_name ?? prev?.fullName,
        profileImage: updatedProfile.profileImage ?? updatedProfile.profile_image ?? prev?.profileImage,
        updatedAt: updatedProfile.updatedAt ?? updatedProfile.updated_at ?? prev?.updatedAt,
        employeeId: updatedProfile.employeeId ?? updatedProfile.employee_id ?? prev?.employeeId,
        department: updatedProfile.department ?? prev?.department,
        designation: updatedProfile.designation ?? prev?.designation,
        phone: updatedProfile.phone ?? prev?.phone,
        joinedDate: updatedProfile.joinedDate ?? updatedProfile.joined_date ?? prev?.joinedDate,
        emailAddress: updatedProfile.emailAddress ?? updatedProfile.email ?? prev?.emailAddress
      }));
    }
  }, []);

  useProfileSocket(handleProfileUpdatedFromSocket);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await profileService.getProfile();
        if (isMounted) {
          if (res && res.success && res.data) {
            setProfile(res.data);
            // CRITICAL: updateCurrentUserProfile MUST NOT be called here after GET /profile
          } else {
            setError(res?.message || 'Failed to load profile details.');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('[ProfilePage] fetchProfile error:', err);
          setError(err?.message || 'Error connecting to server.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []); // Runs ONLY ONCE when page mounts!

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="profile-container">
          <div className="profile-breadcrumbs">
            <Link to="/sltb/dashboard">Home</Link> &gt; Profile
          </div>
          <h1 className="profile-page-title">Profile</h1>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', color: '#64748b' }}>
              <Loader2 size={36} className="spinner" style={{ marginBottom: '0.75rem' }} />
              <p>Loading profile information...</p>
            </div>
          ) : error ? (
            <div className="profile-card" style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>
              <p>{error}</p>
            </div>
          ) : (
            <div className="profile-main-grid">
              <ProfileSummaryCard profile={profile} />
              <PersonalInformationCard profile={profile} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
