import React from 'react';
import { Box, IconButton } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import LanguageIcon from '@mui/icons-material/Language';
import PolygonIcon from '@mui/icons-material/ChangeHistory'; // No hay un ícono específico de Polygon, usaremos ChangeHistory como triángulo

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100px',
        width: '100%',
        padding: '0 20px',
        position: 'absolute',
        bottom: 0,
        paddingLeft: '200px'
      }}
    >
      {/* Primer cuadrante: Íconos */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          background: 'white',
          marginTop: '-50px',
          padding: '20px',
          borderRadius: '50px',
          boxShadow:'6px 5px 15px -5px',
        }}
      >
        <IconButton
          href="https://t.me/atomico3"
          target="_blank"
          sx={{
            width: '60px',
            height: '60px',
            background:'linear-gradient(45deg, #004AAD, #CB6CE6)', 
            borderRadius: '50%',
            marginRight: '10px',
            color: '#fff', 
          }}
        >
          <TelegramIcon />
        </IconButton>

        <IconButton
          href="https://polygonscan.com/address/0x22a79a08ddb74a9f1a4ebe5da75300ad9f1aed76"
          target="_blank"
          sx={{
            width: '60px',
            height: '60px',
            background:'linear-gradient(45deg, #004AAD, #CB6CE6)', 
            borderRadius: '50%',
            marginRight: '10px',
            color: '#fff',        
          }}
        >
          <PolygonIcon />
        </IconButton>

        <IconButton
          href="https://atomico3.io/"
          target="_blank"
          sx={{
            width: '60px',
            height: '60px',
            background:'linear-gradient(45deg, #004AAD, #CB6CE6)', 
            borderRadius: '50%',
            color: '#fff', 
          }}
        >
          <LanguageIcon />
        </IconButton>
      </Box>

      {/* Segundo cuadrante */}
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        {/* Puedes agregar contenido aquí en el futuro */}
      </Box>

      {/* Tercer cuadrante */}
      <Box sx={{ flex: 1, textAlign: 'right' }}>
        {/* Puedes agregar contenido aquí en el futuro */}
      </Box>
    </Box>
  );
};

export default Footer;
