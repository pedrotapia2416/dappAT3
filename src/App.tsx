import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Header from './components/Header';
import Footer from './components/Footer';
import { GlobalStyles } from '@mui/material'; 
import StakingPlus from './pages/StakingPlus';

const App: React.FC = () => {
  // Estado centralizado para la cuenta de la wallet
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
        }}
      />
      <Router>
        {/* Pasar el estado y el setter al Header */}
        <Header account={account} setAccount={setAccount} />
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
