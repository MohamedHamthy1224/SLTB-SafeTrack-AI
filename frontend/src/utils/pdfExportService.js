import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * SLTB SafeTrack AI - Professional Report PDF Export Service
 * Generates branded, multi-page, landscape A4 PDF reports for SLTB operations.
 * Mathematically engineered to fit within A4 landscape printable margins (297mm x 210mm)
 * with zero horizontal overflow, zero column clipping, and natural text wrapping.
 */

// Helper to format date & time nicely
const formatDateTime = (date = new Date()) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

const formatDateOnly = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Format filter label-values for display in the PDF header box
 */
const formatActiveFilters = (tab, filters = {}) => {
  const filterEntries = [];

  if (tab === 'buses') {
    if (filters.service_type && filters.service_type !== 'all') {
      filterEntries.push(`Service Type: ${filters.service_type}`);
    }
    if (filters.depot && filters.depot !== 'all') {
      filterEntries.push(`Depot: ${filters.depot}`);
    }
    if (filters.status && filters.status !== 'all') {
      filterEntries.push(`Status: ${filters.status}`);
    }
  } else if (tab === 'routes') {
    if (filters.status && filters.status !== 'all') {
      filterEntries.push(`Status: ${filters.status}`);
    }
  } else if (tab === 'drivers') {
    if (filters.gender && filters.gender !== 'all') {
      filterEntries.push(`Gender: ${filters.gender}`);
    }
    if (filters.status && filters.status !== 'all') {
      filterEntries.push(`Status: ${filters.status}`);
    }
    if (filters.experience_years && filters.experience_years !== 'all') {
      filterEntries.push(`Experience: ${filters.experience_years} Years`);
    }
  } else if (tab === 'assignment-history') {
    if (filters.bus_id && filters.bus_id !== 'all') {
      filterEntries.push(`Bus ID: BUS-${String(filters.bus_id).padStart(4, '0')}`);
    }
    if (filters.driver_id && filters.driver_id !== 'all') {
      filterEntries.push(`Driver ID: DRV-${String(filters.driver_id).padStart(4, '0')}`);
    }
    if (filters.route_id && filters.route_id !== 'all') {
      filterEntries.push(`Route ID: ROU-${String(filters.route_id).padStart(4, '0')}`);
    }
  } else if (tab === 'sensors-alerts') {
    if (filters.bus_id && filters.bus_id !== 'all') {
      filterEntries.push(`Bus ID: BUS-${String(filters.bus_id).padStart(4, '0')}`);
    }
  }

  if (filterEntries.length === 0) {
    return 'All Records (No active filter constraints)';
  }

  return filterEntries.join('   |   ');
};

/**
 * Configure columns, headers, row data, and fitted column styles per report type
 */
