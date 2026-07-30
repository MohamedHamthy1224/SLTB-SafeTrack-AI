import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import '../../../styles/systemLogs.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '0.55rem 0.85rem',
          boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#0f172a',
        }}
      >
        <div style={{ color: '#64748b', fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div style={{ color: '#0047ff' }}>
          Activities: {payload[0].value.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

const ActivityChart = ({ data }) => {
  return (
    <div className="syslog-analytics-card">
      <h4 className="syslog-analytics-card-title">Activity Logs by Day</h4>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          barCategoryGap="35%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v
            }
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', radius: 4 }} />
          <Legend
            iconType="square"
            iconSize={10}
            wrapperStyle={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', paddingTop: 8 }}
            formatter={() => 'Activities'}
          />
          <Bar
            dataKey="count"
            name="Activities"
            fill="#0047ff"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
