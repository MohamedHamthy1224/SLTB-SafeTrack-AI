import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import BusSummaryCards from '../components/buses/BusSummaryCards';
import BusFilterPanel from '../components/buses/BusFilterPanel';
import BusTable from '../components/buses/BusTable';
import BusPagination from '../components/buses/BusPagination';
import busService from '../services/busService';
import io from 'socket.io-client';

export const BusManagementPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [summary, setSummary] = useState(null);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Applied Filter states (passed to API/filtering)
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    route_id: 'all',
    driver_id: 'all',
    status: 'All Status'
  });

  // Pagination & Sorting states
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('bus_number');
  const [order, setOrder] = useState('asc');

  // Load summary stats and dropdown filter options once
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [sumRes, optRes] = await Promise.all([
          busService.getSummary(),
          busService.getFilterOptions()
        ]);

        if (sumRes.success) setSummary(sumRes.data);
        if (optRes.success) {
          setRoutes(optRes.data.routes || []);
          setDrivers(optRes.data.drivers || []);
        }
      } catch (err) {
        console.error("Error fetching initial bus management data:", err);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch buses table data whenever appliedFilters, page, perPage, or sorting changes
  const fetchBusesData = async () => {
    setLoading(true);
    try {
      const params = {
        search: appliedFilters.search,
        route_id: appliedFilters.route_id,
        driver_id: appliedFilters.driver_id,
        status: appliedFilters.status,
        page,
        per_page: perPage,
        sort_by: sortBy,
        order
      };

      const response = await busService.getBuses(params);
      if (response.success && response.data) {
        setBuses(response.data.items || []);
        if (response.data.pagination) {
          setPage(response.data.pagination.page);
          setTotalPages(response.data.pagination.totalPages);
          setTotalItems(response.data.pagination.totalItems);
        }
      }
    } catch (err) {
      console.error("Error fetching bus fleet:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusesData();
  }, [appliedFilters, page, perPage, sortBy, order]);

  // SocketIO real-time listener for live updates without full page reload
  useEffect(() => {
    const socket = io('http://localhost:5001', {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      socket.emit('join_sltb_admin');
    });

    socket.on('bus_summary_updated', (newSummary) => {
      setSummary(newSummary);
    });

    socket.on('bus_registered', () => {
      fetchBusesData();
    });

    socket.on('bus_updated', () => {
      fetchBusesData();
    });

    socket.on('bus_assignment_updated', () => {
      fetchBusesData();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleApplyFilter = () => {
    setPage(1);
    setAppliedFilters({
      search: searchQuery,
      route_id: selectedRoute,
      driver_id: selectedDriver,
      status: selectedStatus
    });
  };

  const handleResetFilter = () => {
    setSearchQuery('');
    setSelectedRoute('all');
    setSelectedDriver('all');
    setSelectedStatus('All Status');
    setPage(1);
    setAppliedFilters({
      search: '',
      route_id: 'all',
      driver_id: 'all',
      status: 'All Status'
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="dashboard-content bus-management-content">
          {/* Header Row: Title & Add New Bus Button */}
          <div className="page-header-row">
            <div>
              <h1 className="page-title">Bus Management</h1>
              <p className="page-description">
                Manage all registered buses, their routes and assigned drivers.
              </p>
            </div>
            <button
              type="button"
              className="btn-add-new-bus"
              onClick={() => navigate('/sltb/buses/new')}
            >
              <Plus size={18} />
              <span>Add New Bus</span>
            </button>
          </div>

          {/* 1. SUMMARY CARDS */}
          <BusSummaryCards summary={summary} />

          {/* 2. SEARCH AND FILTER PANEL */}
          <BusFilterPanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
            selectedDriver={selectedDriver}
            setSelectedDriver={setSelectedDriver}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            routes={routes}
            drivers={drivers}
            onApplyFilter={handleApplyFilter}
            onResetFilter={handleResetFilter}
          />

          {/* 3. BUS DETAILS TABLE */}
          <div className="section-card bus-table-card">
            <BusTable
              buses={buses}
              loading={loading}
              sortBy={sortBy}
              order={order}
              onSort={handleSort}
            />

            {/* 4. PAGINATION */}
            {!loading && totalItems > 0 && (
              <BusPagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                perPage={perPage}
                onPageChange={(newPage) => setPage(newPage)}
                onPerPageChange={(newPerPage) => {
                  setPerPage(newPerPage);
                  setPage(1);
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusManagementPage;
