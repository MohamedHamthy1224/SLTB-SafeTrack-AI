import React, { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { searchService } from '../../services/searchService';

export const Header = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (val.trim().length > 0) {
      setIsSearching(true);
      setShowResultsDropdown(true);
      try {
        const res = await searchService.globalSearch(val.trim());
        if (res.success && res.data) {
          setSearchResults(res.data);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Global search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowResultsDropdown(false);
    }
  };

  const fullName = user?.sltb_profile?.full_name || 'Admin User';
  const designation = user?.sltb_profile?.designation || 'SLTB Administrator';

  return (
    <header className="dashboard-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={onToggleSidebar} 
          style={{ background: 'transparent', display: 'flex', alignItems: 'center', color: '#1e293b' }}
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="header-welcome">
          <h2>Welcome back, Admin!</h2>
          <p>Here's what's happening with your fleet today.</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="header-search">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            onBlur={() => setTimeout(() => setShowResultsDropdown(false), 200)}
            onFocus={() => searchQuery.trim() && setShowResultsDropdown(true)}
          />

          {showResultsDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '0.5rem',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1000,
              padding: '0.5rem'
            }}>
              {isSearching ? (
                <div style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                  Searching backend...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <div key={idx} style={{
                    padding: '0.5rem 0.75rem',
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '0.8rem'
                  }}>
                    <strong style={{ color: '#0047ff' }}>[{item.type}]</strong> {item.title}
                    <div style={{ fontSize: '0.725rem', color: '#64748b' }}>{item.subtitle}</div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                  No matching records found.
                </div>
              )}
            </div>
          )}
        </div>

        <button className="notification-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-profile-menu">
          <div className="user-avatar">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h5>{fullName}</h5>
            <p>{designation}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
