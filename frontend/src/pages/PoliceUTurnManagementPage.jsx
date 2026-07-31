import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import UTurnSummaryCards from '../components/police/uturnManagement/UTurnSummaryCards';
import UTurnFilterBar from '../components/police/uturnManagement/UTurnFilterBar';
import UTurnTable from '../components/police/uturnManagement/UTurnTable';
import UTurnPagination from '../components/police/uturnManagement/UTurnPagination';
import DeleteUTurnDialog from '../components/police/uturnManagement/DeleteUTurnDialog';
import {
  uturnSummaryStats,
  mockUTurnUnitsList,
  uturnStatusOptions,
  uturnRouteOptions,
} from '../data/uturnManagementMockData';
import '../styles/police-dashboard.css';
import '../styles/uturnManagement.css';

export const PoliceUTurnManagementPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Temporary frontend state
  const [units, setUnits] = useState(mockUTurnUnitsList);

  // Filters state
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedRoute, setSelectedRoute] = useState('All Routes');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUnitForDelete, setSelectedUnitForDelete] = useState(null);

  // Filtered units computation
  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      const q = searchValue.trim().toLowerCase();
      const matchSearch =
        !q ||
        (unit.roadsideUnitId && unit.roadsideUnitId.toLowerCase().includes(q)) ||
        (unit.deviceId && unit.deviceId.toLowerCase().includes(q)) ||
        (unit.locationName && unit.locationName.toLowerCase().includes(q));

      const matchStatus =
        selectedStatus === 'All Status' ||
        (unit.status && unit.status.toLowerCase() === selectedStatus.toLowerCase());

      const matchRoute =
        selectedRoute === 'All Routes' || unit.routeId === selectedRoute;

      return matchSearch && matchStatus && matchRoute;
    });
  }, [units, searchValue, selectedStatus, selectedRoute]);

  const handleResetFilters = () => {
    setSearchValue('');
    setSelectedStatus('All Status');
    setSelectedRoute('All Routes');
    setCurrentPage(1);
  };

  const handleFilterClick = () => {
    setCurrentPage(1);
  };

  const handleExportClick = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Roadside Unit ID,Device ID,Route ID,Location Name,Latitude,Longitude,Installation Date,Status,Created At']
        .concat(
          filteredUnits.map(
            (u) =>
              `${u.roadsideUnitId},${u.deviceId},${u.routeId},"${u.locationName}",${u.latitude},${u.longitude},${u.installationDate},${u.status},${u.createdAt}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `uturn_units_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteClick = (unit) => {
    setSelectedUnitForDelete(unit);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (unitToDelete) => {
    setUnits((prev) => prev.filter((u) => u.id !== unitToDelete.id));
    setDeleteModalOpen(false);
    setSelectedUnitForDelete(null);
  };

  const handleAddUnit = () => {
    navigate('/police/uturn-management/add');
  };

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
          {/* Header Title & Add Button Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="uturn-page-title">U-Turn Management</h1>
              <p className="uturn-page-desc">Manage all roadside U-turn units and their details.</p>
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

          {/* Summary Cards */}
          <UTurnSummaryCards stats={uturnSummaryStats} />

          {/* Filter Bar */}
          <UTurnFilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            statusOptions={uturnStatusOptions}
            selectedRoute={selectedRoute}
            onRouteChange={setSelectedRoute}
            routeOptions={uturnRouteOptions}
            onReset={handleResetFilters}
            onFilter={handleFilterClick}
            onExport={handleExportClick}
          />

          {/* User Data Table */}
          <UTurnTable
            units={filteredUnits}
            onDeleteClick={handleDeleteClick}
          />

          {/* Pagination */}
          <UTurnPagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredUnits.length / pageSize) || 1}
            totalItems={filteredUnits.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteUTurnDialog
        isOpen={deleteModalOpen}
        unit={selectedUnitForDelete}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default PoliceUTurnManagementPage;
