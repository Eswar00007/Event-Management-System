import React, { useState } from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';

const RadioInput = () => {
  const [value, setValue] = useState('');

  const options = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'extra-large', label: 'Extra Large' },
  ];

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <FormControl
        component="fieldset"
        className="
          transition-all duration-300 ease-in-out
          hover:scale-105
          focus-within:scale-105
          focus-within:shadow-lg
          focus-within:shadow-pink-200
        "
      >
        <FormLabel
          component="legend"
          sx={{
            transition: 'all 0.3s ease-in-out',
            color: '#374151',
            fontWeight: 500,
            marginBottom: 2,
            '&.Mui-focused': {
              color: '#ec4899',
            },
          }}
        >
          Choose Size
        </FormLabel>
        <RadioGroup
          value={value}
          onChange={handleChange}
          className="space-y-2"
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  icon={<RadioButtonUnchecked />}
                  checkedIcon={<RadioButtonChecked />}
                  sx={{
                    transition: 'all 0.3s ease-in-out',
                    color: '#9ca3af',
                    '&:hover': {
                      backgroundColor: 'rgba(236, 72, 153, 0.1)',
                      transform: 'scale(1.1)',
                      color: '#ec4899',
                    },
                    '&.Mui-checked': {
                      color: '#ec4899',
                      '&:hover': {
                        backgroundColor: 'rgba(236, 72, 153, 0.2)',
                      },
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: 20,
                      transition: 'all 0.3s ease-in-out',
                    },
                  }}
                />
              }
              label={option.label}
              className="
                transition-all duration-300 ease-in-out
                hover:scale-105
                hover:bg-pink-50
                rounded-lg
                px-2
                py-1
                mx-0
                cursor-pointer
                select-none
              "
              sx={{
                '& .MuiFormControlLabel-label': {
                  transition: 'all 0.3s ease-in-out',
                  color: value === option.value ? '#ec4899' : '#374151',
                  fontWeight: value === option.value ? 600 : 400,
                  '&:hover': {
                    color: '#ec4899',
                  },
                },
                '&:hover': {
                  backgroundColor: '#fdf2f8',
                  '& .MuiRadio-root': {
                    transform: 'scale(1.1)',
                  },
                },
                '&:active': {
                  '& .MuiRadio-root': {
                    transform: 'scale(0.95)',
                  },
                },
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default RadioInput;