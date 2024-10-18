import React, { useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import linesImage from '../../assets/images/lineas.png';
import logo from '../../assets/images/logo.png';
import Login from './Components/Login';
import Register from './Components/Register';
import {
    authContainer,
    logoContainer,
    rotatingLogoStyle,
    formContainer,
    modalStyle,
    formContent,
  } from './style';

const Auth: React.FC = () => {
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  const handleOpenRegisterModal = () => setOpenRegisterModal(true);
  const handleCloseRegisterModal = () => setOpenRegisterModal(false);

  return (
    <Box sx={authContainer}>
      <Box sx={logoContainer}>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={rotatingLogoStyle} 
        />
      </Box>


      <Box sx={formContainer}>
           <Box sx={formContent}>
          <Login />

          <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
            ¿Eres nuevo?{' '}
            <Button
              variant="text"
              color="primary"
              onClick={handleOpenRegisterModal}
              sx={{ textTransform: 'none', padding: 0, minWidth: 'auto' }}
            >
              Regístrate para comenzar a operar
            </Button>
          </Typography>
        </Box>
      </Box>

      {/* Modal para el formulario de Registro */}
      <Modal
        open={openRegisterModal}
        onClose={handleCloseRegisterModal}
        aria-labelledby="register-modal-title"
        aria-describedby="register-modal-description"

      >
        <Box sx={modalStyle}>
          <Register />
        </Box>
      </Modal>

      <style>
        {`
          @keyframes rotateLogo {
            0% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
            100% { transform: rotate(-5deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default Auth;