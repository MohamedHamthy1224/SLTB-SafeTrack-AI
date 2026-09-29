import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PoliceSidebar } from '../../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../../components/police/PoliceDashboardHeader';
import UTurnSummaryCards from '../../components/police/uTurnManagement/UTurnSummaryCards';
import UTurnFilter from '../../components/police/uTurnManagement/UTurnFilter';
import UTurnTable from '../../components/police/uTurnManagement/UTurnTable';
import UTurnPagination from '../../components/police/uTurnManagement/UTurnPagination';
import DeactivateUTurnDialog from '../../components/police/uTurnManagement/DeactivateUTurnDialog';
import policeUTurnManagementService from '../../services/policeUTurnManagementService';
import '../../styles/police-dashboard.css';
import '../../styles/uturnManagement.css';

export const UTurnManagementPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Data states
  const [units, setUnits] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalUnits: 0,
    activeUnits: 0,
    inactiveUnits: 0,
    maintenanceUnits: 0
  });
  const [statusOptions, setStatusOptions] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);

  // UI / Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Filters state
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Deactivate Modal state
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [selectedUnitForDeactivate, setSelectedUnitForDeactivate] = useState(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Fetch summary metrics
  const fetchSummary = useCallback(async () => {
    try {
      const res = await policeUTurnManagementService.getSummary();
      if (res && res.data) {
        setSummaryStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch U-Turn summary:', err);
    }
  }, []);

  // Fetch filter options (statuses and routes)
  const fetchFilterOptions = useCallback(async () => {
    try {
      const [statusesRes, routesRes] = await Promise.all([
        policeUTurnManagementService.getStatuses(),
        policeUTurnManagementService.getRoutes()
      ]);
      if (statusesRes && statusesRes.data) {
        setStatusOptions(statusesRes.data);
      }
      if (routesRes && routesRes.data) {
        setRouteOptions(routesRes.data);
      }
    } catch (err) {
      console.error('Failed to load filter metadata:', err);
    }
  }, []);

  // Fetch units list from API with active filters
  const fetchUnits = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {};
      if (filters.keyword && filters.keyword.trim()) {
        params.keyword = filters.keyword.trim();
      }
      if (filters.status && filters.status.trim()) {
        params.status = filters.status.trim();
      }
      if (filters.route && filters.route.trim()) {
        params.route_id = filters.route.trim();
      }

      const res = await policeUTurnManagementService.getAllUTurnUnits(params);
      if (res && res.data) {
        setUnits(res.data);
      } else {
        setUnits([]);
      }
    } catch (err) {
      console.error('Failed to fetch U-turn units:', err);
      setErrorMessage(err.message || 'Unable to load roadside U-turn units from database.');
      setUnits([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchSummary();
    fetchFilterOptions();
    fetchUnits();
  }, [fetchSummary, fetchFilterOptions, fetchUnits]);

  // Apply filters button
  const handleFilterClick = () => {
    setCurrentPage(1);
    fetchUnits({
      keyword: searchValue,
      status: selectedStatus,
      route: selectedRoute
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchValue('');
    setSelectedStatus('');
    setSelectedRoute('');
    setCurrentPage(1);
    fetchUnits({});
  };

  // Export PDF
  const handleExportClick = async () => {
    setIsExporting(true);
    try {
      const params = {};
      if (searchValue.trim()) params.search = searchValue.trim();
      if (selectedStatus.trim()) params.status = selectedStatus.trim();
      if (selectedRoute.trim()) params.route_id = selectedRoute.trim();

      await policeUTurnManagementService.exportPdf(params);
      setSuccessMessage('U-Turn units PDF report generated and downloaded.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      setErrorMessage(err.message || 'Failed to generate U-turn units PDF report.');
    } finally {
      setIsExporting(false);
    }
  };

  // Deactivate modal handlers
  const handleDeactivateClick = (unit) => {
    setSelectedUnitForDeactivate(unit);
    setDeactivateModalOpen(true);
  };

  const handleConfirmDeactivate = async (unit) => {
    const unitId = unit.roadsideUnitId || unit.roadside_unit_id || unit.id;
    setIsDeactivating(true);
    setErrorMessage(null);
    try {
      await policeUTurnManagementService.deactivateUnit(unitId);
      setDeactivateModalOpen(false);
      setSelectedUnitForDeactivate(null);
      setSuccessMessage(`Roadside Unit #${unitId} has been successfully deactivated.`);
      setTimeout(() => setSuccessMessage(null), 4000);

      // Refresh live units and summary metrics
      fetchUnits({
        keyword: searchValue,
        status: selectedStatus,
        route: selectedRoute
      });
      fetchSummary();
    } catch (err) {
      console.error('Failed to deactivate unit:', err);
      setErrorMessage(err.message || 'Failed to deactivate unit.');
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleAddUnit = () => {
    navigate('/police/u-turn-management/add');
  };

  // Client-side pagination slice over fetched list
  const paginatedUnits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return units.slice(start, start + pageSize);
  }, [units, currentPage, pageSize]);

  const totalPages = Math.ceil(units.length / pageSize) || 1;

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

        <main className="uturn-mgmt-container">
          {/* Success / Error Alerts */}
          {successMessage && (
            <div className="uturn-alert-banner success">
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="uturn-alert-banner error">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Header Title & Add Button Row */}
          <div className="uturn-header-row">
            <div>
              <h1 className="uturn-page-title">U-Turn Management</h1>
              <p className="uturn-page-desc">Manage all roadside U-turn units, locations, and sensor configurations.</p>
            </div>
            <button
              type="button"
              className="btn-uturn-add"
              onClick={handleAddUnit}
            >
              <Plus size={16} />
              Add New U-Turn Unit
            </button>
          </div>

          {/* Live Summary Cards */}
          <UTurnSummaryCards stats={summaryStats} />

          {/* Dynamic Filter Bar */}
          <UTurnFilter
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            statusOptions={statusOptions}
            selectedRoute={selectedRoute}
            onRouteChange={setSelectedRoute}
            routeOptions={routeOptions}
            onReset={handleResetFilters}
            onFilter={handleFilterClick}
            onExport={handleExportClick}
            isExporting={isExporting}
          />

          {/* Live Table */}
          <UTurnTable
            units={paginatedUnits}
            isLoading={isLoading}
            onDeactivateClick={handleDeactivateClick}
          />

          {/* Pagination */}
          <UTurnPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={units.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </main>
      </div>

      {/* Deactivate Confirmation Modal */}
      <DeactivateUTurnDialog
        isOpen={deactivateModalOpen}
        unit={selectedUnitForDeactivate}
        onClose={() => setDeactivateModalOpen(false)}
        onConfirm={handleConfirmDeactivate}
        isSubmitting={isDeactivating}
      />
    </div>
  );
};

export default UTurnManagementPage;
