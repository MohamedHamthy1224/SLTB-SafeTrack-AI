import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, ArrowLeft, Save, Loader2, Calendar } from 'lucide-react';

import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { addDriverSchema } from '../schemas/driverSchemas';
import { driverService } from '../services/driverService';
import '../styles/driverManagement.css';

export const AddDriverPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Profile Photo Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(addDriverSchema),
    defaultValues: {
      full_name: '',
      nic: '',
      date_of_birth: '',
      gender: '',
      address: '',
      phone: '',
      alternative_phone_number: '',
      email_address: '',
      license_number: '',
      issue_date: '',
      expiry_date: '',
      join_date: '',
      experience_years: 0,
      status: 'Active'
    }
  });

  // Handle Profile Photo File Selection
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type.toLowerCase())) {
      setFileError('Invalid file type. Allowed formats: PNG, JPG, JPEG, WEBP');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFileError('File size exceeds maximum limit of 2 MB.');
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const formData = new FormData();
      formData.append('driver_data', JSON.stringify(data));

      if (selectedFile) {
        formData.append('profile_picture', selectedFile);
      }

      const res = await driverService.createDriver(formData);
      if (res && res.success) {
        navigate('/sltb/drivers');
      } else {
        setServerError(res?.message || 'Failed to register driver.');
      }
    } catch (err) {
      console.error('[AddDriver] submit error:', err);
      setServerError(err?.message || 'An error occurred while saving driver records.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="driver-management-container">
          {/* Breadcrumbs & Title */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
              <Link to="/sltb/drivers" style={{ color: '#0240bf', textDecoration: 'none' }}>Driver Management</Link> &gt; Add New Driver
            </div>
            <h1 className="driver-page-title">Add New Driver</h1>
          </div>

          {serverError && (
            <div style={{ padding: '0.875rem 1.25rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, color: '#b91c1c', marginBottom: '1.5rem' }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="driver-form-container">
            {/* Section 1: Personal Information */}
            <div className="form-section-block">
              <div className="form-section-header">
                <div className="form-step-number">1</div>
                <h3>Personal Information</h3>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Full Name <span className="required-star">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                    placeholder="e.g. Kasun Jayawardena"
                    {...register('full_name')}
                  />
                  {errors.full_name && <span className="form-error-msg">{errors.full_name.message}</span>}
                </div>

                <div className="form-group">
                  <label>NIC Number</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nic ? 'is-invalid' : ''}`}
                    placeholder="e.g. 901234567V"
                    {...register('nic')}
                  />
                  {errors.nic && <span className="form-error-msg">{errors.nic.message}</span>}
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`}
                    {...register('date_of_birth')}
                  />
                  {errors.date_of_birth && <span className="form-error-msg">{errors.date_of_birth.message}</span>}
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select className={`form-control ${errors.gender ? 'is-invalid' : ''}`} {...register('gender')}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && <span className="form-error-msg">{errors.gender.message}</span>}
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Address</label>
                  <textarea
                    rows={3}
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    placeholder="Enter full address"
                    {...register('address')}
                  />
                  {errors.address && <span className="form-error-msg">{errors.address.message}</span>}
                </div>

                {/* Profile Photo Upload Dropzone */}
                <div className="form-group" style={{ gridColumn: 'span 3' }}>
                  <label>Profile Photo</label>
                  <label className="photo-upload-zone">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                    />
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="photo-preview-img" />
                    ) : (
                      <>
                        <Upload size={28} color="#0240bf" style={{ marginBottom: '0.4rem' }} />
                        <span style={{ color: '#0240bf', fontWeight: 600, fontSize: '0.875rem' }}>Click to upload photo</span>
                        <span style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.2rem' }}>PNG, JPG, WEBP up to 2MB</span>
                      </>
                    )}
                  </label>
                  {fileError && <span className="form-error-msg">{fileError}</span>}
                </div>
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div className="form-section-block">
              <div className="form-section-header">
                <div className="form-step-number">2</div>
                <h3>Contact Information</h3>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="e.g. 071 234 5678"
                    {...register('phone')}
                  />
                  {errors.phone && <span className="form-error-msg">{errors.phone.message}</span>}
                </div>

                <div className="form-group">
                  <label>Alternative Phone Number</label>
                  <input
                    type="text"
                    className={`form-control ${errors.alternative_phone_number ? 'is-invalid' : ''}`}
                    placeholder="e.g. 077 123 4567"
                    {...register('alternative_phone_number')}
                  />
                  {errors.alternative_phone_number && <span className="form-error-msg">{errors.alternative_phone_number.message}</span>}
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email_address ? 'is-invalid' : ''}`}
                    placeholder="e.g. driver@example.com"
                    {...register('email_address')}
                  />
                  {errors.email_address && <span className="form-error-msg">{errors.email_address.message}</span>}
                </div>
              </div>
            </div>

            {/* Section 3: License Information */}
            <div className="form-section-block">
              <div className="form-section-header">
                <div className="form-step-number">3</div>
                <h3>License Information</h3>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Driving License Number <span className="required-star">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.license_number ? 'is-invalid' : ''}`}
                    placeholder="e.g. B1234567"
                    {...register('license_number')}
                  />
                  {errors.license_number && <span className="form-error-msg">{errors.license_number.message}</span>}
                </div>

                <div className="form-group">
                  <label>Issue Date</label>
                  <input
                    type="date"
                    className={`form-control ${errors.issue_date ? 'is-invalid' : ''}`}
                    {...register('issue_date')}
                  />
                  {errors.issue_date && <span className="form-error-msg">{errors.issue_date.message}</span>}
                </div>

                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="date"
                    className={`form-control ${errors.expiry_date ? 'is-invalid' : ''}`}
                    {...register('expiry_date')}
                  />
                  {errors.expiry_date && <span className="form-error-msg">{errors.expiry_date.message}</span>}
                </div>
              </div>
            </div>

            {/* Section 4: Employment Information */}
            <div className="form-section-block">
              <div className="form-section-header">
                <div className="form-step-number">4</div>
                <h3>Employment Information</h3>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Join Date</label>
                  <input
                    type="date"
                    className={`form-control ${errors.join_date ? 'is-invalid' : ''}`}
                    {...register('join_date')}
                  />
                  {errors.join_date && <span className="form-error-msg">{errors.join_date.message}</span>}
                </div>

                <div className="form-group">
                  <label>Experience Years</label>
                  <input
                    type="number"
                    min={0}
                    className={`form-control ${errors.experience_years ? 'is-invalid' : ''}`}
                    placeholder="e.g. 5"
                    {...register('experience_years')}
                  />
                  {errors.experience_years && <span className="form-error-msg">{errors.experience_years.message}</span>}
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select className={`form-control ${errors.status ? 'is-invalid' : ''}`} {...register('status')}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {errors.status && <span className="form-error-msg">{errors.status.message}</span>}
                </div>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button
                type="button"
                className="driver-btn-reset"
                onClick={() => navigate('/sltb/drivers')}
                disabled={isSubmitting}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <ArrowLeft size={16} />
                <span>Cancel</span>
              </button>

              <button
                type="submit"
                className="add-driver-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="spinner" />
                    <span>Saving Driver...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Driver</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
