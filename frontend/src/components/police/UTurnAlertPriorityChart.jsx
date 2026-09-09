import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import '../../styles/uTurnAlerts.css';

const COLORS = {
  High: '#EF4444',
  Medium: '#F97316',
  Low: '#10B981',
};

const LEGEND_BG = {
  High: '#FEF2F2',
  Medium: '#FFF7ED',
  Low: '#F0FDF4',
};

const UTurnAlertPriorityChart = ({ distribution = [] }) => {
  const data = distribution && distribution.length > 0 ? distribution : [
    { name: 'High', value: 0 },
    { name: 'Medium', value: 0 },
    { name: 'Low', value: 0 },
  ];

  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);

  // If all 0, provide neutral slice for visual ring
  const chartData = total > 0 ? data : [{ name: 'None', value: 1, color: '#e2e8f0' }];

  return (
    <div className="right-widget-card">
      <div className="widget-card-header">
        <h4 className="widget-card-title">Priority Distribution</h4>
        <span className="widget-card-subtitle">Total: {total}</span>
      </div>

      <ResponsiveContainer width="100%" height={170}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={78}
            paddingAngle={total > 0 ? 3 : 0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {chartData.map((entry, index) => {
              const fillColor = entry.color || COLORS[entry.name] || '#cbd5e1';
              return <Cell key={`cell-${index}`} fill={fillColor} />;
            })}
          </Pie>
          {total > 0 && (
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
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* Center label overlay */}
      <div style={{ textAlign: 'center', marginTop: '-1rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{total}</div>
        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Total Alerts</div>
      </div>

      <div className="priority-legend-list">
        {data.map((d) => {
          const color = COLORS[d.name] || '#64748b';
          const bg = LEGEND_BG[d.name] || '#f8fafc';
          const pct = total > 0 ? Math.round(((d.value || 0) / total) * 100) : 0;

          return (
            <div className="priority-legend-item" key={d.name}>
              <div className="priority-legend-left">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: color,
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
                    background: bg,
                    color: color,
                    border: `1px solid ${color}33`,
                    fontSize: '0.7rem',
                  }}
                >
                  {d.value || 0}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600 }}>
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UTurnAlertPriorityChart;
