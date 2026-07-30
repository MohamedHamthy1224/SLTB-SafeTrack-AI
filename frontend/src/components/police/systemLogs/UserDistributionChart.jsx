import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import '../../../styles/systemLogs.css';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '0.5rem 0.8rem',
          boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#0f172a',
        }}
      >
        <div style={{ color: '#64748b', fontWeight: 600, marginBottom: 2 }}>{d.name}</div>
        <div>{d.count.toLocaleString()} activities ({d.percentage}%)</div>
      </div>
    );
  }
  return null;
};

const UserDistributionChart = ({ data, totalActivities }) => {
  return (
    <div className="syslog-analytics-card">
      <h4 className="syslog-analytics-card-title">User Activity Distribution</h4>

      <ResponsiveContainer width="100%" height={190}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="count"
            nameKey="name"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="syslog-dist-legend">
        {data.map((item) => (
          <div className="syslog-dist-legend-item" key={item.name}>
            <div className="syslog-dist-legend-left">
              <span
                className="syslog-dist-dot"
                style={{ background: item.color }}
              />
              <span>{item.name}</span>
            </div>
            <div className="syslog-dist-legend-right">
              <span className="syslog-dist-count">
                {item.count.toLocaleString()}
              </span>
              <span className="syslog-dist-pct">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>

      <div className="syslog-dist-total">
        Total Activities: {totalActivities?.toLocaleString()}
      </div>
    </div>
  );
};

export default UserDistributionChart;
