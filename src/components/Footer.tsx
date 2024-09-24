import React from 'react';
import { Box, IconButton } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import LanguageIcon from '@mui/icons-material/Language';
import PolygonIcon from '@mui/icons-material/ChangeHistory';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: { xs: 'contents', md: 'flex' },
        flexDirection: { xs: 'row', md: 'row' }, 
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'auto', 
        width: '100%',
        padding: { xs: '20px', md: '0 20px' }, 
        position: 'absolute',
        bottom: 0,
      }}
    >
      {/* Primer cuadrante: Íconos */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'white',
          marginTop: { xs: '10px', md: '-200px' },
          padding: '20px',
          borderRadius: '50px',
          boxShadow: '6px 5px 15px -5px',
          flexDirection: { xs: 'row', md: 'row' }, 
        }}
      >
        <IconButton
          href="https://t.me/atomico3"
          target="_blank"
          sx={{
            width: { xs: '50px', md: '60px' }, 
            height: { xs: '50px', md: '60px' },
            background: 'linear-gradient(45deg, #004AAD, #CB6CE6)',
            borderRadius: '50%',
            margin: { xs: '10px 0', md: '0 10px' }, 
            color: '#fff',
          }}
        >
          <TelegramIcon />
        </IconButton>

        <IconButton
          href="https://polygonscan.com/address/0xAAF3AC68Bf80d995d7793a401653713A05a67B08"
          target="_blank"
          sx={{
            width: { xs: '50px', md: '60px' },
            height: { xs: '50px', md: '60px' },
            background: 'linear-gradient(45deg, #004AAD, #CB6CE6)',
            borderRadius: '50%',
            margin: { xs: '10px 0', md: '0 10px' },
            color: '#fff',
          }}
        >
          <PolygonIcon />
        </IconButton>

        <IconButton
          href="https://atomico3.io/"
          target="_blank"
          sx={{
            width: { xs: '50px', md: '60px' },
            height: { xs: '50px', md: '60px' },
            background: 'linear-gradient(45deg, #004AAD, #CB6CE6)',
            borderRadius: '50%',
            margin: { xs: '10px 0', md: '0 10px' },
            color: '#fff',
          }}
        >
          <LanguageIcon />
        </IconButton>
      </Box>

      {/* Segundo cuadrante */}
      <Box
        sx={{
          flex: 1,
          textAlign: 'center',
          display: { xs: 'none', md: 'block' }, 
        }}
      >
        {/* Puedes agregar contenido aquí en el futuro */}
      </Box>

      {/* Tercer cuadrante */}
      <Box
        sx={{
          flex: 1,
          textAlign: { xs: 'center', md: 'right' }, 
          mt: { xs: '20px', md: 0 }, 
        }}
      >
        {/* Puedes agregar contenido aquí en el futuro */}
      </Box>
    </Box>
  );
};

export default Footer;
