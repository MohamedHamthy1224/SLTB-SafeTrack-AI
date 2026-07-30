import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../../../styles/addUser.css';

const PasswordField = ({ value, onChange, placeholder = 'Enter password' }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="add-user-input-icon-wrap">
      <input
        type={showPassword ? 'text' : 'password'}
        className="add-user-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className="add-user-input-icon-btn"
        onClick={() => setShowPassword(!showPassword)}
        title={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

export default PasswordField;
