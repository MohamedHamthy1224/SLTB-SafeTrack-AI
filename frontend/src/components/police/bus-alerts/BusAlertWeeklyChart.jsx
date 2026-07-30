import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { mockWeeklyAlertsOverview } from '../../../data/busAlertsMockData';
import '../../../styles/bus-alerts.css';

export const BusAlertWeeklyChart = ({ data }) => {
  const chartData = data || mockWeeklyAlertsOverview;

  return (
    <div className="right-widget-card">
      <div className="widget-card-header">
        <h4 className="widget-card-title">Alerts Overview</h4>
        <span className="widget-card-subtitle">(This Week) &nbsp; <strong style={{ color: '#0F172A' }}>Total: 36</strong></span>
      </div>

      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            
            <XAxis 
              dataKey="day" 
              tickLine={false} 
              axisLine={{ stroke: '#E2E8F0' }}
              tick={({ x, y, payload, index }) => {
                const item = chartData[index];
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={10} dy={4} textAnchor="middle" fill="#64748B" fontSize={10} fontWeight={600}>
                      {item.day}
                    </text>
                    <text x={0} y={22} dy={4} textAnchor="middle" fill="#94A3B8" fontSize={9} fontWeight={500}>
                      {item.label}
                    </text>
                  </g>
                );
              }}
            />
            
            <YAxis 
              domain={[0, 12]} 
              ticks={[0, 3, 6, 9, 12]}
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#64748B', fontSize: 10, fontWeight: 600 }}
            />
            
            <Tooltip 
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '6px',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '12px'
              }}
              cursor={{ fill: '#F8FAFC' }}
            />
            
            <Bar dataKey="count" fill="#0047FF" radius={[4, 4, 0, 0]}>
              <LabelList 
                dataKey="count" 
                position="top" 
                style={{ fill: '#0F172A', fontSize: 10, fontWeight: 800 }} 
                dy={-4}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BusAlertWeeklyChart;
