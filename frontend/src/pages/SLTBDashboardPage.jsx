import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  UserCheck, 
  GitFork, 
  Users, 
  Calendar, 
  Plus, 
  ArrowRight, 
  UserPlus, 
  MapPin 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { dashboardService } from '../services/dashboardService';
import '../styles/dashboard.css';

export const SLTBDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalBuses: 150,
      totalDrivers: 120,
      totalRoutes: 58,
      activeBuses: 42,
      driversOnLeave: 6,
      busesInMaintenance: 5,
      assignedDrivers: 86,
      availableDrivers: 34,
      activeRoutes: 48,
      inactiveRoutes: 10
    },
    recentActivities: [
      { id: 1, type: 'driver', title: 'New driver registered', desc: 'Nimal Perera', time: '10:24 AM' },
      { id: 2, type: 'route', title: 'New route added', desc: 'Route 154 - Colombo to Trincomalee', time: '09:45 AM' },
      { id: 3, type: 'bus', title: 'New bus registered', desc: 'NB - 2568', time: '09:15 AM' },
      { id: 4, type: 'driver', title: 'Driver updated', desc: 'Kasun Jayawardena', time: 'Yesterday' },
      { id: 5, type: 'route', title: 'Route updated', desc: 'Route 112 - Kandy to Matale', time: 'Yesterday' }
    ],
    latestBuses: [
      { bus_number: 'NB - 2568', registration_number: 'WP ND - 2568', route_name: '101 - Colombo to Kandy', driver_name: 'Kasun Jayawardena', status: 'Active', registered_on: 'May 20, 2025' },
      { bus_number: 'NB - 2567', registration_number: 'WP ND - 2567', route_name: '154 - Colombo to Trincomalee', driver_name: 'Nimal Perera', status: 'Active', registered_on: 'May 19, 2025' },
      { bus_number: 'NB - 2566', registration_number: 'WP ND - 2566', route_name: '112 - Kandy to Matale', driver_name: 'Saman Kumara', status: 'Active', registered_on: 'May 18, 2025' },
      { bus_number: 'NB - 2565', registration_number: 'WP ND - 2565', route_name: '176 - Galle to Matara', driver_name: 'Dinesh Fernando', status: 'Maintenance', registered_on: 'May 17, 2025' },
      { bus_number: 'NB - 2564', registration_number: 'WP ND - 2564', route_name: '120 - Negombo to Kurunegala', driver_name: 'Pradeep Silva', status: 'Active', registered_on: 'May 16, 2025' }
    ],
    routeDistribution: [
      { location: 'Colombo', count: 12 },
      { location: 'Kandy', count: 9 },
      { location: 'Galle', count: 8 },
      { location: 'Negombo', count: 7 },
      { location: 'Matara', count: 6 },
      { location: 'Other', count: 5 }
    ]
  });

  useEffect(() => {
    let isMounted = true;
    dashboardService.getDashboardData()
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setDashboardData({
            summary: { ...dashboardData.summary, ...res.data.summary },
            recentActivities: res.data.recentActivities?.length ? res.data.recentActivities : dashboardData.recentActivities,
            latestBuses: res.data.latestBuses?.length ? res.data.latestBuses : dashboardData.latestBuses,
            routeDistribution: res.data.routeDistribution?.length ? res.data.routeDistribution : dashboardData.routeDistribution
          });
        }
      })
      .catch((err) => console.warn('Dashboard data fetch notice:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
  }, []);

  // Pie chart color definitions matching design reference
  const busStatusData = [
    { name: 'Active', value: 70, count: 105, color: '#10b981' },
    { name: 'Maintenance', value: 17, count: 25, color: '#f59e0b' },
    { name: 'Inactive', value: 13, count: 20, color: '#ef4444' }
  ];

  const driverStatusData = [
    { name: 'Active', value: 75, count: 90, color: '#10b981' },
    { name: 'On Leave', value: 15, count: 18, color: '#f59e0b' },
    { name: 'Inactive', value: 10, count: 12, color: '#ef4444' }
  ];

  const s = dashboardData.summary;

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="dashboard-content">
          {/* Top Bar with Date Selector */}
          <div className="content-top-row">
            <div></div>
            <button className="date-filter-btn">
              <Calendar size={16} />
              <span>May 20, 2025</span>
            </button>
          </div>

          {/* 6 Metric Cards Row */}
          <div className="summary-cards-grid">
            <div className="metric-card">
              <div className="metric-card-header">
                <span className="metric-title">Total Buses</span>
                <div className="metric-icon-box" style={{ background: '#eff6ff', color: '#0047ff' }}>
                  <Bus size={20} />
                </div>
              </div>
              <div className="metric-value">{s.totalBuses}</div>
              <div className="metric-subtext">
                42 Active <span className="trend-up">↑ 12%</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-card-header">
                <span className="metric-title">Total Drivers</span>
                <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
                  <UserCheck size={20} />
                </div>
              </div>
              <div className="metric-value">{s.totalDrivers}</div>
              <div className="metric-subtext">
                34 Active <span className="trend-up">↑ 8%</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-card-header">
                <span className="metric-title">Total Routes</span>
                <div className="metric-icon-box" style={{ background: '#f3e8ff', color: '#a855f7' }}>
                  <Users size={20} />
                </div>
              </div>
              <div className="metric-value">{s.totalRoutes}</div>
              <div className="metric-subtext">
                48 Active <span className="trend-up">↑ 5%</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-card-header">
                <span className="metric-title">Active Buses</span>
                <div className="metric-icon-box" style={{ background: '#ffedd5', color: '#f97316' }}>
                  <Bus size={20} />
                </div>
              </div>
              <div className="metric-value">{s.activeBuses}</div>
              <div className="metric-subtext">28% of total</div>
            </div>

            <div className="metric-card">
              <div className="metric-card-header">
                <span className="metric-title">Drivers On Leave</span>
                <div className="metric-icon-box" style={{ background: '#fee2e2', color: '#ef4444' }}>
                  <UserCheck size={20} />
                </div>
              </div>
              <div className="metric-value">{s.driversOnLeave}</div>
              <div className="metric-subtext">3% of total</div>
            </div>

            <div className="metric-card">
              <div className="metric-card-header">
                <span className="metric-title">Buses in Maintenance</span>
                <div className="metric-icon-box" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                  <Bus size={20} />
                </div>
              </div>
              <div className="metric-value">{s.busesInMaintenance}</div>
              <div className="metric-subtext">3% of total</div>
            </div>
          </div>

          {/* Main 2-Column Section */}
          <div className="dashboard-grid-layout">
            {/* Left 2/3 Column */}
            <div className="left-column">
              {/* Bus & Driver Status Donut Charts */}
              <div className="overview-charts-grid">
                <div className="section-card">
                  <div className="section-header">
                    <h3>Bus Status Overview</h3>
                  </div>

                  <div style={{ height: 180, display: 'flex', alignItems: 'center' }}>
                    <ResponsiveContainer width="50%" height="100%">
                      <PieChart>
                        <Pie
                          data={busStatusData}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {busStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                      {busStatusData.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }}></span>
                            {item.name}
                          </span>
                          <strong>{item.count} <span style={{ color: '#94a3b8', fontWeight: 400 }}>{item.value}%</span></strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                    Total Buses: 150
                  </div>
                </div>

                <div className="section-card">
                  <div className="section-header">
                    <h3>Driver Status Overview</h3>
                  </div>

                  <div style={{ height: 180, display: 'flex', alignItems: 'center' }}>
                    <ResponsiveContainer width="50%" height="100%">
                      <PieChart>
                        <Pie
                          data={driverStatusData}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {driverStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                      {driverStatusData.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }}></span>
                            {item.name}
                          </span>
                          <strong>{item.count} <span style={{ color: '#94a3b8', fontWeight: 400 }}>{item.value}%</span></strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                    Total Drivers: 120
                  </div>
                </div>
              </div>

              {/* Fleet Overview Row */}
              <div className="section-card">
                <div className="section-header">
                  <h3>Fleet Overview</h3>
                </div>

                <div className="fleet-overview-grid">
                  <div className="fleet-stat-box">
                    <div style={{ padding: '0.6rem', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6' }}>
                      <Users size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>86</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Assigned Drivers</div>
                      <div style={{ fontSize: '0.675rem', color: '#94a3b8' }}>72% of total</div>
                    </div>
                  </div>

                  <div className="fleet-stat-box">
                    <div style={{ padding: '0.6rem', borderRadius: '8px', background: '#ecfdf5', color: '#10b981' }}>
                      <UserCheck size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>34</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Available Drivers</div>
                      <div style={{ fontSize: '0.675rem', color: '#94a3b8' }}>28% of total</div>
                    </div>
                  </div>

                  <div className="fleet-stat-box">
                    <div style={{ padding: '0.6rem', borderRadius: '8px', background: '#f3e8ff', color: '#a855f7' }}>
                      <GitFork size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>48</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Active Routes</div>
                      <div style={{ fontSize: '0.675rem', color: '#94a3b8' }}>83% of total</div>
                    </div>
                  </div>

                  <div className="fleet-stat-box">
                    <div style={{ padding: '0.6rem', borderRadius: '8px', background: '#fef3c7', color: '#f59e0b' }}>
                      <GitFork size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>10</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Inactive Routes</div>
                      <div style={{ fontSize: '0.675rem', color: '#94a3b8' }}>17% of total</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Registered Buses Table */}
              <div className="section-card">
                <div className="section-header">
                  <h3>Latest Registered Buses</h3>
                  <a href="#view-all" className="view-all-link">View All</a>
                </div>

                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Bus Number</th>
                        <th>Registration Number</th>
                        <th>Route</th>
                        <th>Driver</th>
                        <th>Status</th>
                        <th>Registered On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.latestBuses.map((bus, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Bus size={14} style={{ color: '#64748b' }} />
                              {bus.bus_number}
                            </span>
                          </td>
                          <td>{bus.registration_number}</td>
                          <td>{bus.route_name}</td>
                          <td>{bus.driver_name}</td>
                          <td>
                            <span className={`status-badge ${bus.status.toLowerCase()}`}>
                              {bus.status}
                            </span>
                          </td>
                          <td>{bus.registered_on}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right 1/3 Column */}
            <div className="right-column">
              {/* Recent Activities List */}
              <div className="section-card">
                <div className="section-header">
                  <h3>Recent Activities</h3>
                  <a href="#view-all" className="view-all-link">View All</a>
                </div>

                <div className="activities-list">
                  {dashboardData.recentActivities.map((act, idx) => (
                    <div key={idx} className="activity-item">
                      <div className="activity-icon">
                        {act.type === 'driver' && <UserCheck size={16} />}
                        {act.type === 'route' && <GitFork size={16} />}
                        {act.type === 'bus' && <Bus size={16} />}
                        {!['driver', 'route', 'bus'].includes(act.type) && <Users size={16} />}
                      </div>

                      <div className="activity-details">
                        <h5>{act.title || act.activity}</h5>
                        <p>{act.desc || act.activity}</p>
                      </div>

                      <div className="activity-time">{act.time || act.activity_time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="section-card">
                <div className="section-header">
                  <h3>Quick Actions</h3>
                </div>

                <div className="quick-actions-list">
                  <div className="action-btn-card">
                    <div className="action-left">
                      <div style={{ padding: '0.5rem', background: '#eff6ff', color: '#0047ff', borderRadius: '6px' }}>
                        <Bus size={18} />
                      </div>
                      <div className="action-info">
                        <h4>Register New Bus</h4>
                        <p>Add a new bus to fleet</p>
                      </div>
                    </div>
                    <ArrowRight size={16} style={{ color: '#0047ff' }} />
                  </div>

                  <div className="action-btn-card">
                    <div className="action-left">
                      <div style={{ padding: '0.5rem', background: '#ecfdf5', color: '#10b981', borderRadius: '6px' }}>
                        <UserPlus size={18} />
                      </div>
                      <div className="action-info">
                        <h4>Register New Driver</h4>
                        <p>Add a new driver</p>
                      </div>
                    </div>
                    <ArrowRight size={16} style={{ color: '#10b981' }} />
                  </div>

                  <div className="action-btn-card">
                    <div className="action-left">
                      <div style={{ padding: '0.5rem', background: '#f3e8ff', color: '#a855f7', borderRadius: '6px' }}>
                        <GitFork size={18} />
                      </div>
                      <div className="action-info">
                        <h4>Add New Route</h4>
                        <p>Create a new route</p>
                      </div>
                    </div>
                    <ArrowRight size={16} style={{ color: '#a855f7' }} />
                  </div>
                </div>
              </div>

              {/* Route Distribution Bar Chart */}
              <div className="section-card">
                <div className="section-header">
                  <h3>Route Distribution</h3>
                  <a href="#view-all" className="view-all-link">View All</a>
                </div>

                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.routeDistribution}>
                      <XAxis dataKey="location" tick={{ fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0047ff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                  Total Active Routes: 48
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
