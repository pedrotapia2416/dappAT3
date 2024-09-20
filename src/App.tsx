import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Header from './components/Header';
import Footer from './components/Footer';
import { GlobalStyles } from '@mui/material'; 

const App: React.FC = () => {
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
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
