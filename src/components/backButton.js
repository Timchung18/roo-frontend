import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/`); // Goes back to the previous page in the browser history
  };

  return (
    <IconButton
      onClick={handleBack}
      sx={{
        backgroundColor: 'white',
        borderRadius: '50%',
        width: '45px',
        height: '45px',
        // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        // border: '2px solid orange',
        '&:hover': {
          backgroundColor: '#f0f0f0', // Optional hover effect
        },
      }}
    >
      <ArrowBackIcon sx={{ color: 'orange', fontSize: '26px' }} />
    </IconButton>
  );
};

export default BackButton;
