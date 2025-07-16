import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Numbers } from '@mui/icons-material';

const NumberInput = () => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    const newValue = e.target.value;
    // Allow only numbers and decimal point
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      setValue(newValue);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <TextField
        label="Number Input"
        type="number"
        variant="outlined"
        fullWidth
        value={value}
        onChange={handleChange}
        className="
          transition-all duration-300 ease-in-out
          hover:scale-105
          focus-within:scale-105
          focus-within:shadow-lg
          focus-within:shadow-purple-200
        "
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Numbers className="text-gray-400 transition-colors duration-300" />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#faf5ff',
              '& fieldset': {
                borderColor: '#a855f7',
                borderWidth: '2px',
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#faf5ff',
              '& fieldset': {
                borderColor: '#a855f7',
                borderWidth: '2px',
                boxShadow: '0 0 0 3px rgba(168, 85, 247, 0.1)',
              },
            },
            '&:not(.Mui-focused):hover fieldset': {
              borderColor: '#9ca3af',
            },
          },
          '& .MuiInputLabel-root': {
            transition: 'all 0.3s ease-in-out',
            '&.Mui-focused': {
              color: '#a855f7',
              fontWeight: 500,
            },
          },
          '& .MuiOutlinedInput-input': {
            transition: 'all 0.3s ease-in-out',
            fontFamily: 'monospace',
            textAlign: 'right',
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
              '-webkit-appearance': 'none',
              margin: 0,
            },
            '&[type=number]': {
              '-moz-appearance': 'textfield',
            },
          },
        }}
      />
    </div>
  );
};

export default NumberInput;