import { SxProps, Theme } from '@mui/material';

import linesImage from '../../assets/images/lineas.png';

export const authContainer: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  justifyContent: 'left',
  alignItems: 'center',
  minHeight: { xs: '100vh', md: '80vh' },
  margin: { xs: -10, md: 2 },
  borderRadius: { xs: '0px', md: '100px' },
  padding: '20px',
  backgroundImage: `url(${linesImage}), linear-gradient(45deg, #004AAD, #000024)`,
  backgroundSize: 'cover, 100% 200%',
  backgroundPosition: 'bottom, 0% 50%',
  backgroundRepeat: 'no-repeat, no-repeat',
  animation: 'gradient 25s ease infinite',
  '@keyframes gradient': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
};

export const logoContainer: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const rotatingLogoStyle = {
  maxWidth: '300px',
  height: 'auto',
  objectFit: 'contain',
  animation: 'rotateLogo 5s ease-in-out infinite',
};

export const formContainer: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  textAlign: 'left',
  mt: { xs: 4, md: 0 },
  
};

export const modalStyle: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 800 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export const formContent: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  maxWidth: 500,
  backgroundColor: 'white',
  paddingTop: 10,
  paddingLeft: 1,
  paddingRight: 1,
  paddingBottom: 10,
  borderRadius: 5,
};
