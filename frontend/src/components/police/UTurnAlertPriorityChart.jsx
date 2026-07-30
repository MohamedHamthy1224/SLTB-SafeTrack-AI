import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import '../../styles/uTurnAlerts.css';

const COLORS = ['#EF4444', '#F97316', '#10B981'];
const LABELS = ['High', 'Medium', 'Low'];

const UTurnAlertPriorityChart = ({ distribution }) => {
  const data = distribution || [
    { name: 'High', value: 54 },
    { name: 'Medium', value: 42 },
    { name: 'Low', value: 30 },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const legendColors = {
    High: '#EF4444',
    Medium: '#F97316',
    Low: '#10B981',
  };

  const legendBg = {
    High: '#FEF2F2',
    Medium: '#FFF7ED',
    Low: '#F0FDF4',
  };

  return (
    <div className="right-widget-card">
      <div className="widget-card-header">
        <h4 className="widget-card-title">Priority Distribution</h4>
        <span className="widget-card-subtitle">Total: {total}</span>
      </div>

      <ResponsiveContainer width="100%" height={170}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={78}
            paddingAngle={3}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} alerts`, name]}
            contentStyle={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label overlay */}
      <div style={{ textAlign: 'center', marginTop: '-1rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{total}</div>
        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Total Alerts</div>
      </div>

      <div className="priority-legend-list">
        {data.map((d) => (
          <div className="priority-legend-item" key={d.name}>
            <div className="priority-legend-left">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: legendColors[d.name],
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span style={{ color: '#334155', fontWeight: 700, fontSize: '0.8rem' }}>{d.name} Risk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span
                className="priority-badge"
                style={{
                  background: legendBg[d.name],
                  color: legendColors[d.name],
                  border: `1px solid ${legendColors[d.name]}33`,
                  fontSize: '0.7rem',
                }}
              >
                {d.value}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600 }}>
                {Math.round((d.value / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UTurnAlertPriorityChart;
