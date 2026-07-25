import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { routeFormSchema } from '../../schemas/routeSchemas';
import { ArrowLeft, Save } from 'lucide-react';

export const RouteForm = ({
  initialValues = {},
  isEditMode = false,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverErrors = {}
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      route_number: initialValues.route_number || initialValues.routeNumber || '',
      route_name: initialValues.route_name || initialValues.routeName || '',
      start_location: initialValues.start_location || initialValues.startLocation || '',
      end_location: initialValues.end_location || initialValues.endLocation || '',
      distance_km: initialValues.distance_km ?? initialValues.distanceKm ?? '',
      estimated_duration: initialValues.estimated_duration ?? initialValues.estimatedDuration ?? '',
      status: initialValues.status || 'Active'
    }
  });

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      distance_km: Number(data.distance_km),
      estimated_duration: Number(data.estimated_duration)
    });
  };

  return (
    <form className="route-form" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="form-section-card">
        <h3 className="form-section-title">
          <span className="section-number">1</span> Route Basic Information
        </h3>

        <div className="form-grid">
          {/* Read-Only Route ID (Edit Mode Only) */}
          {isEditMode && (
            <div className="form-group">
              <label className="form-label">Route ID</label>
              <input
                type="text"
                className="form-control readonly"
                value={initialValues.route_id || initialValues.routeId || ''}
                readOnly
                disabled
              />
              <span className="form-help">System auto-generated route ID</span>
            </div>
          )}

          {/* Route Number */}
          <div className="form-group">
            <label className="form-label required">Route Number</label>
            <input
              type="text"
              className={`form-control ${errors.route_number || serverErrors.route_number ? 'is-invalid' : ''}`}
              placeholder="Enter route number (e.g., 101)"
              {...register('route_number')}
            />
            <span className="form-help">Unique route number code</span>
            {(errors.route_number || serverErrors.route_number) && (
              <span className="error-message">
                {errors.route_number?.message || serverErrors.route_number}
              </span>
            )}
          </div>

          {/* Route Name */}
          <div className="form-group">
            <label className="form-label required">Route Name</label>
            <input
              type="text"
              className={`form-control ${errors.route_name || serverErrors.route_name ? 'is-invalid' : ''}`}
              placeholder="Enter route name (e.g., Colombo to Kandy)"
              {...register('route_name')}
            />
            <span className="form-help">Full descriptive route title</span>
            {(errors.route_name || serverErrors.route_name) && (
              <span className="error-message">
                {errors.route_name?.message || serverErrors.route_name}
              </span>
            )}
          </div>

          {/* Start Location */}
          <div className="form-group">
            <label className="form-label required">Start Location</label>
            <input
              type="text"
              className={`form-control ${errors.start_location || serverErrors.start_location ? 'is-invalid' : ''}`}
              placeholder="Enter start location"
              {...register('start_location')}
            />
            {(errors.start_location || serverErrors.start_location) && (
              <span className="error-message">
                {errors.start_location?.message || serverErrors.start_location}
              </span>
            )}
          </div>

          {/* End Location */}
          <div className="form-group">
            <label className="form-label required">End Location</label>
            <input
              type="text"
              className={`form-control ${errors.end_location || serverErrors.end_location ? 'is-invalid' : ''}`}
              placeholder="Enter end location"
              {...register('end_location')}
            />
            {(errors.end_location || serverErrors.end_location) && (
              <span className="error-message">
                {errors.end_location?.message || serverErrors.end_location}
              </span>
            )}
          </div>

          {/* Distance (km) */}
          <div className="form-group">
            <label className="form-label required">Distance (km)</label>
            <input
              type="number"
              step="0.01"
              className={`form-control ${errors.distance_km || serverErrors.distance_km ? 'is-invalid' : ''}`}
              placeholder="Enter distance in kilometres"
              {...register('distance_km')}
            />
            <span className="form-help">Total route distance in kilometres</span>
            {(errors.distance_km || serverErrors.distance_km) && (
              <span className="error-message">
                {errors.distance_km?.message || serverErrors.distance_km}
              </span>
            )}
          </div>

          {/* Estimated Duration (minutes) */}
          <div className="form-group">
            <label className="form-label required">Estimated Duration (minutes)</label>
            <input
              type="number"
              className={`form-control ${errors.estimated_duration || serverErrors.estimated_duration ? 'is-invalid' : ''}`}
              placeholder="Enter estimated duration in minutes"
              {...register('estimated_duration')}
            />
            <span className="form-help">Estimated journey time in minutes</span>
            {(errors.estimated_duration || serverErrors.estimated_duration) && (
              <span className="error-message">
                {errors.estimated_duration?.message || serverErrors.estimated_duration}
              </span>
            )}
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label required">Route Status</label>
            <select
              className={`form-control select-control ${errors.status || serverErrors.status ? 'is-invalid' : ''}`}
              {...register('status')}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <span className="form-help">Select current route operational status</span>
            {(errors.status || serverErrors.status) && (
              <span className="error-message">
                {errors.status?.message || serverErrors.status}
              </span>
            )}
          </div>

          {/* Read-Only Created At (Edit Mode Only) */}
          {isEditMode && (
            <div className="form-group">
              <label className="form-label">Created At</label>
              <input
                type="text"
                className="form-control readonly"
                value={initialValues.created_at || initialValues.createdAt || 'N/A'}
                readOnly
                disabled
              />
            </div>
          )}
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="form-actions-footer">
        <button
          type="button"
          className="btn btn-secondary btn-cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <ArrowLeft size={16} />
          <span>Cancel</span>
        </button>

        <button
          type="submit"
          className="btn btn-primary btn-save"
          disabled={isSubmitting}
        >
          <Save size={16} />
          <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Route' : 'Save Route'}</span>
        </button>
      </div>
    </form>
  );
};

export default RouteForm;
