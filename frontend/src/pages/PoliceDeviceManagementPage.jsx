import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import DeviceSummaryCards from '../components/police/device/DeviceSummaryCards';
import DeviceFilterBar from '../components/police/device/DeviceFilterBar';
import DeviceTable from '../components/police/device/DeviceTable';
import DevicePagination from '../components/police/device/DevicePagination';
import { mockDeviceData, deviceStats } from '../data/deviceMockData';
import '../styles/police-dashboard.css';
import '../styles/deviceManagement.css';

const ITEMS_PER_PAGE_DEFAULT = 10;

export const PoliceDeviceManagementPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [deviceType, setDeviceType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE_DEFAULT);

  // Applied filter state (updated only when Filter button is clicked)
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedType, setAppliedType] = useState('all');
  const [appliedStatus, setAppliedStatus] = useState('all');

  const filteredDevices = useMemo(() => {
    return mockDeviceData.filter((d) => {
      const matchSearch =
        !appliedSearch ||
        d.deviceCode.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        d.deviceName.toLowerCase().includes(appliedSearch.toLowerCase());
      const matchType = appliedType === 'all' || d.deviceType === appliedType;
      const matchStatus = appliedStatus === 'all' || d.status === appliedStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [appliedSearch, appliedType, appliedStatus]);

  const paginatedDevices = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredDevices.slice(start, start + rowsPerPage);
  }, [filteredDevices, currentPage, rowsPerPage]);

  const handleFilter = () => {
    setAppliedSearch(searchValue);
    setAppliedType(deviceType);
    setAppliedStatus(statusFilter);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchValue('');
    setDeviceType('all');
    setStatusFilter('all');
    setAppliedSearch('');
    setAppliedType('all');
    setAppliedStatus('all');
    setCurrentPage(1);
  };

  const handleRowsChange = (n) => {
    setRowsPerPage(n);
    setCurrentPage(1);
  };

  return (
    <div className="police-dashboard-layout">
      {/* Sidebar */}
      <PoliceSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="police-dashboard-main">
        {/* Sticky Header */}
        <PoliceDashboardHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Content */}
        <main className="device-mgmt-container">
          {/* Page Header */}
          <div className="device-mgmt-header-section">
            <div className="device-mgmt-header-left">
              <h1 className="device-mgmt-page-title">Device Management</h1>
              <p className="device-mgmt-page-subtitle">
                Manage all registered bus units and roadside units.
              </p>
            </div>
            <div className="device-mgmt-header-right">
              <Link to="/police/device-management/add" className="btn-add-device">
                <Plus size={15} />
                Add New Device
              </Link>
            </div>
          </div>

          {/* 5 KPI Summary Cards */}
          <DeviceSummaryCards stats={deviceStats} />

          {/* Filter Bar */}
          <DeviceFilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            deviceType={deviceType}
            onDeviceTypeChange={setDeviceType}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onReset={handleReset}
            onFilter={handleFilter}
          />

          {/* Device Table */}
          <DeviceTable devices={paginatedDevices} />

          {/* Pagination */}
          <DevicePagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalDevices={deviceStats.total}
            rowsPerPage={rowsPerPage}
            onRowsChange={handleRowsChange}
          />
        </main>
      </div>
    </div>
  );
};

export default PoliceDeviceManagementPage;
