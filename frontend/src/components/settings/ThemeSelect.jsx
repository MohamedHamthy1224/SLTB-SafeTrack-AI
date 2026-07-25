import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronDown, Check } from 'lucide-react';

export const ThemeSelect = ({ value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System Default', icon: Monitor }
  ];

  const selectedOption = options.find((opt) => opt.value === value) || options[0];
  const SelectedIcon = selectedOption.icon;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="theme-select-container" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        className={`theme-select-box ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Theme dropdown"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <SelectedIcon size={18} className="theme-option-icon" />
          <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{selectedOption.label}</span>
        </div>
        <ChevronDown size={18} style={{ transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {isOpen && (
        <div className="theme-select-dropdown" role="listbox" tabIndex="-1">
          {options.map((option) => {
            const IconComp = option.icon;
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                className={`theme-select-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={isSelected}
                tabIndex="0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(option.value);
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <IconComp size={18} />
                  <span>{option.label}</span>
                </div>
                {isSelected && <Check size={16} style={{ color: '#0240bf' }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeSelect;
