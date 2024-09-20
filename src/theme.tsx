import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#004AAD',
    },
    secondary: {
      main: '#CB6CE6',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '40px',
          padding: '10px 20px',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #004AAD, #CB6CE6)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(45deg, #003A7A, #A94BCE)',
          },
        },
      },
    },
  },
});

export default theme;
