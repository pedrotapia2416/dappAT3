import React from 'react';
import { Box } from '@mui/material';
import ConnectWallet from '../components/ConnectWallet';
import StakeForm from '../components/StakeForm';
import UnstakeForm from '../components/UnstakeForm';
import GetStakeForm from '../components/GetStakeForm';
import PeerToPeer from '../components/peertopeer';
import linesImage from '../assets/images/lineas.png';
import logo from '../assets/images/logo.png';

interface HomeProps {
  account: string | null;
  setAccount: (account: string | null) => void;
}

const Home: React.FC<HomeProps> = ({ account, setAccount }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'center',
        minHeight: '80vh',
        margin: 2,
        borderRadius: '100px',
        padding: '20px',
        backgroundImage: `url(${linesImage}), linear-gradient(45deg, #004AAD, #000024)`,
        backgroundSize: 'cover, 100% 200%',
        backgroundPosition: 'bottom, 0% 50%',
        backgroundRepeat: 'no-repeat, no-repeat',
        animation: 'gradient 25s ease infinite',
        '@keyframes gradient': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: '500px',
            height: '500px',
            objectFit: 'contain',
            animation: 'rotateLogo 5s ease-in-out infinite',
          }}
        />
      </Box>

      {/* Lado derecho*/}
      <Box
        sx={{
          flex: 1, 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          textAlign:'left',
        }}
      >
        {!account && <ConnectWallet onConnect={setAccount} />}
        {account && (
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2, 
              justifyContent: 'flex-start',
              alignItems: 'left',
            }}
          >
            <StakeForm />   
            <UnstakeForm />
            <GetStakeForm />
            <PeerToPeer />
          </Box>
        )}
      </Box>

      <style>
        {`
          @keyframes rotateLogo {
            0% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
            100% { transform: rotate(-5deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default Home;
