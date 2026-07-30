import React, { useState } from 'react';
import { 
  Bus, 
  User, 
  MapPin, 
  Cpu, 
  CornerUpRight, 
  Network, 
  BellRing, 
  AlertTriangle, 
  ShieldCheck, 
  Users 
} from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import { PoliceStatCard } from '../components/police/PoliceStatCard';
import { PoliceSafetyCard } from '../components/police/PoliceSafetyCard';
import { PoliceUTurnCard } from '../components/police/PoliceUTurnCard';
import { AlertsChart } from '../components/police/AlertsChart';
import '../styles/police-dashboard.css';

export const PoliceDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statsData = [
    { title: 'Total Buses', value: '245', icon: Bus, iconBg: '#EBF3FF', iconColor: '#1D61E7' },
    { title: 'Total Drivers', value: '198', icon: User, iconBg: '#EBF8F2', iconColor: '#10B981' },
    { title: 'Total Routes', value: '68', icon: MapPin, iconBg: '#F5EEFE', iconColor: '#9333EA' },
    { title: 'Bus Devices', value: '42', icon: Cpu, iconBg: '#E6F7F7', iconColor: '#06B6D4' },
    { title: 'U-Turn Devices', value: '18', icon: CornerUpRight, iconBg: '#FFF4E5', iconColor: '#F97316' },
    { title: 'Total Devices', value: '60', icon: Network, iconBg: '#EEF2FF', iconColor: '#4F46E5' },
    { title: 'Bus Alerts', value: '36', icon: BellRing, iconBg: '#FEE2E2', iconColor: '#EF4444' },
    { title: 'U-Turn Alerts', value: '18', icon: AlertTriangle, iconBg: '#FEF3C7', iconColor: '#F59E0B' },
    { title: 'Police Officers', value: '24', icon: ShieldCheck, iconBg: '#E0F2FE', iconColor: '#0284C7' },
    { title: 'SLTB Users', value: '12', icon: Users, iconBg: '#F3E8FF', iconColor: '#7E22CE' }
  ];

  return (
    <div className="police-dashboard-layout">
      {/* Sidebar */}
      <PoliceSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="police-dashboard-main">
        {/* Sticky Header */}
        <PoliceDashboardHeader 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        />

        {/* Dashboard Body Content */}
        <main className="police-dashboard-content">
          {/* Top 10 Statistics Cards Grid */}
          <section className="police-stats-grid">
            {statsData.map((stat) => (
              <PoliceStatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                iconBg={stat.iconBg}
                iconColor={stat.iconColor}
              />
            ))}
          </section>

          {/* Middle Row: Bus Safety Monitor & U-Turn Safety Monitor */}
          <section className="police-monitors-row">
            <PoliceSafetyCard />
            <PoliceUTurnCard />
          </section>

          {/* Bottom Section: Alerts Overview Line Chart */}
          <section>
            <AlertsChart />
          </section>
        </main>
      </div>
    </div>
  );
};

export default PoliceDashboard;
