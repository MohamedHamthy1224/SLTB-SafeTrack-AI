import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { busFormSchema } from '../../schemas/busSchemas';
import RouteAssignmentSelect from './RouteAssignmentSelect';
import DriverAssignmentSelect from './DriverAssignmentSelect';
import { Bus, Save, X, Info } from 'lucide-react';

export const BusForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditing = false,
  isSubmitting = false,
  apiErrors = {}
}) => {
  const defaultValues = {
    bus_number: initialValues?.bus_number || '',
    registration_number: initialValues?.registration_number || '',
    service_type: initialValues?.service_type || 'Public Service',
    model: initialValues?.model || 'Ashok Leyland',
    chassis_number: initialValues?.chassis_number || '',
    engine_number: initialValues?.engine_number || '',
    manufacture_year: initialValues?.manufacture_year || new Date().getFullYear(),
    capacity: initialValues?.capacity ?? 52,
    standing_capacity: initialValues?.standing_capacity ?? 20,
    fuel_type: initialValues?.fuel_type || 'Diesel',
    status: initialValues?.status || 'Active',
    route_id: initialValues?.assignment?.routeId || initialValues?.route_id || '',
    driver_id: initialValues?.assignment?.driverId || initialValues?.driver_id || ''
  };

  const {
    register,
    handleSubmit,
    watch,
    control,     
    setValue,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(busFormSchema),
    defaultValues
  });

  const seating = Number(watch('capacity')) || 0;
  const standing = Number(watch('standing_capacity')) || 0;
  const totalCapacity = seating + standing;

  // Auto derived depot state
  const [derivedDepot, setDerivedDepot] = React.useState(initialValues?.depot || 'SLTB Main Depot');

  useEffect(() => {
    if (initialValues) {
      Object.keys(defaultValues).forEach(key => {
        setValue(key, defaultValues[key]);
      });
      if (initialValues.depot) {
        setDerivedDepot(initialValues.depot);
      }
    }
  }, [initialValues]);

  // Set API errors on form fields if present
  useEffect(() => {
    if (apiErrors && Object.keys(apiErrors).length > 0) {
      Object.keys(apiErrors).forEach((field) => {
        setError(field, { type: 'manual', message: apiErrors[field] });
      });
    }
  }, [apiErrors, setError]);

  const handleRouteSelect = (route) => {
    if (route && route.startLocation) {
      setDerivedDepot(`SLTB Main Depot - ${route.startLocation}`);
    } else {
      setDerivedDepot('SLTB Main Depot');
    }
  };

  const serviceTypes = [
    "Public Service", "Semi Luxury", "Luxury", "Express",
    "Intercity", "Highway", "School Service", "Staff Service", "Tourist"
  ];

  const fuelTypes = ["Diesel", "Petrol", "Electric", "Hybrid", "CNG"];

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bus-form-container">
      {/* SECTION 1: BUS INFORMATION */}
      <div className="form-section-card">
        <div className="section-header">
          <div className="section-badge font-bold">1</div>
          <Bus size={20} className="section-icon" />
          <h3>Bus Information</h3>
        </div>

        <div className="form-grid-3col">
          {/* Bus Number */}
          <div className="form-group">
            <label className="form-label required">Bus Number</label>
            <input
              type="text"
              className={`form-input ${errors.bus_number ? 'is-invalid' : ''}`}
              placeholder="e.g. SLTB-025"
              {...register('bus_number')}
            />
            {errors.bus_number && <span className="error-message">{errors.bus_number.message}</span>}
          </div>

          {/* Registration Number */}
          <div className="form-group">
            <label className="form-label required">Registration Number</label>
            <input
              type="text"
              className={`form-input ${errors.registration_number ? 'is-invalid' : ''}`}
              placeholder="e.g. WP ND - 2568"
              {...register('registration_number')}
            />
            {errors.registration_number && <span className="error-message">{errors.registration_number.message}</span>}
          </div>

          {/* Service Type / Vehicle Type */}
          <div className="form-group">
            <label className="form-label required">Service Type</label>
            <select
              className={`form-select ${errors.service_type ? 'is-invalid' : ''}`}
              {...register('service_type')}
            >
              <option value="">Select Bus Type</option>
              {serviceTypes.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            {errors.service_type && <span className="error-message">{errors.service_type.message}</span>}
          </div>

          {/* Bus Model */}
          <div className="form-group">
            <label className="form-label required">Bus Model</label>
            <input
              type="text"
              className={`form-input ${errors.model ? 'is-invalid' : ''}`}
              placeholder="e.g. Ashok Leyland Viking"
              {...register('model')}
            />
            {errors.model && <span className="error-message">{errors.model.message}</span>}
          </div>

          {/* Chassis Number */}
          <div className="form-group">
            <label className="form-label required">Chassis Number</label>
            <input
              type="text"
              className={`form-input ${errors.chassis_number ? 'is-invalid' : ''}`}
              placeholder="e.g. CHS123456789"
              {...register('chassis_number')}
            />
            {errors.chassis_number && <span className="error-message">{errors.chassis_number.message}</span>}
          </div>

          {/* Engine Number */}
          <div className="form-group">
            <label className="form-label required">Engine Number</label>
            <input
              type="text"
              className={`form-input ${errors.engine_number ? 'is-invalid' : ''}`}
              placeholder="e.g. ENG123456789"
              {...register('engine_number')}
            />
            {errors.engine_number && <span className="error-message">{errors.engine_number.message}</span>}
          </div>

          {/* Manufacture Year */}
          <div className="form-group">
            <label className="form-label required">Manufacture Year</label>
            <select
              className={`form-select ${errors.manufacture_year ? 'is-invalid' : ''}`}
              {...register('manufacture_year')}
            >
              <option value="">Select Year</option>
              {years.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
            {errors.manufacture_year && <span className="error-message">{errors.manufacture_year.message}</span>}
          </div>

          {/* Seating Capacity */}
          <div className="form-group">
            <label className="form-label required">Seating Capacity</label>
            <input
              type="number"
              min="1"
              className={`form-input ${errors.capacity ? 'is-invalid' : ''}`}
              placeholder="e.g. 52"
              {...register('capacity')}
            />
            {errors.capacity && <span className="error-message">{errors.capacity.message}</span>}
          </div>

          {/* Standing Capacity */}
          <div className="form-group">
            <label className="form-label required">Standing Capacity</label>
            <input
              type="number"
              min="0"
              className={`form-input ${errors.standing_capacity ? 'is-invalid' : ''}`}
              placeholder="e.g. 20"
              {...register('standing_capacity')}
            />
            {errors.standing_capacity && <span className="error-message">{errors.standing_capacity.message}</span>}
          </div>

          {/* Total Capacity (Auto Read-only) */}
          <div className="form-group">
            <label className="form-label">Total Capacity (Auto)</label>
            <input
              type="number"
              className="form-input read-only-input"
              value={totalCapacity}
              readOnly
              disabled
            />
          </div>

          {/* Fuel Type */}
          <div className="form-group">
            <label className="form-label required">Fuel Type</label>
            <select
              className={`form-select ${errors.fuel_type ? 'is-invalid' : ''}`}
              {...register('fuel_type')}
            >
              <option value="">Select Fuel Type</option>
              {fuelTypes.map(ft => (
                <option key={ft} value={ft}>{ft}</option>
              ))}
            </select>
            {errors.fuel_type && <span className="error-message">{errors.fuel_type.message}</span>}
          </div>

          {/* Current Status */}
          <div className="form-group">
            <label className="form-label required">Current Status</label>
            <select
              className={`form-select ${errors.status ? 'is-invalid' : ''}`}
              {...register('status')}
            >
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && <span className="error-message">{errors.status.message}</span>}
          </div>
        </div>
      </div>

      {/* SECTION 2: ASSIGN ROUTE */}
      <div className="form-section-card">
        <div className="section-header">
          <div className="section-badge font-bold">2</div>
          <h3>Assign Route</h3>
        </div>
        <p className="section-subtext">Select the route this bus will operate on.</p>

        <div className="form-grid-2col" style={{ marginTop: '1rem' }}>
          <Controller
            name="route_id"
            control={control}
            render={({ field }) => (
              <RouteAssignmentSelect
                value={field.value}
                onChange={field.onChange}
                error={errors.route_id?.message}
                onRouteSelect={handleRouteSelect}
              />
            )}
          />

          <div className="form-group">
            <label className="form-label">Auto Generated Depot</label>
            <input
              type="text"
              className="form-input read-only-input"
              value={derivedDepot}
              readOnly
              disabled
            />
            <span className="helper-text">Depot is automatically derived from the route's start location.</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: ASSIGN DRIVER */}
      <div className="form-section-card">
        <div className="section-header">
          <div className="section-badge font-bold">3</div>
          <h3>Assign Driver</h3>
        </div>
        <p className="section-subtext">Select the driver who will be assigned to this bus.</p>

        <div className="form-grid-1col" style={{ marginTop: '1rem' }}>
          <Controller
            name="driver_id"
            control={control}
            render={({ field }) => (
              <DriverAssignmentSelect
                value={field.value}
                onChange={field.onChange}
                error={errors.driver_id?.message}
                excludeBusId={initialValues?.bus_id}
              />
            )}
          />
        </div>
      </div>

      {/* FORM ACTION BUTTONS */}
      <div className="form-actions-footer">
        <button
          type="button"
          className="btn-cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X size={18} />
          <span>Cancel</span>
        </button>

        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting}
        >
          <Save size={18} />
          <span>{isSubmitting ? (isEditing ? "Updating..." : "Saving...") : (isEditing ? "Update Bus" : "Save Bus")}</span>
        </button>
      </div>
    </form>
  );
};

export default BusForm;
