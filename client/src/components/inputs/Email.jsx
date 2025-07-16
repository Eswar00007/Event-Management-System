import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Email } from '@mui/icons-material';

const EmailInput = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value) && value !== '') {
      setError('Please enter a valid email address');
    } else {
      setError('');
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <TextField
        label="Email Address"
        type="email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={handleChange}
        error={!!error}
        helperText={error}
        className="
          transition-all duration-300 ease-in-out
          hover:scale-105
          focus-within:scale-105
          focus-within:shadow-lg
          focus-within:shadow-green-200
        "
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email className="text-gray-400 transition-colors duration-300 group-focus-within:text-green-500" />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#f0fdf4',
              '& fieldset': {
                borderColor: '#22c55e',
                borderWidth: '2px',
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#f0fdf4',
              '& fieldset': {
                borderColor: '#22c55e',
                borderWidth: '2px',
                boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)',
              },
            },
            '&.Mui-error': {
              '& fieldset': {
                borderColor: '#ef4444',
              },
              '&:hover fieldset': {
                borderColor: '#ef4444',
              },
            },
            '&:not(.Mui-focused):not(.Mui-error):hover fieldset': {
              borderColor: '#9ca3af',
            },
          },
          '& .MuiInputLabel-root': {
            transition: 'all 0.3s ease-in-out',
            '&.Mui-focused': {
              color: '#22c55e',
              fontWeight: 500,
            },
          },
          '& .MuiOutlinedInput-input': {
            transition: 'all 0.3s ease-in-out',
            '&:valid': {
              color: '#059669',
            },
          },
        }}
      />
    </div>
  );
};

export default EmailInput;