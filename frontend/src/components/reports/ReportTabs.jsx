import React from 'react';

export const ReportTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'buses', label: 'Buses Report' },
    { id: 'routes', label: 'Routes Report' },
    { id: 'drivers', label: 'Drivers Report' },
    { id: 'assignment-history', label: 'Bus, Route, and Driver Assignment History Report' },
    { id: 'sensors-alerts', label: 'Sensors and Alerts Report' }
  ];

  return (
    <div className="report-tabs-container" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`report-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ReportTabs;
