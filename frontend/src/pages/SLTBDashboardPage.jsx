import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bus, 
  MapPin, 
  Users, 
  ArrowRight, 
  RotateCw, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { dashboardService } from '../services/dashboardService';
import { useDashboardSocket } from '../hooks/useDashboardSocket';
import '../styles/dashboard.css';

export const SLTBDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    buses: { total: 0, active: 0, maintenance: 0, inactive: 0 },
    routes: { total: 0, active: 0, inactive: 0 },
    drivers: { total: 0, active: 0, inactive: 0 },
    busesByStatus: [],
    busesByServiceType: [],
    driversByStatus: [],
    busesByFuelType: [],
    topRoutesByDistance: [],
    busesByManufactureYear: [],
    generatedAt: null
  });

  const fetchDashboardData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await dashboardService.getOverview();
      if (res && res.success && res.data) {
        const payload = res.data.overview || res.data;
        setDashboardData({
          buses: payload.buses ?? { total: 0, active: 0, maintenance: 0, inactive: 0 },
          routes: payload.routes ?? { total: 0, active: 0, inactive: 0 },
          drivers: payload.drivers ?? { total: 0, active: 0, inactive: 0 },
          busesByStatus: Array.isArray(payload.busesByStatus) ? payload.busesByStatus : [],
          busesByServiceType: Array.isArray(payload.busesByServiceType) ? payload.busesByServiceType : [],
          driversByStatus: Array.isArray(payload.driversByStatus) ? payload.driversByStatus : [],
          busesByFuelType: Array.isArray(payload.busesByFuelType) ? payload.busesByFuelType : [],
          topRoutesByDistance: Array.isArray(payload.topRoutesByDistance) ? payload.topRoutesByDistance : [],
          busesByManufactureYear: Array.isArray(payload.busesByManufactureYear) ? payload.busesByManufactureYear : [],
          generatedAt: payload.generatedAt || null
        });
      } else {
        setError(res?.message || 'Unable to load dashboard information.');
      }
    } catch (err) {
      console.error('[SLTBDashboardPage] fetch error:', err);
      setError(err?.response?.data?.message || err?.message || 'Unable to connect to server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Subscribe to real-time socket updates with debounced refetch
  useDashboardSocket(useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]));

  const formatTimestamp = (ts) => {
    if (!ts) return 'Not Available';
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return ts;
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ', ' + d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return ts;
    }
  };

  // Color mappings
  const busStatusColors = {
    'Active': '#10b981',
    'Maintenance': '#f59e0b',
    'Inactive': '#ef4444'
  };

  const driverStatusColors = {
    'Active': '#10b981',
    'Inactive': '#ef4444'
  };

  const serviceTypePalette = [
    '#0047ff', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4',
    '#ec4899', '#f97316', '#64748b', '#3b82f6', '#14b8a6'
  ];

  // Guaranteed safe data extractions
  const buses = dashboardData?.buses ?? { total: 0, active: 0, maintenance: 0, inactive: 0 };
  const routes = dashboardData?.routes ?? { total: 0, active: 0, inactive: 0 };
  const drivers = dashboardData?.drivers ?? { total: 0, active: 0, inactive: 0 };

  const busesByStatus = Array.isArray(dashboardData?.busesByStatus) ? dashboardData.busesByStatus : [];
  const busesByServiceType = Array.isArray(dashboardData?.busesByServiceType) ? dashboardData.busesByServiceType : [];
  const driversByStatus = Array.isArray(dashboardData?.driversByStatus) ? dashboardData.driversByStatus : [];
  const busesByFuelType = Array.isArray(dashboardData?.busesByFuelType) ? dashboardData.busesByFuelType : [];
  const topRoutesByDistance = Array.isArray(dashboardData?.topRoutesByDistance) ? dashboardData.topRoutesByDistance : [];
  const busesByManufactureYear = Array.isArray(dashboardData?.busesByManufactureYear) ? dashboardData.busesByManufactureYear : [];

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} subtitle="Overview of buses, routes and drivers." />

        <div className="dashboard-content">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: '#64748b' }}>
              <Loader2 size={36} className="spinner" style={{ marginBottom: '0.75rem' }} />
              <p>Loading dashboard metrics from database...</p>
            </div>
          ) : error ? (
            <div className="section-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#ef4444' }}>
              <AlertCircle size={40} style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dashboard Error</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.25rem' }}>{error}</p>
              <button 
                onClick={() => fetchDashboardData(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1.25rem',
                  background: '#0240bf',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <RotateCw size={16} className={refreshing ? 'spinner' : ''} />
                <span>Retry Loading</span>
              </button>
            </div>
          ) : (
            <>
              {/* TOP ROW: 3 SUMMARY CARDS */}
              <div className="summary-cards-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {/* Total Buses Card */}
                <div className="metric-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div className="metric-icon-box" style={{ background: '#eff6ff', color: '#0240bf', width: 44, height: 44, borderRadius: 10 }}>
                        <Bus size={22} />
                      </div>
                      <div>
                        <span className="metric-title" style={{ fontSize: '0.85rem' }}>Total Buses</span>
                        <div className="metric-value" style={{ fontSize: '2rem', lineHeight: 1.1 }}>{buses.total}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.775rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#475569' }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} /> Active
                        </span>
                        <strong style={{ color: '#0f172a' }}>{buses.active}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#475569' }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b' }} /> Maintenance
                        </span>
                        <strong style={{ color: '#0f172a' }}>{buses.maintenance}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#475569' }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} /> Inactive
                        </span>
                        <strong style={{ color: '#0f172a' }}>{buses.inactive}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '1rem', paddingTop: '0.65rem' }}>
                    <Link to="/sltb/buses" className="view-all-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>View Buses</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Total Routes Card */}
                <div className="metric-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#10b981', width: 44, height: 44, borderRadius: 10 }}>
                        <MapPin size={22} />
                      </div>
                      <div>
                        <span className="metric-title" style={{ fontSize: '0.85rem' }}>Total Routes</span>
                        <div className="metric-value" style={{ fontSize: '2rem', lineHeight: 1.1 }}>{routes.total}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.775rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#475569' }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} /> Active
                        </span>
                        <strong style={{ color: '#0f172a' }}>{routes.active}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#475569' }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} /> Inactive
                        </span>
                        <strong style={{ color: '#0f172a' }}>{routes.inactive}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '1rem', paddingTop: '0.65rem' }}>
                    <Link to="/sltb/routes" className="view-all-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>View Routes</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Total Drivers Card */}
                <div className="metric-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div className="metric-icon-box" style={{ background: '#f3e8ff', color: '#8b5cf6', width: 44, height: 44, borderRadius: 10 }}>
                        <Users size={22} />
                      </div>
                      <div>
                        <span className="metric-title" style={{ fontSize: '0.85rem' }}>Total Drivers</span>
                        <div className="metric-value" style={{ fontSize: '2rem', lineHeight: 1.1 }}>{drivers.total}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.775rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#475569' }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} /> Active
                        </span>
                        <strong style={{ color: '#0f172a' }}>{drivers.active}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#475569' }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} /> Inactive
                        </span>
                        <strong style={{ color: '#0f172a' }}>{drivers.inactive}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '1rem', paddingTop: '0.65rem' }}>
                    <Link to="/sltb/drivers" className="view-all-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>View Drivers</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* SECOND ROW: 3 DONUT CHART CARDS */}
              <div className="overview-charts-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {/* Buses by Status */}
                <div className="section-card">
                  <div className="section-header">
                    <h3>Buses by Status</h3>
                  </div>

                  <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {busesByStatus.length > 0 ? (
                      <>
                        <ResponsiveContainer width="45%" height="100%">
                          <PieChart>
                            <Pie
                              data={busesByStatus}
                              innerRadius={45}
                              outerRadius={68}
                              paddingAngle={3}
                              dataKey="count"
                            >
                              {busesByStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={busStatusColors[entry.status] || '#94a3b8'} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>

                        <div style={{ width: '52%', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.785rem' }}>
                          {busesByStatus.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569' }}>
                                <span style={{ width: 9, height: 9, borderRadius: '50%', background: busStatusColors[item.status] || '#94a3b8' }}></span>
                                {item.status}
                              </span>
                              <strong style={{ color: '#0f172a' }}>{item.count} <span style={{ color: '#64748b', fontWeight: 400 }}>({item.percentage}%)</span></strong>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div style={{ width: '100%', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>No bus status data available</div>
                    )}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                    Total: {buses.total}
                  </div>
                </div>

                {/* Buses by Service Type */}
                <div className="section-card">
                  <div className="section-header">
                    <h3>Buses by Service Type</h3>
                  </div>

                  <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {busesByServiceType.length > 0 ? (
                      <>
                        <ResponsiveContainer width="45%" height="100%">
                          <PieChart>
                            <Pie
                              data={busesByServiceType}
                              innerRadius={45}
                              outerRadius={68}
                              paddingAngle={2}
                              dataKey="count"
                            >
                              {busesByServiceType.map((entry, index) => (
                                <Cell key={`st-cell-${index}`} fill={serviceTypePalette[index % serviceTypePalette.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>

                        <div style={{ width: '52%', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.725rem', maxHeight: 170, overflowY: 'auto' }}>
                          {busesByServiceType.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: serviceTypePalette[idx % serviceTypePalette.length], flexShrink: 0 }}></span>
                                {item.serviceType}
                              </span>
                              <strong style={{ color: '#0f172a', marginLeft: '0.25rem' }}>{item.count} <span style={{ color: '#64748b', fontWeight: 400 }}>({item.percentage}%)</span></strong>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div style={{ width: '100%', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>No service type data available</div>
                    )}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                    Total: {buses.total}
                  </div>
                </div>

                {/* Drivers by Status */}
                <div className="section-card">
                  <div className="section-header">
                    <h3>Drivers by Status</h3>
                  </div>

                  <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {driversByStatus.length > 0 ? (
                      <>
                        <ResponsiveContainer width="45%" height="100%">
                          <PieChart>
                            <Pie
                              data={driversByStatus}
                              innerRadius={45}
                              outerRadius={68}
                              paddingAngle={3}
                              dataKey="count"
                            >
                              {driversByStatus.map((entry, index) => (
                                <Cell key={`drv-cell-${index}`} fill={driverStatusColors[entry.status] || '#94a3b8'} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>

                        <div style={{ width: '52%', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.785rem' }}>
                          {driversByStatus.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569' }}>
                                <span style={{ width: 9, height: 9, borderRadius: '50%', background: driverStatusColors[item.status] || '#94a3b8' }}></span>
                                {item.status}
                              </span>
                              <strong style={{ color: '#0f172a' }}>{item.count} <span style={{ color: '#64748b', fontWeight: 400 }}>({item.percentage}%)</span></strong>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div style={{ width: '100%', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>No driver status data available</div>
                    )}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                    Total: {drivers.total}
                  </div>
                </div>
              </div>

              {/* THIRD ROW: 3 ANALYTICAL CARDS */}
              <div className="overview-charts-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {/* Buses by Fuel Type */}
                <div className="section-card">
                  <div className="section-header">
                    <h3>Buses by Fuel Type</h3>
                  </div>

                  <div className="table-container" style={{ marginTop: '0.5rem' }}>
                    <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                      <thead>
                        <tr>
                          <th style={{ background: '#transparent' }}>Fuel Type</th>
                          <th style={{ background: '#transparent', textAlign: 'right' }}>Count</th>
                          <th style={{ background: '#transparent' }}>Progress</th>
                          <th style={{ background: '#transparent', textAlign: 'right' }}>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {busesByFuelType.length > 0 ? (
                          busesByFuelType.map((item, idx) => (
                            <tr key={idx}>
                              <td style={{ fontWeight: 600, color: '#334155' }}>{item.fuelType}</td>
                              <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>{item.count}</td>
                              <td style={{ width: '35%' }}>
                                <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                                  <div 
                                    style={{ 
                                      width: `${Math.min(100, Math.max(0, item.percentage))}%`, 
                                      height: '100%', 
                                      background: '#0240bf',
                                      borderRadius: 999
                                    }} 
                                  />
                                </div>
                              </td>
                              <td style={{ textAlign: 'right', color: '#64748b' }}>{item.percentage}%</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8' }}>No fuel type data</td>
                          </tr>
                        )}
                        <tr style={{ borderTop: '2px solid #e2e8f0', fontWeight: 700 }}>
                          <td>Total</td>
                          <td style={{ textAlign: 'right' }}>{buses.total}</td>
                          <td></td>
                          <td style={{ textAlign: 'right' }}>100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top 5 Routes by Distance */}
                <div className="section-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div className="section-header">
                      <h3>Top 5 Routes by Distance</h3>
                    </div>

                    <div className="table-container" style={{ marginTop: '0.5rem' }}>
                      <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                        <thead>
                          <tr>
                            <th style={{ background: '#transparent' }}>Route Number</th>
                            <th style={{ background: '#transparent' }}>Route Name</th>
                            <th style={{ background: '#transparent', textAlign: 'right' }}>Distance (km)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topRoutesByDistance.length > 0 ? (
                            topRoutesByDistance.map((rt, idx) => (
                              <tr key={idx}>
                                <td style={{ fontWeight: 700, color: '#0240bf' }}>{rt.route_number}</td>
                                <td>{rt.route_name}</td>
                                <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>{Number(rt.distance_km || 0).toFixed(2)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" style={{ textAlign: 'center', color: '#94a3b8' }}>No route distance data available.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '1rem', paddingTop: '0.65rem' }}>
                    <Link to="/sltb/routes" className="view-all-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>View All Routes</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Buses by Manufacture Year */}
                <div className="section-card">
                  <div className="section-header">
                    <h3>Buses by Manufacture Year</h3>
                  </div>

                  <div style={{ height: 190, marginTop: '0.5rem' }}>
                    {busesByManufactureYear.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={busesByManufactureYear} margin={{ top: 18, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="year_range" tick={{ fontSize: 10, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                          <Tooltip 
                            formatter={(value) => [`${value} Buses`, 'Count']}
                            contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem' }}
                          />
                          <Bar dataKey="count" fill="#0240bf" radius={[4, 4, 0, 0]}>
                            {busesByManufactureYear.map((entry, index) => (
                              <Cell key={`bar-cell-${index}`} fill="#0240bf" />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '0.85rem' }}>
                        No manufacture year data available
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                    Total: {buses.total}
                  </div>
                </div>
              </div>

              {/* BOTTOM INFORMATION BAR */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '0.85rem 1.25rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                marginTop: '0.5rem'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Showing summary of data from buses, routes and drivers.
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: '#475569' }}>
                  <span>Last updated: <strong>{formatTimestamp(dashboardData.generatedAt)}</strong></span>
                  <button 
                    onClick={() => fetchDashboardData(true)}
                    disabled={refreshing}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '0.35rem 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      color: '#334155'
                    }}
                    aria-label="Refresh Dashboard Data"
                  >
                    <RotateCw size={14} className={refreshing ? 'spinner' : ''} />
                    <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SLTBDashboardPage;
