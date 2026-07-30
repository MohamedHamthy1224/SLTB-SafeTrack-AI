import React from 'react';
import { User, Shield } from 'lucide-react';
import UserProfileHeader from './UserProfileHeader';
import UserInfoCard from './UserInfoCard';
import InformationRow from './InformationRow';
import '../../../styles/userDetails.css';

const PoliceAdminDetails = ({ user }) => {
  return (
    <>
      {/* Top Header Card */}
      <UserProfileHeader user={user} />

      {/* User Account Information */}
      <UserInfoCard icon={User} title="User Account Information">
        <div className="details-table-grid">
          <div>
            <InformationRow label="User ID" value={user.userId || user.id} />
            <InformationRow label="Role ID" value={user.roleId || '1'} />
            <InformationRow label="Username" value={user.username} />
            <InformationRow label="Email" value={user.email} />
            <InformationRow label="Password" value="********" isMasked />
          </div>
          <div>
            <InformationRow label="Theme Preference" value={user.themePreference || 'Light'} />
            <InformationRow label="Status" value={user.status} isStatus />
            <InformationRow label="Created At" value={user.createdAt || '05 Jan 2024, 08:30 AM'} />
            <InformationRow label="Updated At" value={user.updatedAt || '07 Jun 2025, 10:30 AM'} />
          </div>
        </div>
      </UserInfoCard>

      {/* Police Officer Information */}
      <UserInfoCard icon={Shield} title="Police Officer Information">
        <div className="details-table-grid">
          <div>
            <InformationRow label="Officer ID" value={user.officerId || user.id} />
            <InformationRow label="Linked User ID" value={user.userId || user.id} />
            <InformationRow label="Full Name" value={user.fullName} />
            <InformationRow label="Badge Number" value={user.badgeNumber || 'TP-4501'} />
            <InformationRow label="Rank" value={user.rank || 'Inspector'} />
            <InformationRow label="Police Station" value={user.policeStation || user.department} />
          </div>
          <div>
            <InformationRow label="Phone" value={user.phone} />
            <InformationRow label="Joined Date" value={user.joinedDate} />
            <InformationRow label="Device Token" value={user.deviceToken || '••••••••A9F4'} />
            <InformationRow label="Is Online" value={user.isOnline || 'Online'} isStatus />
            <InformationRow label="Last Active" value={user.lastActive || user.updatedAt || '07 Jun 2025, 10:30 AM'} />
          </div>
        </div>
      </UserInfoCard>
    </>
  );
};

export default PoliceAdminDetails;
