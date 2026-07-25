import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Upload, Loader2, Info, Camera } from 'lucide-react';

import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { editDriverSchema } from '../schemas/driverSchemas';
import { driverService } from '../services/driverService';
import defaultAvatar from '../assets/images/default_driver_avatar.png';
import '../styles/driverManagement.css';

export const EditDriverPage = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Driver & Options State
  const [initialLoading, setInitialLoading] = useState(true);
  const [driver, setDriver] = useState(null);
  const [busOptions, setBusOptions] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  // Profile Photo Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(editDriverSchema)
  });

  // Fetch Driver Details and Bus/Route Assignment Options
  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true);
      setServerError(null);

      try {
        const [driverRes, optionsRes] = await Promise.all([
          driverService.getDriverById(driverId),
          driverService.getAssignmentOptions(driverId)
        ]);

        if (driverRes && driverRes.success) {
          const dData = driverRes.data;
          setDriver(dData);

          // Populate form fields
          setValue('full_name', dData.full_name || dData.fullName || '');
          setValue('nic', dData.nic || '');
          setValue('date_of_birth', dData.date_of_birth || dData.dateOfBirth || '');
          setValue('gender', dData.gender || '');
          setValue('address', dData.address || '');
          setValue('phone', dData.phone || '');
          setValue('alternative_phone_number', dData.alternative_phone_number || dData.alternativePhoneNumber || '');
          setValue('email_address', dData.email_address || dData.emailAddress || '');
          setValue('license_number', dData.license_number || dData.licenseNumber || '');
          setValue('issue_date', dData.issue_date || dData.issueDate || '');
          setValue('expiry_date', dData.expiry_date || dData.expiryDate || '');
          setValue('join_date', dData.join_date || dData.joinDate || '');
          setValue('experience_years', dData.experience_years ?? dData.experienceYears ?? 0);
          setValue('status', dData.status || 'Active');

          if (dData.profile_picture || dData.profilePicture) {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
            const pic = dData.profile_picture || dData.profilePicture;
            setImagePreview(pic.startsWith('http') ? pic : `${baseUrl}/api/v1/sltb/${pic}`);
          }
        } else {
          setServerError(driverRes?.message || 'Driver not found.');
        }

        if (optionsRes && optionsRes.success) {
          setBusOptions(optionsRes.data.buses || []);
          setRouteOptions(optionsRes.data.routes || []);
          const currAssign = optionsRes.data.currentAssignment;
          setCurrentAssignment(currAssign);

          if (currAssign) {
            setValue('bus_id', String(currAssign.bus_id || currAssign.busId || ''));
            setValue('route_id', String(currAssign.route_id || currAssign.routeId || ''));
          } else {
            setValue('bus_id', '');
            setValue('route_id', '');
          }
        }
      } catch (err) {
        console.error('[EditDriver] loadData error:', err);
        setServerError(err?.message || 'Failed to load driver data for editing.');
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [driverId, setValue]);

  // Photo Selection
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setFileError(null);
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type.toLowerCase())) {
      setFileError('Invalid file format. Allowed formats: PNG, JPG, JPEG, WEBP');
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

      // Extract driver fields
      const driverFields = {
        full_name: data.full_name,
        nic: data.nic,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        address: data.address,
        phone: data.phone,
        alternative_phone_number: data.alternative_phone_number,
        email_address: data.email_address,
        license_number: data.license_number,
        issue_date: data.issue_date,
        expiry_date: data.expiry_date,
        join_date: data.join_date,
        experience_years: data.experience_years,
        status: data.status
      };
      formData.append('driver_data', JSON.stringify(driverFields));

      // Extract assignment fields if present
      if (data.bus_id && data.route_id) {
        const assignFields = {
          bus_id: Number(data.bus_id),
          route_id: Number(data.route_id)
        };
        formData.append('assignment_data', JSON.stringify(assignFields));
      }

      if (selectedFile) {
        formData.append('profile_picture', selectedFile);
      }

      const res = await driverService.updateDriver(driverId, formData);
      if (res && res.success) {
        navigate(`/sltb/drivers/${driverId}`);
      } else {
        setServerError(res?.message || 'Failed to update driver details.');
      }
    } catch (err) {
      console.error('[EditDriver] submit error:', err);
      setServerError(err?.message || 'An error occurred while updating driver.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="driver-management-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <div style={{ textAlign: 'center', color: '#64748b' }}>
              <Loader2 size={36} className="spinner" style={{ margin: '0 auto 0.5rem auto' }} />
              <p>Loading edit form...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const dId = driver?.driver_id || driver?.driverId || driverId;

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="driver-management-container">
          {/* Breadcrumbs & Title */}
          <div className="driver-header-flex">
            <div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                <Link to="/sltb/drivers" style={{ color: '#0240bf', textDecoration: 'none' }}>Driver Management</Link> &gt; Edit Driver
              </div>
              <h1 className="driver-page-title">Edit Driver</h1>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="driver-btn-reset"
                onClick={() => navigate(`/sltb/drivers/${dId}`)}
              >
                <ArrowLeft size={16} />
                <span>Back to Driver Details</span>
              </button>

              <button
                type="button"
                className="add-driver-btn"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="spinner" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Update Driver</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {serverError && (
            <div style={{ padding: '0.875rem 1.25rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, color: '#b91c1c', marginBottom: '1.5rem' }}>
              {serverError}
            </div>
          )}

          {/* Edit Layout Grid */}
          <div className="driver-details-grid">
            {/* Left Sidebar Card */}
            <div className="profile-card-sidebar">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={imagePreview || defaultAvatar}
                  alt={driver?.full_name || driver?.fullName}
                  className="profile-card-avatar"
                  onError={(e) => { e.target.src = defaultAvatar; }}
                />
                <label style={{ position: 'absolute', bottom: 10, right: 10, background: '#0240bf', color: '#fff', borderRadius: '50%', padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {fileError && <div className="form-error-msg" style={{ marginTop: '0.5rem' }}>{fileError}</div>}

              <div className="profile-card-name" style={{ marginTop: '0.5rem' }}>{driver?.full_name || driver?.fullName}</div>
              <div className="profile-card-role">Professional Driver</div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '1rem', textAlign: 'left', fontSize: '0.8125rem' }}>
                <div style={{ marginBottom: '0.5rem' }}><span style={{ color: '#64748b' }}>Driver ID:</span> <strong>{`DRV${dId}`}</strong></div>
                <div style={{ marginBottom: '0.5rem' }}><span style={{ color: '#64748b' }}>License:</span> <strong>{driver?.license_number || driver?.licenseNumber || 'Not Available'}</strong></div>
                <div style={{ marginBottom: '0.5rem' }}><span style={{ color: '#64748b' }}>NIC:</span> <strong>{driver?.nic || 'Not Available'}</strong></div>
                <div style={{ marginBottom: '0.5rem' }}><span style={{ color: '#64748b' }}>Phone:</span> <strong>{driver?.phone || 'Not Available'}</strong></div>
                <div style={{ marginBottom: '0.5rem' }}><span style={{ color: '#64748b' }}>Status:</span> <span className={`badge-status ${(driver?.status || 'Active').toLowerCase()}`}>{driver?.status || 'Active'}</span></div>
              </div>
            </div>

            {/* Right Editable Form */}
            <form className="details-content-cards" onSubmit={handleSubmit(onSubmit)}>
              {/* Personal Information */}
              <div className="details-info-card">
                <h4>Personal Information</h4>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Full Name <span className="required-star">*</span></label>
                    <input
                      type="text"
                      className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                      {...register('full_name')}
                    />
                    {errors.full_name && <span className="form-error-msg">{errors.full_name.message}</span>}
                  </div>

                  <div className="form-group">
                    <label>NIC Number</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nic ? 'is-invalid' : ''}`}
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

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      {...register('phone')}
                    />
                    {errors.phone && <span className="form-error-msg">{errors.phone.message}</span>}
                  </div>

                  <div className="form-group">
                    <label>Alternative Phone Number</label>
                    <input
                      type="text"
                      className={`form-control ${errors.alternative_phone_number ? 'is-invalid' : ''}`}
                      {...register('alternative_phone_number')}
                    />
                    {errors.alternative_phone_number && <span className="form-error-msg">{errors.alternative_phone_number.message}</span>}
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 3' }}>
                    <label>Email Address</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email_address ? 'is-invalid' : ''}`}
                      {...register('email_address')}
                    />
                    {errors.email_address && <span className="form-error-msg">{errors.email_address.message}</span>}
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 3' }}>
                    <label>Address</label>
                    <textarea
                      rows={2}
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      {...register('address')}
                    />
                    {errors.address && <span className="form-error-msg">{errors.address.message}</span>}
                  </div>
                </div>
              </div>

              {/* License Information */}
              <div className="details-info-card">
                <h4>License Information</h4>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>License Number <span className="required-star">*</span></label>
                    <input
                      type="text"
                      className={`form-control ${errors.license_number ? 'is-invalid' : ''}`}
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

              {/* Professional Information */}
              <div className="details-info-card">
                <h4>Professional Information</h4>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Experience Years</label>
                    <input
                      type="number"
                      min={0}
                      className={`form-control ${errors.experience_years ? 'is-invalid' : ''}`}
                      {...register('experience_years')}
                    />
                    {errors.experience_years && <span className="form-error-msg">{errors.experience_years.message}</span>}
                  </div>

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
                    <label>Status</label>
                    <select className={`form-control ${errors.status ? 'is-invalid' : ''}`} {...register('status')}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    {errors.status && <span className="form-error-msg">{errors.status.message}</span>}
                  </div>
                </div>
              </div>

              {/* Assigned Information */}
              <div className="details-info-card">
                <h4>Assigned Information</h4>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Assigned Bus</label>
                    <select className={`form-control ${errors.bus_id ? 'is-invalid' : ''}`} {...register('bus_id')}>
                      <option value="">Select Bus (Not Assigned)</option>
                      {busOptions.map((b) => (
                        <option key={b.busId || b.bus_id} value={b.busId || b.bus_id}>
                          {`${b.busId || b.bus_id} - ${b.busNumber || b.bus_number} - ${b.registrationNumber || b.registration_number}`}
                        </option>
                      ))}
                    </select>
                    {errors.bus_id && <span className="form-error-msg">{errors.bus_id.message}</span>}
                  </div>

                  <div className="form-group">
                    <label>Assigned Route</label>
                    <select className={`form-control ${errors.route_id ? 'is-invalid' : ''}`} {...register('route_id')}>
                      <option value="">Select Route (Not Assigned)</option>
                      {routeOptions.map((r) => (
                        <option key={r.routeId || r.route_id} value={r.routeId || r.route_id}>
                          {`${r.routeId || r.route_id} - ${r.routeNumber || r.route_number} - ${r.routeName || r.route_name}`}
                        </option>
                      ))}
                    </select>
                    {errors.route_id && <span className="form-error-msg">{errors.route_id.message}</span>}
                  </div>
                </div>
              </div>

              {/* Blue Note Banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, color: '#1e40af', fontSize: '0.875rem' }}>
                <Info size={20} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Note:</strong> Please ensure all information is accurate before updating. Changes will be reflected in the system immediately.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="driver-btn-reset"
                  onClick={() => navigate(`/sltb/drivers/${dId}`)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="add-driver-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="spinner" />
                      <span>Updating Driver...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Update Driver</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
