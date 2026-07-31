import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import PoliceAdminEditForm from '../components/police/users/PoliceAdminEditForm';
import SLTBAdminEditForm from '../components/police/users/SLTBAdminEditForm';
import TrafficPoliceEditForm from '../components/police/users/TrafficPoliceEditForm';
import userService from '../services/userService';
import '../styles/police-dashboard.css';
import '../styles/editUser.css';

export const EditUserPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    imagePreview: null,
    themePreference: 'Light',
    status: 'Active',
    fullName: '',
    badgeNumber: '',
    rank: '',
    policeStation: '',
    phone: '',
    joinedDate: '',
    deviceToken: '',
    isOnline: 'Online',
    designation: '',
    employeeId: '',
    department: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setApiError('');
      try {
        const res = await userService.getUserById(userId);
        if (res.success && res.data) {
          const u = res.data;
          setUser(u);
          setFormData({
            username: u.username || '',
            email: u.email || '',
            password: '',
            imagePreview: u.avatar ? { url: u.avatar, name: 'current_profile.png' } : null,
            themePreference: u.themePreference || 'Light',
            status: u.status || 'Active',
            fullName: u.fullName || u.full_name || '',
            badgeNumber: u.badgeNumber || 'TP-4501',
            rank: u.rank || 'Inspector',
            policeStation: u.policeStation || u.police_station || u.department || '',
            phone: u.phone || '',
            joinedDate: u.joinedDate || u.joined_date || '',
            deviceToken: u.deviceToken || u.device_token || '••••••••A9F4',
            isOnline: u.isOnline || (u.is_online ? 'Online' : 'Offline'),
            designation: u.designation || 'Administrator',
            employeeId: u.employeeId || u.employee_id || 'SLTB-EMP-021',
            department: u.department || 'Operations Department',
          });
        } else {
          setApiError(res.message || 'User not found.');
        }
      } catch (err) {
        setApiError(err.message || 'Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setApiError('');
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleImageChange = (url, name) => {
    setFormData((prev) => ({
      ...prev,
      imagePreview: { url, name },
    }));
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({
      ...prev,
      imagePreview: null,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Enter unique username';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter valid email address';
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Enter full name';
    }
    if (user && user.role === 'SLTB Admin') {
      if (!formData.employeeId?.trim()) {
        newErrors.employeeId = 'Enter employee ID';
      }
    } else {
      if (!formData.badgeNumber?.trim()) {
        newErrors.badgeNumber = 'Enter badge number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      const res = await userService.updateUser(userId, formData);
      if (res.success) {
        navigate(`/police/users/view/${userId}`);
      } else {
        if (res.errors) setErrors(res.errors);
        setApiError(res.message || 'Failed to update user.');
      }
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      setApiError(err.message || 'An error occurred while updating user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/police/users/view/${userId}`);
  };

  const renderEditFormByRole = () => {
    if (!user) return null;
    if (user.role === 'SLTB Admin') {
      return (
        <SLTBAdminEditForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />
      );
    }
    if (user.role === 'Traffic Police Officer') {
      return (
        <TrafficPoliceEditForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
        />
      );
    }
    return (
      <PoliceAdminEditForm
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onImageChange={handleImageChange}
        onImageRemove={handleImageRemove}
      />
    );
  };

  return (
    <div className="police-dashboard-layout">
      {/* Sidebar */}
      <PoliceSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="police-dashboard-main">
        <PoliceDashboardHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="edit-user-container">
          {/* Header Title & Breadcrumbs */}
          <div className="edit-user-header-section">
            <h1 className="edit-user-page-title">
              Edit User {user ? `- ${user.fullName || user.username}` : ''}
            </h1>
            <nav className="edit-user-breadcrumb">
              <Link to="/police/user-management">User Management</Link>
              <span className="bc-sep">&gt;</span>
              <Link to={`/police/users/view/${userId}`}>User Details</Link>
              <span className="bc-sep">&gt;</span>
              <span className="bc-current">Edit User</span>
            </nav>
          </div>

          {apiError && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem', color: '#ef4444', background: '#fef2f2', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #fee2e2' }}>
              {apiError}
            </div>
          )}

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading user record from database...
            </div>
          ) : (
            <>
              {/* Dynamic Role Edit Form */}
              {renderEditFormByRole()}

              {/* Footer Action Buttons */}
              <div className="edit-user-footer-actions">
                <button
                  type="button"
                  className="btn-edit-cancel"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={14} />
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-edit-save"
                  onClick={handleSave}
                  disabled={isSubmitting}
                >
                  <Save size={15} />
                  {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditUserPage;
