import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import UserSummaryCards from '../components/police/userManagement/UserSummaryCards';
import UserFilterBar from '../components/police/userManagement/UserFilterBar';
import UserTable from '../components/police/userManagement/UserTable';
import UserPagination from '../components/police/userManagement/UserPagination';
import DeleteUserDialog from '../components/police/userManagement/DeleteUserDialog';
import userService from '../services/userService';
import {
  userRoleOptions,
  userStatusOptions,
} from '../data/userManagementMockData';
import '../styles/police-dashboard.css';
import '../styles/userManagement.css';

export const PoliceUserManagementPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Data states
  const [users, setUsers] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    policeAdminUsers: 0,
    trafficPoliceOfficers: 0,
    sltbAdminUsers: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filter state
  const [searchValue, setSearchValue] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch summary stats
  const fetchSummary = async () => {
    try {
      const res = await userService.getUserSummary();
      if (res && res.success && res.data) {
        setSummaryStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch user summary stats:', err);
    }
  };

  // Fetch users list from backend
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: searchValue,
        role: selectedRole === 'All Roles' ? '' : selectedRole,
        status: selectedStatus === 'All Status' ? '' : selectedStatus,
        page: currentPage,
        per_page: 50,
      };
      const res = await userService.getUsers(params);
      if (res && res.success && res.data) {
        setUsers(res.data.users || []);
        setTotalItems(res.data.total || 0);
      } else {
        setUsers([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error('Failed to fetch users from MySQL API:', err);
      setUsers([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [searchValue, selectedRole, selectedStatus, currentPage]);

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteClick = (user) => {
    setSelectedUserForDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (userToDelete) => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      const res = await userService.deleteUser(userToDelete.id);
      if (res.success) {
        setDeleteModalOpen(false);
        setSelectedUserForDelete(null);
        fetchUsers();
        fetchSummary();
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = {
        search: searchValue,
        role: selectedRole === 'All Roles' ? '' : selectedRole,
        status: selectedStatus === 'All Status' ? '' : selectedStatus,
      };
      await userService.exportUsers(params);
    } catch (err) {
      console.error('Failed to export users:', err);
    }
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
          <UserSummaryCards stats={summaryStats} />

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
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading user records from database...
            </div>
          ) : (
            <UserTable
              users={users}
              onDeleteClick={handleDeleteClick}
            />
          )}

          {/* Pagination */}
          <UserPagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalItems / 50) || 1}
            totalItems={totalItems}
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
        isSubmitting={deleting}
      />
    </div>
  );
};

export default PoliceUserManagementPage;
