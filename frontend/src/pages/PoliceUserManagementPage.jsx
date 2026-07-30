import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import UserSummaryCards from '../components/police/userManagement/UserSummaryCards';
import UserFilterBar from '../components/police/userManagement/UserFilterBar';
import UserTable from '../components/police/userManagement/UserTable';
import UserPagination from '../components/police/userManagement/UserPagination';
import DeleteUserDialog from '../components/police/userManagement/DeleteUserDialog';
import {
  userManagementSummaryStats,
  mockUsersList,
  userRoleOptions,
  userStatusOptions,
} from '../data/userManagementMockData';
import '../styles/police-dashboard.css';
import '../styles/userManagement.css';

export const PoliceUserManagementPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Users data state
  const [users, setUsers] = useState(mockUsersList);

  // Filter state
  const [searchValue, setSearchValue] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchValue.toLowerCase();
      const matchSearch =
        !query ||
        user.fullName.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchRole =
        selectedRole === 'All Roles' || user.role === selectedRole;

      const matchStatus =
        selectedStatus === 'All Status' ||
        user.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchValue, selectedRole, selectedStatus]);

  const handleDeleteClick = (user) => {
    setSelectedUserForDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (userToDelete) => {
    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    setDeleteModalOpen(false);
    setSelectedUserForDelete(null);
  };

  const navigate = useNavigate();

  const handleExport = () => {
    // Frontend-only placeholder
  };

  const handleAddUser = () => {
    navigate('/police/users/add');
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

        <main className="user-mgmt-container">
          {/* Page Title */}
          <div className="user-mgmt-header-section">
            <h1 className="user-mgmt-page-title">User Management</h1>
          </div>

          {/* Summary Cards */}
          <UserSummaryCards stats={userManagementSummaryStats} />

          {/* Filter Bar */}
          <UserFilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            roleOptions={userRoleOptions}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            statusOptions={userStatusOptions}
            onExport={handleExport}
            onAddUser={handleAddUser}
          />

          {/* User Table */}
          <UserTable
            users={filteredUsers}
            onDeleteClick={handleDeleteClick}
          />

          {/* Pagination */}
          <UserPagination
            currentPage={currentPage}
            totalPages={1}
            totalItems={filteredUsers.length}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteUserDialog
        isOpen={deleteModalOpen}
        user={selectedUserForDelete}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default PoliceUserManagementPage;
