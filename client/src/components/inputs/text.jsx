import React from 'react';
import { TextField } from '@mui/material';

const TextInput = () => {
  return (
    <div className="p-6 max-w-md mx-auto">
      <TextField
        label="Text Input"
        variant="outlined"
        fullWidth
        className="
          transition-all duration-300 ease-in-out
          hover:scale-105
          focus-within:scale-105
          focus-within:shadow-lg
          focus-within:shadow-blue-200
        "
        sx={{
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#f8fafc',
              '& fieldset': {
                borderColor: '#3b82f6',
                borderWidth: '2px',
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#f8fafc',
              '& fieldset': {
                borderColor: '#3b82f6',
                borderWidth: '2px',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
              },
            },
            '&:not(.Mui-focused):hover fieldset': {
              borderColor: '#6b7280',
            },
          },
          '& .MuiInputLabel-root': {
            transition: 'all 0.3s ease-in-out',
            '&.Mui-focused': {
              color: '#3b82f6',
              fontWeight: 500,
            },
          },
          '& .MuiOutlinedInput-input': {
            transition: 'all 0.3s ease-in-out',
            '&::placeholder': {
              color: '#9ca3af',
              opacity: 1,
            },
          },
        }}
      />
    </div>
  );
};

export default TextInput;