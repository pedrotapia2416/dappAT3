import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
   
    navigate('/home'); 
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 400 }}>
      <Typography variant="h6" justifyContent="center" gutterBottom>
        Iniciar Sesión
      </Typography>
      <TextField label="Correo Electrónico" variant="outlined" fullWidth margin="normal" />
      <TextField label="Contraseña" type="password" variant="outlined" fullWidth margin="normal" />
      <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
        Iniciar Sesión
      </Button>
    </Box>
  );
};

export default Login;
