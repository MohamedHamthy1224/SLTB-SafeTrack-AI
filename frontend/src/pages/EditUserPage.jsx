import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import PoliceAdminEditForm from '../components/police/users/PoliceAdminEditForm';
import SLTBAdminEditForm from '../components/police/users/SLTBAdminEditForm';
import TrafficPoliceEditForm from '../components/police/users/TrafficPoliceEditForm';
import { mockUsersList } from '../data/userManagementMockData';
import '../styles/police-dashboard.css';
import '../styles/editUser.css';

export const EditUserPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();

  // Find user by ID or default to first user
  const user =
    mockUsersList.find((u) => String(u.id) === String(userId)) ||
    mockUsersList[0];

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
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        imagePreview: user.avatar ? { url: user.avatar, name: 'current_profile.png' } : null,
        themePreference: user.themePreference || 'Light',
        status: user.status || 'Active',
        fullName: user.fullName || '',
        badgeNumber: user.badgeNumber || 'TP-4501',
        rank: user.rank || 'Inspector',
        policeStation: user.policeStation || user.department || '',
        phone: user.phone || '',
        joinedDate: user.joinedDate || '',
        deviceToken: user.deviceToken || '••••••••A9F4',
        isOnline: user.isOnline || 'Online',
        designation: user.designation || 'Administrator',
        employeeId: user.employeeId || 'SLTB-EMP-021',
        department: user.department || 'Operations Department',
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    if (user.role === 'SLTB Admin') {
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

  const handleSave = () => {
    if (validate()) {
      // Frontend-only: navigate back to user view details page
      navigate(`/police/users/view/${user.id}`);
    }
  };

  const handleCancel = () => {
    navigate(`/police/users/view/${user.id}`);
  };

  const renderEditFormByRole = () => {
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
            <h1 className="edit-user-page-title">Edit User - {user.fullName}</h1>
            <nav className="edit-user-breadcrumb">
              <Link to="/police/user-management">User Management</Link>
              <span className="bc-sep">&gt;</span>
              <Link to={`/police/users/view/${user.id}`}>User Details</Link>
              <span className="bc-sep">&gt;</span>
              <span className="bc-current">Edit User</span>
            </nav>
          </div>

          {/* Dynamic Role Edit Form */}
          {renderEditFormByRole()}

          {/* Footer Action Buttons */}
          <div className="edit-user-footer-actions">
            <button
              type="button"
              className="btn-edit-cancel"
              onClick={handleCancel}
            >
              <ArrowLeft size={14} />
              Cancel
            </button>
            <button
              type="button"
              className="btn-edit-save"
              onClick={handleSave}
            >
              <Save size={15} />
              Save Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditUserPage;
