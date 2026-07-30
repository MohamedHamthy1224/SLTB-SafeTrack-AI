import React from 'react';
import { User, Compass } from 'lucide-react';
import UserProfileHeader from './UserProfileHeader';
import UserInfoCard from './UserInfoCard';
import InformationRow from './InformationRow';
import '../../../styles/userDetails.css';

const TrafficPoliceDetails = ({ user }) => {
  return (
    <>
      {/* Top Header Card */}
      <UserProfileHeader user={user} />

      {/* User Account Information */}
      <UserInfoCard icon={User} title="User Account Information">
        <div className="details-table-grid">
          <div>
            <InformationRow label="User ID" value={user.userId || user.id} />
            <InformationRow label="Role ID" value={user.roleId || '3'} />
            <InformationRow label="Username" value={user.username} />
            <InformationRow label="Email" value={user.email} />
            <InformationRow label="Password" value="********" isMasked />
          </div>
          <div>
            <InformationRow label="Theme Preference" value={user.themePreference || 'Light'} />
            <InformationRow label="Status" value={user.status} isStatus />
            <InformationRow label="Created At" value={user.createdAt || '21 Mar 2024, 09:00 AM'} />
            <InformationRow label="Updated At" value={user.updatedAt || '05 Jun 2025, 11:20 AM'} />
          </div>
        </div>
      </UserInfoCard>

      {/* Traffic Police Officer Information */}
      <UserInfoCard icon={Compass} title="Traffic Police Officer Information">
        <div className="details-table-grid">
          <div>
            <InformationRow label="Officer ID" value={user.officerId || user.id} />
            <InformationRow label="Linked User ID" value={user.userId || user.id} />
            <InformationRow label="Full Name" value={user.fullName} />
            <InformationRow label="Badge Number" value={user.badgeNumber || 'TP-2204'} />
            <InformationRow label="Rank" value={user.rank || 'Sergeant'} />
            <InformationRow label="Police Station" value={user.policeStation || user.department} />
          </div>
          <div>
            <InformationRow label="Phone" value={user.phone} />
            <InformationRow label="Joined Date" value={user.joinedDate} />
            <InformationRow label="Device Token" value={user.deviceToken || '••••••••B8E2'} />
            <InformationRow label="Is Online" value={user.isOnline || 'Online'} isStatus />
            <InformationRow label="Last Active" value={user.lastActive || user.updatedAt || '05 Jun 2025, 11:20 AM'} />
          </div>
        </div>
      </UserInfoCard>
    </>
  );
};

export default TrafficPoliceDetails;
