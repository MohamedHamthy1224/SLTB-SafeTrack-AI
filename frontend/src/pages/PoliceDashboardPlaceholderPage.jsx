import React, { useState } from 'react';
import { Shield, Clock, AlertTriangle, Radio, CheckCircle, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import logoImg from '../assets/images/sltb_logo.png';
import '../styles/dashboard.css';

export const PoliceDashboardPlaceholderPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-layout" style={{ background: '#090d16', color: '#f8fafc', minHeight: '100vh' }}>
      <header style={{
        padding: '1.25rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#0d1527'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
            padding: '0.6rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Shield size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
              Police Administration Dashboard
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
              Traffic Operations & Public Safety Command Center
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#e2e8f0' }}>
              {user?.username || 'Police Administrator'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600 }}>
              {user?.role_name || 'Police Admin'}
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ padding: '2.5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Status Alert Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(59, 130, 246, 0.2))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
            <div style={{
              background: '#2563eb',
              color: '#fff',
              padding: '0.85rem',
              borderRadius: '12px',
              display: 'flex'
            }}>
              <Radio size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#fff' }}>
                Police Command Center Authentication Active
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
                You have successfully authenticated as a <strong>Police Administrator</strong>. Role-Based Access Control (RBAC) has verified your credentials against the MySQL database, active session tokens, and route permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            background: '#131c31',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#60a5fa' }}>
              <Shield size={22} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                Role & Session Info
              </h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
              <li style={{ padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <strong>User ID:</strong> {user?.user_id}
              </li>
              <li style={{ padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <strong>Role ID:</strong> {user?.role_id}
              </li>
              <li style={{ padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <strong>Role Name:</strong> {user?.role_name}
              </li>
              <li style={{ padding: '0.4rem 0' }}>
                <strong>Email:</strong> {user?.email}
              </li>
            </ul>
          </div>

          <div style={{
            background: '#131c31',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#10b981' }}>
              <CheckCircle size={22} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                Access Control Status
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
              The web route <code>/police/dashboard</code> is restricted to <strong>Police Admin</strong> accounts. Access to SLTB operator routes is strictly isolated.
            </p>
          </div>

          <div style={{
            background: '#131c31',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#f59e0b' }}>
              <Clock size={22} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                Phase 2 Modules Ready
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
              Police Traffic Operations, Officer Management, Live Alert Feeds, and Roadside Unit Telemetry will be initialized in the Police Administration Dashboard phase.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
