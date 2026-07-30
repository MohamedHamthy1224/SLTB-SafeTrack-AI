import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import '../../styles/uTurnAlerts.css';

const UTurnAlertWeeklyChart = ({ weeklyData }) => {
  const data = weeklyData || [
    { day: 'Mon', alerts: 18 },
    { day: 'Tue', alerts: 22 },
    { day: 'Wed', alerts: 15 },
    { day: 'Thu', alerts: 27 },
    { day: 'Fri', alerts: 20 },
    { day: 'Sat', alerts: 14 },
    { day: 'Sun', alerts: 10 },
  ];

  return (
    <div className="right-widget-card">
      <div className="widget-card-header">
        <h4 className="widget-card-title">Weekly Alert Volume</h4>
        <span className="widget-card-subtitle">Last 7 Days</span>
      </div>
      <ResponsiveContainer width="100%" height={165}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -22, bottom: 0 }} barSize={18}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
            formatter={(value) => [`${value} alerts`, 'U-Turn Alerts']}
          />
          <Bar dataKey="alerts" fill="#A855F7" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UTurnAlertWeeklyChart;
