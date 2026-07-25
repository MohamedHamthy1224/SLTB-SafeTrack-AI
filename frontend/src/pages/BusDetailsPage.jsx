import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import BusDetailsCard from '../components/buses/BusDetailsCard';
import TechnicalInformation from '../components/buses/TechnicalInformation';
import busService from '../services/busService';

export const BusDetailsPage = () => {
  const { busId } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bus, setBus] = useState(null);
  const [error, setError] = useState(null);

  const fetchBusDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await busService.getBusDetails(busId);
      if (response.success && response.data) {
        setBus(response.data);
      } else {
        setError(response.message || "Bus details could not be found.");
      }
    } catch (err) {
      setError(err.message || "Failed to load bus details from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusDetails();
  }, [busId]);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="dashboard-content bus-details-content">
          {/* Breadcrumb & Header Controls */}
          <div className="page-top-actions-row">
            <div className="breadcrumb-nav">
              <Link to="/sltb/dashboard">Dashboard</Link>
              <ChevronRight size={14} />
              <Link to="/sltb/buses">Bus Management</Link>
              <ChevronRight size={14} />
              <span className="current">Bus Details</span>
            </div>

            <button
              type="button"
              className="btn-back"
              onClick={() => navigate('/sltb/buses')}
            >
              <ArrowLeft size={16} />
              <span>Back to Bus Management</span>
            </button>
          </div>

          <div className="page-header-row margin-bottom-md">
            <div>
              <h1 className="page-title">Bus Details</h1>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="details-loading-container">
              <div className="spinner"></div>
              <p>Fetching bus details from MySQL...</p>
            </div>
          )}

          {/* ERROR STATE */}
          {!loading && error && (
            <div className="details-error-card">
              <AlertCircle size={48} className="error-icon" />
              <h3>Bus Not Found</h3>
              <p>{error}</p>
              <div className="error-actions">
                <button type="button" className="btn-retry" onClick={fetchBusDetails}>
                  <RefreshCw size={16} />
                  <span>Retry</span>
                </button>
                <button type="button" className="btn-back" onClick={() => navigate('/sltb/buses')}>
                  <ArrowLeft size={16} />
                  <span>Back to Bus Management</span>
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS STATE */}
          {!loading && !error && bus && (
            <div className="bus-details-view">
              {/* 1. MAIN BUS DETAILS CARD */}
              <BusDetailsCard bus={bus} />

              {/* 2. TECHNICAL INFORMATION */}
              <TechnicalInformation bus={bus} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BusDetailsPage;
