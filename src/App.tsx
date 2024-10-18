import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, Button, Alert, AlertTitle, IconButton } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import theme from './theme';
import Header from './components/Layout/Header/Header';
import Footer from './components/Layout/Footer/Footer';
import { GlobalStyles } from '@mui/material'; 
import RouteManager from './components/Layout/RouteManager';
import MobileAlert from './components/Layout/Mobile/Mobile';

const App: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);

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
          '.fade-enter': {
            opacity: 0,
            transform: 'scale(0.95)',
          },
          '.fade-enter-active': {
            opacity: 1,
            transform: 'scale(1)',
            transition: 'opacity 300ms, transform 300ms',
          },
          '.fade-exit': {
            opacity: 1,
            transform: 'scale(1)',
          },
          '.fade-exit-active': {
            opacity: 0,
            transform: 'scale(0.95)',
            transition: 'opacity 300ms, transform 300ms',
          },
        }}
      />
      <Router>
        <Header account={account} setAccount={setAccount} />
        <MobileAlert />
        <RouteManager account={account} setAccount={setAccount} />
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;