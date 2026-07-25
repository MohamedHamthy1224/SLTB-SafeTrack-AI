import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Plus, 
  Search, 
  Filter, 
  RotateCcw, 
  Eye, 
  Pencil, 
  PowerOff, 
  ChevronLeft, 
  ChevronRight, 
  Loader2 
} from 'lucide-react';

import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { DeactivateDriverConfirmationModal } from '../components/drivers/DeactivateDriverConfirmationModal';
import { driverService } from '../services/driverService';
import io from 'socket.io-client';
import defaultAvatar from '../assets/images/default_driver_avatar.png';
import '../styles/driverManagement.css';

export const DriverManagementPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Summary State
  const [summary, setSummary] = useState({
    totalDrivers: 0,
    activeDrivers: 0,
    inactiveDrivers: 0,
    activePercentage: 0,
    inactivePercentage: 0
  });

  // Filter & Search State
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedGender, setSelectedGender] = useState('All Gender');

  // Pagination State
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [paginationInfo, setPaginationInfo] = useState({
    totalItems: 0,
    totalPages: 1
  });

  // Table Data & Loading States
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Deactivate Modal State
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [selectedDriverForDeactivation, setSelectedDriverForDeactivation] = useState(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState(null);

  // Socket IO Ref
  const socketRef = useRef(null);

  // 300ms Debounce Effect for Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch Drivers Data from REST API
  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await driverService.getDrivers({
        search: debouncedSearch,
        status: selectedStatus,
        gender: selectedGender,
        page: page,
        per_page: perPage
      });

      if (res && res.success) {
        setDrivers(res.data.items || []);
        setPaginationInfo(res.data.pagination || { totalItems: 0, totalPages: 1 });
      } else {
        setError(res?.message || 'Failed to fetch driver records.');
      }
    } catch (err) {
      console.error('[DriverManagement] fetchDrivers error:', err);
      setError(err?.message || 'Error connecting to server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedStatus, selectedGender, page, perPage]);

  // Fetch Summary Data
  const fetchSummary = useCallback(async () => {
    try {
      const res = await driverService.getSummary();
      if (res && res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to load driver summary:', err);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchDrivers();
    fetchSummary();
  }, [fetchDrivers, fetchSummary]);

  // Socket.IO Setup & Event Handling with cleanup on unmount
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    const socket = io(backendUrl, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.emit('join_sltb_admin');

    const handleDriverUpdate = () => {
      fetchDrivers();
      fetchSummary();
    };

    socket.on('driver_registered', handleDriverUpdate);
    socket.on('driver_updated', handleDriverUpdate);
    socket.on('driver_deactivated', handleDriverUpdate);
    socket.on('driver_summary_updated', (newSummary) => {
      if (newSummary) setSummary(newSummary);
    });

    return () => {
      socket.off('driver_registered', handleDriverUpdate);
      socket.off('driver_updated', handleDriverUpdate);
      socket.off('driver_deactivated', handleDriverUpdate);
      socket.off('driver_summary_updated');
      socket.disconnect();
    };
  }, [fetchDrivers, fetchSummary]);

  // Filter & Search Handlers
  const handleFilterClick = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDrivers();
  };

  const handleResetClick = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setSelectedStatus('All Status');
    setSelectedGender('All Gender');
    setPage(1);
  };

  // Deactivate Handlers
  const openDeactivateModal = (driver) => {
    if (driver.status === 'Inactive') return;
    setSelectedDriverForDeactivation(driver);
    setDeactivateError(null);
    setDeactivateModalOpen(true);
  };

  const handleConfirmDeactivation = async () => {
    if (!selectedDriverForDeactivation) return;
    setIsDeactivating(true);
    setDeactivateError(null);
    try {
      const res = await driverService.deactivateDriver(
        selectedDriverForDeactivation.driver_id || selectedDriverForDeactivation.driverId
      );
      if (res && res.success) {
        setDeactivateModalOpen(false);
        setSelectedDriverForDeactivation(null);
        fetchDrivers();
        fetchSummary();
      } else {
        setDeactivateError(res?.message || 'Failed to deactivate driver.');
      }
    } catch (err) {
      console.error('[DriverManagement] deactivateDriver error:', err);
      setDeactivateError(err?.message || 'Error occurred while deactivating driver.');
    } finally {
      setIsDeactivating(false);
    }
  };

  // Helper function for profile photo URL
  const getProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return defaultAvatar;
    if (photoPath.startsWith('http')) return photoPath;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    return `${baseUrl}/api/v1/sltb/${photoPath}`;
  };

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="driver-management-container">
          {/* Header Title & Add Driver Button */}
          <div className="driver-header-flex">
            <div>
              <h1 className="driver-page-title">Driver Management</h1>
              <p className="driver-page-subtitle">Manage all registered drivers and their details.</p>
            </div>

            <Link to="/sltb/drivers/new" className="add-driver-btn">
              <Plus size={18} />
              <span>Add New Driver</span>
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="driver-summary-grid">
            <div className="driver-summary-card">
              <div className="summary-card-icon total">
                <Users size={24} />
              </div>
              <div className="summary-card-content">
                <h4>Total Drivers</h4>
                <div className="summary-card-value">{summary.totalDrivers}</div>
                <div className="summary-card-subtext">All registered drivers</div>
              </div>
            </div>

            <div className="driver-summary-card">
              <div className="summary-card-icon active">
                <UserCheck size={24} />
              </div>
              <div className="summary-card-content">
                <h4>Active Drivers</h4>
                <div className="summary-card-value">{summary.activeDrivers}</div>
                <div className="summary-card-subtext">{summary.activePercentage}% of total</div>
              </div>
            </div>

            <div className="driver-summary-card">
              <div className="summary-card-icon inactive">
                <UserX size={24} />
              </div>
              <div className="summary-card-content">
                <h4>Inactive Drivers</h4>
                <div className="summary-card-value">{summary.inactiveDrivers}</div>
                <div className="summary-card-subtext">{summary.inactivePercentage}% of total</div>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <form className="driver-filter-bar" onSubmit={handleFilterClick}>
            <div className="driver-search-input-wrapper">
              <Search className="driver-search-icon" size={18} />
              <input
                type="text"
                placeholder="Search driver name, ID, license, phone or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>Select Status</label>
              <select
                className="driver-select-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>Select Gender</label>
              <select
                className="driver-select-filter"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="All Gender">All Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="driver-filter-actions">
              <button type="button" className="driver-btn-reset" onClick={handleResetClick}>
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
              <button type="submit" className="driver-btn-filter">
                <Filter size={16} />
                <span>Filter</span>
              </button>
            </div>
          </form>

          {/* Driver Details Table Card */}
          <div className="driver-table-card">
            <div className="driver-table-wrapper">
              <table className="driver-table">
                <thead>
                  <tr>
                    <th>Driver Name</th>
                    <th>Driver ID</th>
                    <th>License Number</th>
                    <th>NIC Number</th>
                    <th>Phone Number</th>
                    <th>Email Address</th>
                    <th>Experience (Years)</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th>Joined Date</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="11" className="table-empty-state">
                        <Loader2 size={32} className="spinner" style={{ margin: '0 auto 0.5rem auto' }} />
                        <p>Loading driver records...</p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="11" className="table-empty-state" style={{ color: '#ef4444' }}>
                        <p>{error}</p>
                      </td>
                    </tr>
                  ) : drivers.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="table-empty-state">
                        <Users size={40} style={{ color: '#94a3b8', margin: '0 auto 0.5rem auto' }} />
                        <h3>No Drivers Found</h3>
                        <p style={{ fontSize: '0.875rem' }}>No matching driver records found for the selected filter criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    drivers.map((driver) => {
                      const dId = driver.driver_id || driver.driverId;
                      const isInactive = driver.status === 'Inactive';
                      return (
                        <tr key={dId}>
                          <td>
                            <div className="driver-photo-cell">
                              <img
                                src={getProfilePhotoUrl(driver.profile_picture || driver.profilePicture)}
                                alt={driver.full_name || driver.fullName}
                                className="driver-avatar-img"
                                onError={(e) => { e.target.src = defaultAvatar; }}
                              />
                              <span className="driver-name-text">{driver.full_name || driver.fullName}</span>
                            </div>
                          </td>
                          <td style={{ fontWeight: 600, color: '#3b82f6' }}>{`DRV${dId}`}</td>
                          <td>{driver.license_number || driver.licenseNumber || 'Not Available'}</td>
                          <td>{driver.nic || 'Not Available'}</td>
                          <td>{driver.phone || 'Not Available'}</td>
                          <td>{driver.email_address || driver.emailAddress || 'Not Available'}</td>
                          <td>{driver.experience_years ?? driver.experienceYears ?? 0}</td>
                          <td>{driver.gender || 'Not Available'}</td>
                          <td>
                            <span className={`badge-status ${(driver.status || 'Active').toLowerCase()}`}>
                              {driver.status || 'Active'}
                            </span>
                          </td>
                          <td>{driver.join_date || driver.joinDate || 'Not Available'}</td>
                          <td>
                            <div className="driver-actions-cell" style={{ justifyContent: 'center' }}>
                              <button
                                type="button"
                                className="action-btn"
                                title="View Details"
                                onClick={() => navigate(`/sltb/drivers/${dId}`)}
                              >
                                <Eye size={16} />
                              </button>

                              <button
                                type="button"
                                className="action-btn"
                                title="Edit Driver"
                                onClick={() => navigate(`/sltb/drivers/${dId}/edit`)}
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                className={`action-btn deactivate ${isInactive ? 'disabled' : ''}`}
                                title={isInactive ? 'This driver is already inactive.' : 'Deactivate Driver'}
                                disabled={isInactive}
                                onClick={() => openDeactivateModal(driver)}
                              >
                                <PowerOff size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            {!loading && drivers.length > 0 && (
              <div className="driver-pagination-bar">
                <div className="pagination-info">
                  Showing <strong>{(page - 1) * perPage + 1}</strong> to <strong>{Math.min(page * perPage, paginationInfo.totalItems)}</strong> of <strong>{paginationInfo.totalItems}</strong> drivers
                </div>

                <div className="pagination-controls">
                  <button
                    type="button"
                    className="page-num-btn"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1).map((pNum) => (
                    <button
                      key={pNum}
                      type="button"
                      className={`page-num-btn ${page === pNum ? 'active' : ''}`}
                      onClick={() => setPage(pNum)}
                    >
                      {pNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="page-num-btn"
                    disabled={page >= paginationInfo.totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, paginationInfo.totalPages))}
                  >
                    <ChevronRight size={16} />
                  </button>

                  <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <span>Rows per page</span>
                    <select
                      className="rows-per-page-select"
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setPage(1);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Deactivate Driver Confirmation Modal */}
      <DeactivateDriverConfirmationModal
        isOpen={deactivateModalOpen}
        driver={selectedDriverForDeactivation}
        isDeactivating={isDeactivating}
        errorMessage={deactivateError}
        onCancel={() => {
          setDeactivateModalOpen(false);
          setSelectedDriverForDeactivation(null);
        }}
        onConfirm={handleConfirmDeactivation}
      />
    </div>
  );
};
