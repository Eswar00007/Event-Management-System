import React, { useState } from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';
import { Check } from '@mui/icons-material';

const CheckboxInput = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleChange}
            icon={<div className="w-5 h-5 border-2 border-gray-300 rounded transition-all duration-200 hover:border-teal-400" />}
            checkedIcon={<Check className="w-5 h-5 text-white bg-teal-500 rounded border-2 border-teal-500" />}
            sx={{
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                transform: 'scale(1.1)',
              },
              '&.Mui-checked': {
                color: '#14b8a6',
                '&:hover': {
                  backgroundColor: 'rgba(20, 184, 166, 0.2)',
                },
              },
              '& .MuiSvgIcon-root': {
                fontSize: 20,
                transition: 'all 0.3s ease-in-out',
              },
            }}
          />
        }
        label="I agree to the terms and conditions"
        className="
          transition-all duration-300 ease-in-out
          hover:scale-105
          cursor-pointer
          select-none
        "
        sx={{
          '& .MuiFormControlLabel-label': {
            transition: 'all 0.3s ease-in-out',
            color: checked ? '#14b8a6' : '#374151',
            fontWeight: checked ? 500 : 400,
            '&:hover': {
              color: '#14b8a6',
            },
          },
          '&:hover': {
            '& .MuiCheckbox-root': {
              transform: 'scale(1.1)',
            },
          },
          '&:active': {
            '& .MuiCheckbox-root': {
              transform: 'scale(0.95)',
            },
          },
        }}
      />
    </div>
  );
};

export default CheckboxInput;