const getReportConfig = (tab, items = [], summary = {}) => {
  const currentDate = formatDateOnly();

  switch (tab) {
    case 'buses': {
      const title = 'Bus Fleet Operational Report';
      const filename = `SLTB_Buses_Report_${currentDate}.pdf`;
      const summaryText = `Total Buses: ${summary.totalBuses ?? items.length}   |   Active: ${summary.activeBuses ?? 0}   |   Maintenance: ${summary.maintenanceBuses ?? 0}   |   Inactive: ${summary.inactiveBuses ?? 0}`;

      const headers = [
        '#',
        'Bus ID',
        'Reg No',
        'Bus No',
        'Service Type',
        'Depot',
        'Model',
        'Chassis No',
        'Engine No',
        'Cap.',
        'Stnd.',
        'Fuel',
        'Year',
        'Status',
        'Created At'
      ];

      const rows = items.map((b, idx) => [
        idx + 1,
        b.bus_id ? `BUS-${String(b.bus_id).padStart(4, '0')}` : '—',
        b.registration_number || '—',
        b.bus_number || '—',
        b.service_type || '—',
        b.depot || '—',
        b.model || '—',
        b.chassis_number || '—',
        b.engine_number || '—',
        b.capacity ?? '—',
        b.standing_capacity ?? '—',
        b.fuel_type || '—',
        b.manufacture_year || '—',
        b.status || '—',
        b.created_at || '—'
      ]);

      // Total sum = 265mm <= usableWidth (277mm in 297mm landscape page with 10mm margins)
      const columnStyles = {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 17, halign: 'center', fontStyle: 'bold' },
        2: { cellWidth: 17 },
        3: { cellWidth: 17 },
        4: { cellWidth: 22 },
        5: { cellWidth: 28 },
        6: { cellWidth: 22 },
        7: { cellWidth: 22 },
        8: { cellWidth: 22 },
        9: { cellWidth: 11, halign: 'center' },
        10: { cellWidth: 11, halign: 'center' },
        11: { cellWidth: 14 },
        12: { cellWidth: 12, halign: 'center' },
        13: { cellWidth: 18, halign: 'center' },
        14: { cellWidth: 24, halign: 'center' }
      };

      return { title, filename, summaryText, headers, rows, columnStyles, fontSize: 7, cellPadding: 1.2 };
    }

    case 'routes': {
      const title = 'Route Master Operational Report';
      const filename = `SLTB_Routes_Report_${currentDate}.pdf`;
      const distanceFormatted = summary.totalDistanceKm != null ? Number(summary.totalDistanceKm).toFixed(2) : '0.00';
      const summaryText = `Total Routes: ${summary.totalRoutes ?? items.length}   |   Active: ${summary.activeRoutes ?? 0}   |   Inactive: ${summary.inactiveRoutes ?? 0}   |   Total Distance: ${distanceFormatted} km`;

      const headers = [
        '#',
        'Route No',
        'Route Name',
        'Start Location',
        'End Location',
        'Distance (km)',
        'Duration (min)',
        'Status',
        'Created At'
      ];

      const rows = items.map((r, idx) => [
        idx + 1,
        r.route_number || '—',
        r.route_name || '—',
        r.start_location || '—',
        r.end_location || '—',
        r.distance_km != null ? Number(r.distance_km).toFixed(2) : '—',
        r.estimated_duration ?? '—',
        r.status || '—',
        r.created_at || '—'
      ]);

      // Total sum = 267mm <= usableWidth (277mm)
      const columnStyles = {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
        2: { cellWidth: 55 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        5: { cellWidth: 26, halign: 'right' },
        6: { cellWidth: 24, halign: 'center' },
        7: { cellWidth: 20, halign: 'center' },
        8: { cellWidth: 30, halign: 'center' }
      };

      return { title, filename, summaryText, headers, rows, columnStyles, fontSize: 7.5, cellPadding: 1.8 };
    }

    case 'drivers': {
      const title = 'Driver Operational & Compliance Report';
      const filename = `SLTB_Drivers_Report_${currentDate}.pdf`;
      const summaryText = `Total Drivers: ${summary.totalDrivers ?? items.length}   |   Active: ${summary.activeDrivers ?? 0}   |   Inactive: ${summary.inactiveDrivers ?? 0}`;

      const headers = [
        '#',
        'Driver ID',
        'Full Name',
        'DOB',
        'Gender',
        'NIC',
        'License No',
        'Issue Date',
        'Expiry Date',
        'Exp (Yrs)',
        'Phone',
        'Email',
        'Join Date',
        'Status',
        'Created At'
      ];

      const rows = items.map((d, idx) => [
        idx + 1,
        d.driver_id ? `DRV-${String(d.driver_id).padStart(4, '0')}` : '—',
        d.full_name || '—',
        d.date_of_birth || '—',
        d.gender || '—',
        d.nic || '—',
        d.license_number || '—',
        d.issue_date || '—',
        d.expiry_date || '—',
        d.experience_years ?? '—',
        d.phone || '—',
        d.email_address || '—',
        d.join_date || '—',
        d.status || '—',
        d.created_at || '—'
      ]);

      // Total sum = 267mm <= usableWidth (277mm)
      const columnStyles = {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 17, halign: 'center', fontStyle: 'bold' },
        2: { cellWidth: 25 },
        3: { cellWidth: 17, halign: 'center' },
        4: { cellWidth: 13, halign: 'center' },
        5: { cellWidth: 21 },
        6: { cellWidth: 20 },
        7: { cellWidth: 17, halign: 'center' },
        8: { cellWidth: 17, halign: 'center' },
        9: { cellWidth: 13, halign: 'center' },
        10: { cellWidth: 20 },
        11: { cellWidth: 26 },
        12: { cellWidth: 17, halign: 'center' },
        13: { cellWidth: 16, halign: 'center' },
        14: { cellWidth: 20, halign: 'center' }
      };

      return { title, filename, summaryText, headers, rows, columnStyles, fontSize: 7, cellPadding: 1.2 };
    }

    case 'assignment-history': {
      const title = 'Bus, Route & Driver Assignment History Report';
      const filename = `SLTB_Assignment_History_Report_${currentDate}.pdf`;
      const summaryText = `Total Assignments: ${summary.totalAssignments ?? items.length}   |   Active Assignments: ${summary.activeAssignments ?? 0}`;

      const headers = [
        '#',
        'Assignment ID',
        'Bus ID',
        'Driver ID',
        'Route ID',
        'Start Date Time',
        'End Date Time',
        'Assigned By'
      ];

      const rows = items.map((a, idx) => [
        idx + 1,
        a.assignment_history_id ? `AH-${String(a.assignment_history_id).padStart(4, '0')}` : '—',
        a.bus_id ? `BUS-${String(a.bus_id).padStart(4, '0')}` : '—',
        a.driver_id ? `DRV-${String(a.driver_id).padStart(4, '0')}` : '—',
        a.route_id ? `ROU-${String(a.route_id).padStart(4, '0')}` : '—',
        a.start_datetime || '—',
        a.end_datetime || 'Ongoing',
        a.assigned_by ? `ADMIN-${String(a.assigned_by).padStart(3, '0')}` : 'SYSTEM'
      ]);

      // Total sum = 262mm <= usableWidth (277mm)
      const columnStyles = {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 32, halign: 'center', fontStyle: 'bold' },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 30, halign: 'center' },
        4: { cellWidth: 30, halign: 'center' },
        5: { cellWidth: 45, halign: 'center' },
        6: { cellWidth: 45, halign: 'center' },
        7: { cellWidth: 38, halign: 'center' }
      };

      return { title, filename, summaryText, headers, rows, columnStyles, fontSize: 8, cellPadding: 2 };
    }

    case 'sensors-alerts': {
      const title = 'IoT Sensors & Safety Alerts Report';
      const filename = `SLTB_Sensors_and_Alerts_Report_${currentDate}.pdf`;
      const summaryText = `Total Safety Alerts Recorded: ${summary.totalAlerts ?? items.length}`;

      const headers = [
        '#',
        'Alert ID',
        'Bus ID',
        'Device ID',
        'Assignment ID',
        'Sensor Data ID',
        'Alert Timestamp'
      ];

      const rows = items.map((al, idx) => [
        idx + 1,
        al.bus_alert_id ? `BA-${String(al.bus_alert_id).padStart(4, '0')}` : '—',
        al.bus_id ? `BUS-${String(al.bus_id).padStart(4, '0')}` : '—',
        al.device_id ? `DEV-${String(al.device_id).padStart(4, '0')}` : '—',
        al.assignment_id ? `ASN-${String(al.assignment_id).padStart(4, '0')}` : '—',
        al.sensor_data_id ? `SD-${String(al.sensor_data_id).padStart(4, '0')}` : '—',
        al.alert_time || '—'
      ]);

      // Total sum = 263mm <= usableWidth (277mm)
      const columnStyles = {
        0: { cellWidth: 14, halign: 'center' },
        1: { cellWidth: 38, halign: 'center', fontStyle: 'bold' },
        2: { cellWidth: 35, halign: 'center' },
        3: { cellWidth: 35, halign: 'center' },
        4: { cellWidth: 38, halign: 'center' },
        5: { cellWidth: 38, halign: 'center' },
        6: { cellWidth: 65, halign: 'center' }
      };

      return { title, filename, summaryText, headers, rows, columnStyles, fontSize: 8, cellPadding: 2 };
    }

    default:
      return {
        title: 'SLTB Operational Report',
        filename: `SLTB_Report_${currentDate}.pdf`,
        summaryText: `Total Records: ${items.length}`,
        headers: ['#', 'Details'],
        rows: items.map((it, idx) => [idx + 1, JSON.stringify(it)]),
        columnStyles: {},
        fontSize: 7.5,
        cellPadding: 1.5
      };
  }
};

