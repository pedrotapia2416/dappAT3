import React, { useState, useEffect } from 'react';
import { Box, Alert, AlertTitle, Typography, Button, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { isMobile } from 'react-device-detect';

const MobileAlert: React.FC = () => {
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setShowMobileWarning(true);
    }
  }, []);

  if (!showMobileWarning) {
    return null;
  }

  return (
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
  );
};

export default MobileAlert;
