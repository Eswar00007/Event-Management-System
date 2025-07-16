import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        className="
          transition-all duration-300 ease-in-out
          hover:scale-105
          focus-within:scale-105
          focus-within:shadow-lg
          focus-within:shadow-red-200
        "
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                edge="end"
                className="
                  transition-all duration-200 ease-in-out
                  hover:scale-110
                  hover:bg-gray-100
                  active:scale-95
                "
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#fef2f2',
              '& fieldset': {
                borderColor: '#ef4444',
                borderWidth: '2px',
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#fef2f2',
              '& fieldset': {
                borderColor: '#ef4444',
                borderWidth: '2px',
                boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
              },
            },
            '&:not(.Mui-focused):hover fieldset': {
              borderColor: '#9ca3af',
            },
          },
          '& .MuiInputLabel-root': {
            transition: 'all 0.3s ease-in-out',
            '&.Mui-focused': {
              color: '#ef4444',
              fontWeight: 500,
            },
          },
          '& .MuiOutlinedInput-input': {
            transition: 'all 0.3s ease-in-out',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
          },
        }}
      />
    </div>
  );
};

export default PasswordInput;