/**
 * Main PDF Export Generator Function
 *
 * @param {Object} options
 * @param {string} options.tab - Active report tab ('buses'|'routes'|'drivers'|'assignment-history'|'sensors-alerts')
 * @param {Array} options.items - All filtered report records
 * @param {Object} options.summary - Summary metrics object from backend
 * @param {Object} options.filters - Current active filters
 * @param {Object} options.currentUser - Logged-in user information
 */
export const generateReportPDF = ({
  tab,
  items = [],
  summary = {},
  filters = {},
  currentUser = {}
}) => {
  // 1. Create Landscape A4 Document (297mm x 210mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm
  const marginX = 10; // 10mm left and right margin -> 277mm usable width
  const generatedTime = formatDateTime(new Date());
  const userName = currentUser?.fullName || currentUser?.full_name || currentUser?.username || 'SLTB Operations Admin';
  const roleName = currentUser?.role || 'SLTB Admin';

  const { title, filename, summaryText, headers, rows, columnStyles, fontSize, cellPadding } = getReportConfig(tab, items, summary);
  const activeFilterText = formatActiveFilters(tab, filters);

  // 2. Draw Branded Header & Metadata on First Page
  // Header Top Bar
  doc.setFillColor(0, 71, 255); // SLTB Primary Blue #0047ff
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Brand Name & Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text('SRI LANKA TRANSPORT BOARD', marginX, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('SafeTrack AI — Operational Management & Safety System', marginX, 19);

  // Report Title Badge (Left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(0, 71, 255);
  doc.text(title.toUpperCase(), marginX, 26);

  // Generation Metadata (Right Aligned)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Generated: ${generatedTime}`, pageWidth - marginX, 14, { align: 'right' });
  doc.text(`Generated By: ${userName} (${roleName})`, pageWidth - marginX, 19, { align: 'right' });
  doc.text(`Total Records: ${items.length}`, pageWidth - marginX, 24, { align: 'right' });

  // Divider Line
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.4);
  doc.line(marginX, 29, pageWidth - marginX, 29);

  // Active Filters & Summary Meta Box
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.roundedRect(marginX, 31, pageWidth - (marginX * 2), 14, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(30, 41, 59);
  doc.text('Active Filters:', marginX + 3, 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);
  doc.text(activeFilterText, marginX + 24, 36);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(30, 41, 59);
  doc.text('Summary Stats:', marginX + 3, 41.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(0, 71, 255);
  doc.text(summaryText, marginX + 26, 41.5);

  // 3. Render Data Table via autoTable with Multi-Page support
  const tableData = rows.length > 0 ? rows : [
    [{ content: 'No records found matching the specified filter criteria.', colSpan: headers.length, styles: { halign: 'center', textColor: [148, 163, 184], fontStyle: 'italic', cellPadding: 8 } }]
  ];

  autoTable(doc, {
    startY: 48,
    head: [headers],
    body: tableData,
    theme: 'grid',
    showHead: 'everyPage',
    margin: { top: 18, bottom: 16, left: marginX, right: marginX },
    styles: {
      font: 'helvetica',
      fontSize: fontSize || 7,
      cellPadding: cellPadding || 1.2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      overflow: 'linebreak',
      valign: 'middle'
    },
    headStyles: {
      fillColor: [30, 41, 59], // Slate 800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: (fontSize || 7) + 0.3,
      halign: 'left',
      valign: 'middle',
      overflow: 'linebreak'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // Slate 50
    },
    columnStyles: columnStyles,
    didParseCell: (data) => {
      // Color-code status cell text
      if (data.section === 'body' && (tab === 'buses' || tab === 'routes' || tab === 'drivers')) {
        const val = String(data.cell.raw || '').toLowerCase();
        if (val === 'active') {
          data.cell.styles.textColor = [22, 163, 74]; // Green
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'maintenance') {
          data.cell.styles.textColor = [217, 119, 6]; // Amber
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'inactive') {
          data.cell.styles.textColor = [220, 38, 38]; // Red
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
    didDrawPage: (data) => {
      // If it's page 2 or later, add a compact top header
      if (data.pageNumber > 1) {
        doc.setFillColor(0, 71, 255);
        doc.rect(0, 0, pageWidth, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(`SRI LANKA TRANSPORT BOARD — ${title.toUpperCase()} (Continued)`, marginX, 9);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text(`Generated: ${generatedTime}`, pageWidth - marginX, 9, { align: 'right' });

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(marginX, 12, pageWidth - marginX, 12);
      }
    }
  });

  // 4. Second Pass: Add Page Numbers & Footer on ALL Pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageHeight - 10, pageWidth - marginX, pageHeight - 10);

    // Footer left
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text('SLTB SafeTrack AI — Confidential & Proprietary Operational Report', marginX, pageHeight - 5);

    // Footer center
    doc.text(`Report Ref: SLTB-RPT-${formatDateOnly().replace(/-/g, '')}-${tab.toUpperCase()}`, pageWidth / 2, pageHeight - 5, { align: 'center' });

    // Footer right (Page X of Y)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginX, pageHeight - 5, { align: 'right' });
  }

  // 5. Trigger download with explicit DOM anchor and download attribute to ensure exact filename across all browsers
  const pdfBlob = doc.output('blob');
  const blobUrl = window.URL.createObjectURL(pdfBlob);
  const downloadLink = document.createElement('a');
  downloadLink.style.display = 'none';
  downloadLink.href = blobUrl;
  downloadLink.download = filename;
  downloadLink.setAttribute('download', filename);

  document.body.appendChild(downloadLink);
  downloadLink.click();

  setTimeout(() => {
    if (downloadLink.parentNode) {
      document.body.removeChild(downloadLink);
    }
    window.URL.revokeObjectURL(blobUrl);
  }, 1000);
};

export default {
  generateReportPDF
};
