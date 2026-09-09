import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import '../../../styles/bus-alerts.css';

export const BusAlertPriorityChart = ({ data }) => {
  const chartData = data && Array.isArray(data) ? data : [];
  const totalAlerts = chartData.reduce((acc, cur) => acc + (Number(cur.value) || 0), 0);

  return (
    <div className="right-widget-card">
      <div className="widget-card-header">
        <h4 className="widget-card-title">Alerts by Priority</h4>
        <span className="widget-card-subtitle">(This Month)</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Doughnut Chart with Center Total Label */}
        <div style={{ width: 140, height: 140, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Total</div>
            <div style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 800 }}>{totalAlerts}</div>
          </div>
        </div>

        {/* Priority Donut Legend List */}
        <div className="priority-legend-list" style={{ flex: 1 }}>
          {chartData.map((item) => (
            <div className="priority-legend-item" key={item.name}>
              <div className="priority-legend-left">
                <span 
                  style={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    backgroundColor: item.color,
                    display: 'inline-block' 
                  }} 
                />
                <span>{item.name}</span>
              </div>
              <span className="priority-legend-val">
                {item.value} <span style={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem' }}>({item.percentage})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusAlertPriorityChart;
