import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Clock, Layers } from 'lucide-react';
import '../styles/dashboard.css';

export const ModulePlaceholderPage = ({ moduleTitle, moduleDescription }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="dashboard-content">
          <div className="section-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#0047ff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Layers size={32} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>{moduleTitle}</h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem', maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>
              {moduleDescription || 'This module is scheduled for implementation in a future development phase.'}
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#fef3c7',
              color: '#d97706',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              <Clock size={16} />
              <span>Phase 1 Core Infrastructure Active</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
