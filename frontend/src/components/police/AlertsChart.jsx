import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import '../../styles/police-cards.css';

const defaultChartData = [
  { day: '01 Jun', busAlerts: 28, uturnAlerts: 8 },
  { day: '02 Jun', busAlerts: 32, uturnAlerts: 10 },
  { day: '03 Jun', busAlerts: 45, uturnAlerts: 15 },
  { day: '04 Jun', busAlerts: 52, uturnAlerts: 22 },
  { day: '05 Jun', busAlerts: 41, uturnAlerts: 17 },
  { day: '06 Jun', busAlerts: 29, uturnAlerts: 12 },
  { day: '07 Jun', busAlerts: 36, uturnAlerts: 18 }
];

export const AlertsChart = () => {
  const [selectedWeek, setSelectedWeek] = useState('This Week');

  return (
    <div className="police-chart-card">
      <div className="chart-card-header">
        <div>
          <h3 className="chart-card-title">
            Alerts Overview <span className="chart-card-subtitle">({selectedWeek})</span>
          </h3>
        </div>

        <select 
          className="chart-week-select" 
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
        >
          <option value="This Week">This Week</option>
          <option value="Last Week">Last Week</option>
          <option value="2 Weeks Ago">2 Weeks Ago</option>
        </select>
      </div>

      {/* Custom Legend */}
      <div className="chart-legend-custom">
        <div className="legend-item-custom">
          <span className="legend-dot-custom" style={{ backgroundColor: '#EF4444' }}></span>
          <span>Bus Alerts</span>
        </div>
        <div className="legend-item-custom">
          <span className="legend-dot-custom" style={{ backgroundColor: '#F97316' }}></span>
          <span>U-Turn Alerts</span>
        </div>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={defaultChartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            
            <XAxis 
              dataKey="day" 
              tickLine={false} 
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
              dy={8}
            />
            
            <YAxis 
              domain={[0, 60]} 
              ticks={[0, 10, 20, 30, 40, 50, 60]}
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
              dx={-8}
            />
            
            <Tooltip 
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '8px',
                border: 'none',
                color: '#FFFFFF',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}
              itemStyle={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}
              labelStyle={{ color: '#94A3B8', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}
            />
            
            <Line
              type="monotone"
              dataKey="busAlerts"
              stroke="#EF4444"
              strokeWidth={2.5}
              dot={{ fill: '#EF4444', r: 5, strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 7 }}
            >
              <LabelList 
                dataKey="busAlerts" 
                position="top" 
                style={{ fill: '#0F172A', fontSize: 12, fontWeight: 800 }} 
                dy={-8}
              />
            </Line>

            <Line
              type="monotone"
              dataKey="uturnAlerts"
              stroke="#F97316"
              strokeWidth={2.5}
              dot={{ fill: '#F97316', r: 5, strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 7 }}
            >
              <LabelList 
                dataKey="uturnAlerts" 
                position="top" 
                style={{ fill: '#0F172A', fontSize: 12, fontWeight: 800 }} 
                dy={-8}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AlertsChart;
