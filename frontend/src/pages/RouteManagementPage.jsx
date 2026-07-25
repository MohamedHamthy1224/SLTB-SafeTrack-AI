import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import RouteSummaryCards from '../components/routes/RouteSummaryCards';
import RouteFilterPanel from '../components/routes/RouteFilterPanel';
import RouteTable from '../components/routes/RouteTable';
import RoutePagination from '../components/routes/RoutePagination';
import DeactivateRouteConfirmationModal from '../components/routes/DeactivateRouteConfirmationModal';
import routeService from '../services/routeService';
import io from 'socket.io-client';

const initialSummaryState = {
  totalRoutes: 0,
  activeRoutes: 0,
  inactiveRoutes: 0,
  activePercentage: 0,
  inactivePercentage: 0,
  totalDistanceKm: 0
};

export const RouteManagementPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Summary and Option states initialized to valid objects
  const [summary, setSummary] = useState(initialSummaryState);
  const [filterOptions, setFilterOptions] = useState({ startLocations: [], endLocations: [], statuses: [] });
  const [routes, setRoutes] = useState([]);

  // Applied Filter states
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    status: '',
    start_location: '',
    end_location: ''
  });

  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1
  });

  // Deactivation Modal states
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [selectedRouteToDeactivate, setSelectedRouteToDeactivate] = useState(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState('');

  // Initial Summary & Options loading
  const loadInitialOptionsAndSummary = useCallback(async () => {
    try {
      const [summaryRes, filterOptRes] = await Promise.all([
        routeService.getSummary(),
        routeService.getFilterOptions()
      ]);

      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data);
      }
      if (filterOptRes.success && filterOptRes.data) {
        setFilterOptions(filterOptRes.data || { startLocations: [], endLocations: [], statuses: [] });
      }
    } catch (err) {
      console.error('Error fetching route summary or filter options:', err);
    }
  }, []);

  // Fetch Routes list from API
  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search: appliedFilters.search,
        status: appliedFilters.status,
        start_location: appliedFilters.start_location,
        end_location: appliedFilters.end_location,
        page: pagination.page,
        per_page: pagination.perPage
      };

      const res = await routeService.getRoutes(params);
      if (res.success && res.data) {
        setRoutes(res.data.items || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      } else {
        setError(res.message || 'Failed to load routes.');
      }
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError(err.response?.data?.message || 'Unable to communicate with route service.');
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, pagination.page, pagination.perPage]);

  // Trigger initial options & route list fetch on mount / dependencies
  useEffect(() => {
    loadInitialOptionsAndSummary();
  }, [loadInitialOptionsAndSummary]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  // WebSocket event listeners with explicit cleanup
  useEffect(() => {
    const socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    const handleRouteEvent = () => {
      loadInitialOptionsAndSummary();
      fetchRoutes();
    };

    socket.on('route_registered', handleRouteEvent);
    socket.on('route_updated', handleRouteEvent);
    socket.on('route_deactivated', handleRouteEvent);
    socket.on('route_summary_updated', (newSummary) => {
      if (newSummary) setSummary(newSummary);
    });

    return () => {
      socket.off('route_registered', handleRouteEvent);
      socket.off('route_updated', handleRouteEvent);
      socket.off('route_deactivated', handleRouteEvent);
      socket.off('route_summary_updated');
      socket.disconnect();
    };
  }, [loadInitialOptionsAndSummary, fetchRoutes]);

  // Filter submit handler
  const handleFilterSubmit = (newFilters) => {
    setAppliedFilters({
      search: newFilters.search || '',
      status: newFilters.status || '',
      start_location: newFilters.start_location || '',
      end_location: newFilters.end_location || ''
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Reset handler
  const handleResetFilters = () => {
    setAppliedFilters({
      search: '',
      status: '',
      start_location: '',
      end_location: ''
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePerPageChange = (newPerPage) => {
    setPagination((prev) => ({ ...prev, perPage: newPerPage, page: 1 }));
  };

  // Open Deactivation Modal
  const handleDeactivateClick = (routeObj) => {
    setSelectedRouteToDeactivate(routeObj);
    setDeactivateError('');
    setDeactivateModalOpen(true);
  };

  // Confirm Route Deactivation Action
  const handleConfirmDeactivate = async () => {
    if (!selectedRouteToDeactivate) return;
    const routeId = selectedRouteToDeactivate.route_id || selectedRouteToDeactivate.routeId;
    
    setIsDeactivating(true);
    setDeactivateError('');

    try {
      const res = await routeService.deactivateRoute(routeId);
      if (res.success) {
        setDeactivateModalOpen(false);
        setSelectedRouteToDeactivate(null);
        // Refresh summary and route list immediately from database
        loadInitialOptionsAndSummary();
        fetchRoutes();
      } else {
        setDeactivateError(res.message || 'Failed to deactivate route.');
      }
    } catch (err) {
      console.error('Error deactivating route:', err);
      const msg = err.response?.data?.message || 'Route deactivation failed. Please try again.';
      setDeactivateError(msg);
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          title="Route Management"
          subtitle="Manage all routes and their details."
        />

        <main className="dashboard-content">
          {/* Header Action Bar */}
          <div className="page-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                Route Management
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
                Manage all routes and their details.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-add-route"
              onClick={() => navigate('/sltb/routes/new')}
            >
              <Plus size={18} />
              <span>Add New Route</span>
            </button>
          </div>

          {/* 1. Route Summary Cards */}
          <RouteSummaryCards summary={summary} loading={loading && !summary} />

          {/* 2. Search and Filter Panel */}
          <div className="content-card filter-card" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <RouteFilterPanel
              options={filterOptions}
              filters={appliedFilters}
              onFilterSubmit={handleFilterSubmit}
              onReset={handleResetFilters}
              loading={loading}
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="error-banner-alert" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171' }}>
              <p style={{ margin: 0, fontWeight: '500' }}>{error}</p>
            </div>
          )}

          {/* 3. Route Details Table & Pagination */}
          <div className="content-card table-card">
            <RouteTable
              routes={routes}
              loading={loading}
              onDeactivateClick={handleDeactivateClick}
            />

            <RoutePagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              loading={loading}
            />
          </div>
        </main>
      </div>

      {/* Deactivate Confirmation Modal */}
      <DeactivateRouteConfirmationModal
        isOpen={deactivateModalOpen}
        route={selectedRouteToDeactivate}
        isDeactivating={isDeactivating}
        errorMessage={deactivateError}
        onCancel={() => {
          if (!isDeactivating) {
            setDeactivateModalOpen(false);
            setSelectedRouteToDeactivate(null);
          }
        }}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
};

export default RouteManagementPage;
