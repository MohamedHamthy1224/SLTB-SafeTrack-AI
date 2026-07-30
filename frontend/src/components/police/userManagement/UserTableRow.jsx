import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Ban } from 'lucide-react';
import defaultAvatar from '../../../assets/images/default_driver_avatar.png';
import '../../../styles/userManagement.css';

const getRoleBadgeClass = (role) => {
  if (role === 'Police Admin') return 'badge-role police-admin';
  if (role === 'SLTB Admin') return 'badge-role sltb-admin';
  return 'badge-role traffic-police';
};

const UserTableRow = ({ user, index, onDeleteClick }) => {
  return (
    <tr>
      <td>{index + 1}</td>

      {/* Profile Avatar */}
      <td>
        <div className="user-avatar-cell">
          <img
            src={user.avatar || defaultAvatar}
            alt={user.fullName}
            className="user-avatar-img"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
          />
        </div>
      </td>

      <td>{user.fullName}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>

      {/* Role Badge */}
      <td>
        <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
      </td>

      <td>{user.department}</td>
      <td>{user.phone}</td>

      {/* Status Badge */}
      <td>
        <span
          className={`badge-user-status ${
            user.status.toLowerCase() === 'active' ? 'active' : 'inactive'
          }`}
        >
          {user.status}
        </span>
      </td>

      <td>{user.joinedDate}</td>

      {/* Actions */}
      <td>
        <div className="user-action-group">
          <Link
            to={`/police/user-management/view/${user.id}`}
            className="btn-action-icon view"
            title="View User"
          >
            <Eye size={13} />
          </Link>
          <Link
            to={`/police/user-management/edit/${user.id}`}
            className="btn-action-icon edit"
            title="Edit User"
          >
            <Edit2 size={13} />
          </Link>
          <button
            className="btn-action-icon delete"
            onClick={() => onDeleteClick(user)}
            title="Delete User"
          >
            <Ban size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
