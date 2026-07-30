import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import '../../../styles/systemLogs.css';

const SystemLogTable = ({ logs }) => {
  return (
    <div className="syslog-table-card">
      <h3 className="syslog-table-title">System Logs</h3>
      <div className="syslog-table-wrapper">
        <table className="syslog-table">
          <thead>
            <tr>
              <th className="sortable">
                Activity ID
                <span className="sort-icon">
                  <ArrowUpDown size={11} />
                </span>
              </th>
              <th>User ID</th>
              <th>Activity</th>
              <th className="sortable">
                Activity Time
                <span className="sort-icon">
                  <ArrowUpDown size={11} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}
                >
                  No activity logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.activityId}</td>
                  <td>{log.userId}</td>
                  <td>{log.activity}</td>
                  <td>{log.activityTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SystemLogTable;
