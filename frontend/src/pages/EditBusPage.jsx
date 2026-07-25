import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import BusForm from '../components/buses/BusForm';
import busService from '../services/busService';

export const EditBusPage = () => {
  const { busId } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiErrors, setApiErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);

  useEffect(() => {
    const fetchBusForEdit = async () => {
      setLoading(true);
      try {
        const response = await busService.getBusDetails(busId);
        if (response.success && response.data) {
          setInitialValues(response.data);
        } else {
          setGlobalError(response.message || "Failed to load bus details for editing.");
        }
      } catch (err) {
        setGlobalError(err.message || "Failed to load bus details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBusForEdit();
  }, [busId]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setApiErrors({});
    setGlobalError(null);

    const payload = {
      bus: {
        bus_number: formData.bus_number,
        registration_number: formData.registration_number,
        service_type: formData.service_type,
        model: formData.model,
        chassis_number: formData.chassis_number,
        engine_number: formData.engine_number,
        manufacture_year: Number(formData.manufacture_year),
        capacity: Number(formData.capacity),
        standing_capacity: Number(formData.standing_capacity),
        fuel_type: formData.fuel_type,
        status: formData.status
      },
      assignment: {
        route_id: Number(formData.route_id),
        driver_id: Number(formData.driver_id)
      }
    };

    try {
      const response = await busService.updateBus(busId, payload);
      if (response.success) {
        navigate(`/sltb/buses/${busId}`);
      } else {
        if (response.errors) setApiErrors(response.errors);
        setGlobalError(response.message || "Failed to update bus details.");
      }
    } catch (err) {
      if (err.errors) {
        setApiErrors(err.errors);
      }
      setGlobalError(err.message || "An unexpected error occurred while updating the bus.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="dashboard-content edit-bus-content">
          {/* Top Bar with Breadcrumb and Back to Bus Details Button */}
          <div className="page-top-actions-row">
            <div className="breadcrumb-nav">
              <Link to="/sltb/dashboard">Dashboard</Link>
              <ChevronRight size={14} />
              <Link to="/sltb/buses">Bus Management</Link>
              <ChevronRight size={14} />
              <span className="current">Edit Bus</span>
            </div>

            <button
              type="button"
              className="btn-back"
              onClick={() => navigate(`/sltb/buses/${busId}`)}
            >
              <ArrowLeft size={16} />
              <span>Back to Bus Details</span>
            </button>
          </div>

          <div className="page-header-row margin-bottom-md">
            <div>
              <h1 className="page-title">Edit Bus</h1>
              <p className="page-description">
                Update bus specifications, status, and active route/driver assignment.
              </p>
            </div>
          </div>

          {globalError && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <span>{globalError}</span>
            </div>
          )}

          {loading ? (
            <div className="details-loading-container">
              <div className="spinner"></div>
              <p>Loading bus details from MySQL...</p>
            </div>
          ) : (
            initialValues && (
              <BusForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                onCancel={() => navigate(`/sltb/buses/${busId}`)}
                isEditing={true}
                isSubmitting={isSubmitting}
                apiErrors={apiErrors}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default EditBusPage;
