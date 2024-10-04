import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, Button, Alert, AlertTitle, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { isMobile } from 'react-device-detect'; // Para detectar si es un móvil
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Header from './components/Header';
import Footer from './components/Footer';
import { GlobalStyles } from '@mui/material'; 
import StakingPlus from './pages/StakingPlus';

const App: React.FC = () => {
  // Estado centralizado para la cuenta de la wallet
  const [account, setAccount] = useState<string | null>(null);
  const [showMobileWarning, setShowMobileWarning] = useState(false); // Estado para mostrar el aviso

  // Detectar si es un dispositivo móvil y mostrar el aviso
  useEffect(() => {
    if (isMobile) {
      setShowMobileWarning(true); // Mostrar aviso si es móvil
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: '#E7E7E7',
            margin: 0,
            padding: 0,
            minHeight: '100vh',
            boxSizing: 'border-box',
          },
        }}
      />
      <Router>
        {/* Pasar el estado y el setter al Header */}
        <Header account={account} setAccount={setAccount} />

        {/* Mostrar advertencia si es un dispositivo móvil */}
        {showMobileWarning && (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Alert 
              severity="info" 
              sx={{
                backgroundColor: '#fff8e1', 
                color: '#6b6b6b', 
                maxWidth: '600px', 
                boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
                position: 'relative',
              }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setShowMobileWarning(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              <AlertTitle sx={{ color: '#6b6b6b' }}>Recomendación de Uso</AlertTitle>
              <Typography variant="body1">
                Para una mejor experiencia, te recomendamos usar esta aplicación desde una computadora.
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Esta aplicación requiere MetaMask para funcionar correctamente. Descarga MetaMask para tu dispositivo:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  href="https://apps.apple.com/us/app/metamask/id1438144202"
                  target="_blank"
                  sx={{ margin: '10px' }}
                  variant="contained"
                  color="primary"
                >
                  iOS
                </Button>
                <Button
                  href="https://play.google.com/store/apps/details?id=io.metamask"
                  target="_blank"
                  sx={{ margin: '10px' }}
                  variant="contained"
                  color="primary"
                >
                  Android
                </Button>
              </Box>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Por favor, abre esta aplicación directamente desde MetaMask después de la instalación.
              </Typography>
            </Alert>
          </Box>
        )}

        <Routes>
          {/* Pasar el estado y el setter al Home */}
          <Route path="/stakingplus" element={<StakingPlus />} /> 
          <Route path="/" element={<Home account={account} setAccount={setAccount} />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
