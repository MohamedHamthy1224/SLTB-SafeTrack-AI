import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import reportService from '../services/reportService';

export const useReports = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'buses';

  // Data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  // Pagination & Sorting states
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');

  // Filter states
  const [filters, setFilters] = useState({});

  // Race condition protection
  const requestIdRef = useRef(0);

  // Set default sort and filters when tab changes
  useEffect(() => {
    setPage(1);
    setError(null);
    setLoading(true);
    setItems([]);
    setSummary(null);

    if (activeTab === 'buses') {
      setSortBy('bus_id');
      setOrder('asc');
      setFilters({ service_type: 'all', depot: 'all', status: 'all' });
    } else if (activeTab === 'routes') {
      setSortBy('route_id');
      setOrder('asc');
      setFilters({ status: 'all' });
    } else if (activeTab === 'drivers') {
      setSortBy('driver_id');
      setOrder('asc');
      setFilters({ gender: 'all', status: 'all', experience_years: 'all' });
    } else if (activeTab === 'assignment-history') {
      setSortBy('assignment_history_id');
      setOrder('asc');
      setFilters({ bus_id: 'all', driver_id: 'all', route_id: 'all' });
    } else if (activeTab === 'sensors-alerts') {
      setSortBy('bus_alert_id');
      setOrder('asc');
      setFilters({ bus_id: 'all' });
    }
  }, [activeTab]);

  // Load filter options when tab changes
  useEffect(() => {
    let isMounted = true;
    const fetchOptions = async () => {
      try {
        let res = null;
        if (activeTab === 'buses') res = await reportService.getBusesOptions();
        else if (activeTab === 'routes') res = await reportService.getRoutesOptions();
        else if (activeTab === 'drivers') res = await reportService.getDriversOptions();
        else if (activeTab === 'sensors-alerts') res = await reportService.getSensorsAlertsOptions();

        if (isMounted && res && res.success) {
          setFilterOptions(res.data || {});
        }
      } catch (err) {
        console.error('Failed to load report filter options:', err);
      }
    };

    fetchOptions();
    return () => { isMounted = false; };
  }, [activeTab]);

  // Fetch report data
  const fetchReport = useCallback(async (isBackground = false) => {
    const currentReqId = ++requestIdRef.current;
    if (!isBackground) setLoading(true);
    setError(null);

    const queryParams = {
      page,
      per_page: perPage,
      sort_by: sortBy,
      order,
      ...filters
    };

    try {
      let res = null;
      if (activeTab === 'buses') res = await reportService.getBusesReport(queryParams);
      else if (activeTab === 'routes') res = await reportService.getRoutesReport(queryParams);
      else if (activeTab === 'drivers') res = await reportService.getDriversReport(queryParams);
      else if (activeTab === 'assignment-history') res = await reportService.getAssignmentHistoryReport(queryParams);
      else if (activeTab === 'sensors-alerts') res = await reportService.getSensorsAlertsReport(queryParams);

      // Race condition check: drop stale out-of-order responses
      if (currentReqId !== requestIdRef.current) return;

      if (res && res.success) {
        const data = res.data;
        setSummary(data.summary || null);
        setItems(data.items || []);
        
        const pg = data.pagination || {};
        setTotalItems(pg.totalItems || 0);
        setTotalPages(pg.totalPages || 1);

        // Auto-adjust page if current page exceeds total pages
        if (pg.totalPages && page > pg.totalPages && pg.totalPages > 0) {
          setPage(pg.totalPages);
        }

        const now = new Date();
        setLastUpdated(now.toLocaleTimeString());
      } else {
        setError('Unable to load report data.');
      }
    } catch (err) {
      if (currentReqId !== requestIdRef.current) return;
      console.error('Report fetch error:', err);
      setError(err?.message || 'Unable to load the requested report at the moment.');
    } finally {
      if (currentReqId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [activeTab, page, perPage, sortBy, order, filters]);

  // Trigger fetch when parameters change
  useEffect(() => {
    fetchReport(false);
  }, [fetchReport]);

  // Tab switcher
  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setSearchParams({ tab: newTab });
  };

  // Filter change handler
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setPage(1);
    if (activeTab === 'buses') {
      setFilters({ service_type: 'all', depot: 'all', status: 'all' });
    } else if (activeTab === 'routes') {
      setFilters({ status: 'all' });
    } else if (activeTab === 'drivers') {
      setFilters({ gender: 'all', status: 'all', experience_years: 'all' });
    } else if (activeTab === 'assignment-history') {
      setFilters({ bus_id: 'all', driver_id: 'all', route_id: 'all' });
    } else if (activeTab === 'sensors-alerts') {
      setFilters({ bus_id: 'all' });
    }
  };

  // Sort handler
  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
    setPage(1);
  };

  // CSV Export handler
  const handleExportCSV = async () => {
    const queryParams = {
      sort_by: sortBy,
      order,
      ...filters
    };

    try {
      let res = null;
      if (activeTab === 'buses') res = await reportService.exportBusesCSV(queryParams);
      else if (activeTab === 'routes') res = await reportService.exportRoutesCSV(queryParams);
      else if (activeTab === 'drivers') res = await reportService.exportDriversCSV(queryParams);
      else if (activeTab === 'assignment-history') res = await reportService.exportAssignmentHistoryCSV(queryParams);
      else if (activeTab === 'sensors-alerts') res = await reportService.exportSensorsAlertsCSV(queryParams);

      const blob = new Blob([res], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `sltb_${activeTab}_report_${new Date().toISOString().slice(0,19).replace(/[-:T]/g, '')}.csv`;

      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export CSV:', err);
      alert('Failed to download report CSV. Please try again.');
    }
  };

  return {
    activeTab,
    handleTabChange,
    loading,
    error,
    summary,
    items,
    filterOptions,
    lastUpdated,
    page,
    setPage,
    perPage,
    setPerPage,
    totalItems,
    totalPages,
    sortBy,
    order,
    handleSort,
    filters,
    handleFilterChange,
    handleResetFilters,
    handleExportCSV,
    refetchActiveReport: () => fetchReport(true)
  };
};

export default useReports;
