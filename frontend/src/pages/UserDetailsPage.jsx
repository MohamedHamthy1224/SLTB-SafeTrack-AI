import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import PoliceAdminDetails from '../components/police/users/PoliceAdminDetails';
import SLTBAdminDetails from '../components/police/users/SLTBAdminDetails';
import TrafficPoliceDetails from '../components/police/users/TrafficPoliceDetails';
import { mockUsersList } from '../data/userManagementMockData';
import '../styles/police-dashboard.css';
import '../styles/userDetails.css';

export const UserDetailsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();

  // Find user by ID or default to first user
  const user =
    mockUsersList.find((u) => String(u.id) === String(userId)) ||
    mockUsersList[0];

  const renderRoleDetails = () => {
    if (user.role === 'SLTB Admin') {
      return <SLTBAdminDetails user={user} />;
    }
    if (user.role === 'Traffic Police Officer') {
      return <TrafficPoliceDetails user={user} />;
    }
    return <PoliceAdminDetails user={user} />;
  };

  return (
    <div className="police-dashboard-layout">
      {/* Sidebar */}
      <PoliceSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Layout */}
      <div className="police-dashboard-main">
        <PoliceDashboardHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="user-details-container">
          {/* Header Row */}
          <div className="user-details-header-row">
            <div className="user-details-header-left">
              <h1 className="user-details-page-title">User Details</h1>
              <nav className="user-details-breadcrumb">
                <Link to="/police/user-management">User Management</Link>
                <span className="bc-sep">&gt;</span>
                <span className="bc-current">User Details</span>
              </nav>
            </div>

            <div className="user-details-header-right">
              <Link to="/police/user-management" className="btn-details-back">
                <ArrowLeft size={14} />
                Back to User Management
              </Link>
              <button
                type="button"
                className="btn-details-edit"
                onClick={() => navigate(`/police/users/edit/${user.id}`)}
              >
                <Edit2 size={14} />
                Edit User
              </button>
            </div>
          </div>

          {/* Role-based Content */}
          {renderRoleDetails()}
        </main>
      </div>
    </div>
  );
};

export default UserDetailsPage;
