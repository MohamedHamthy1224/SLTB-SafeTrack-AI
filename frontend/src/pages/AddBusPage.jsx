import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import BusForm from '../components/buses/BusForm';
import busService from '../services/busService';

export const AddBusPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiErrors, setApiErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);

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
      const response = await busService.createBus(payload);
      if (response.success) {
        navigate('/sltb/buses');
      } else {
        if (response.errors) setApiErrors(response.errors);
        setGlobalError(response.message || "Failed to register bus.");
      }
    } catch (err) {
      if (err.errors) {
        setApiErrors(err.errors);
      }
      setGlobalError(err.message || "An unexpected error occurred while registering the bus.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="dashboard-content add-bus-content">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb-nav">
            <Link to="/sltb/dashboard">Dashboard</Link>
            <ChevronRight size={14} />
            <Link to="/sltb/buses">Bus Management</Link>
            <ChevronRight size={14} />
            <span className="current">Add New Bus</span>
          </div>

          <div className="page-header-row margin-bottom-md">
            <div>
              <h1 className="page-title">Add New Bus</h1>
              <p className="page-description">
                Register a new bus to the SLTB fleet and assign its operational route and driver.
              </p>
            </div>
          </div>

          {globalError && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <span>{globalError}</span>
            </div>
          )}

          {/* BUS FORM COMPONENT */}
          <BusForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/sltb/buses')}
            isEditing={false}
            isSubmitting={isSubmitting}
            apiErrors={apiErrors}
          />
        </div>
      </main>
    </div>
  );
};

export default AddBusPage;
