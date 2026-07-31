import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import UserWizard from '../components/police/users/UserWizard';
import userService from '../services/userService';
import '../styles/police-dashboard.css';
import '../styles/addUser.css';

export const AddUserPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const [formData, setFormData] = useState({
    role: '',
    username: '',
    email: '',
    password: '',
    imagePreview: null,
    themePreference: 'Light',
    status: 'Active',
    // Step 2 shared & role fields
    fullName: '',
    badgeNumber: '',
    rank: '',
    policeStation: '',
    phone: '',
    joinedDate: '',
    deviceToken: '',
    isOnline: '',
    lastActive: '',
    designation: '',
    employeeId: '',
    department: '',
  });

  const [errors, setErrors] = useState({});

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

  const validateStepOne = () => {
    const newErrors = {};
    if (!formData.role) {
      newErrors.role = 'Select the user role';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Enter unique username';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Enter a strong password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Enter full name';
    }
    if (formData.role === 'SLTB Admin') {
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

  const handleNext = () => {
    if (validateStepOne()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (!validateStepTwo()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      const res = await userService.createUser(formData);
      if (res.success) {
        navigate('/police/user-management');
      } else {
        if (res.errors) {
          setErrors(res.errors);
        }
        setApiError(res.message || 'Failed to create user.');
      }
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
        if (err.errors.username || err.errors.email || err.errors.password || err.errors.role) {
          setStep(1);
        }
      }
      setApiError(err.message || 'An error occurred while creating the user.');
    } finally {
      setIsSubmitting(false);
    }
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

        <main className="add-user-container">
          {/* Header Title & Breadcrumb */}
          <div className="add-user-header-section">
            <h1 className="add-user-page-title">Add New User</h1>
            <nav className="add-user-breadcrumb">
              <Link to="/police/user-management">User Management</Link>
              <span className="bc-sep">&gt;</span>
              <span className="bc-current">Add New User</span>
            </nav>
          </div>

          {apiError && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem', color: '#ef4444', background: '#fef2f2', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #fee2e2' }}>
              {apiError}
            </div>
          )}

          {/* Wizard Step Component */}
          <UserWizard
            step={step}
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
            onNext={handleNext}
            onBack={handleBack}
            onSave={handleSave}
            isSubmitting={isSubmitting}
          />
        </main>
      </div>
    </div>
  );
};

export default AddUserPage;
