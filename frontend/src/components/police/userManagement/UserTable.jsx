import React from 'react';
import UserTableRow from './UserTableRow';
import '../../../styles/userManagement.css';

const UserTable = ({ users, onDeleteClick }) => {
  return (
    <div className="user-table-card">
      <h3 className="user-table-card-title">User Details</h3>

      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Profile</th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department / Police Station</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}
                >
                  No users found matching the selected criteria.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  index={index}
                  onDeleteClick={onDeleteClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
