import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Button } from '@mui/material';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AlertModal from './AlertModal'; 

declare global {
  interface Window {
    ethereum?: any;
  }
}

const ConnectWallet: React.FC<{ onConnect: (account: string) => void }> = ({ onConnect }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          onConnect(accounts[0]); 
          setAlertMessage('Wallet connected successfully!');
          setAlertSeverity('success');
          setAlertOpen(true);
        } else {
          setAlertMessage('No accounts found.');
          setAlertSeverity('warning');
          setAlertOpen(true);
        }
      } catch (error: any) {
        console.error('Error connecting wallet:', error);
        if (error.code === 4001) {
          setAlertMessage('Connection to MetaMask rejected by user.');
          setAlertSeverity('warning');
        } else {
          setAlertMessage('Error connecting to wallet.');
          setAlertSeverity('error');
        }
        setAlertOpen(true);
      }
    } else {
      setAlertMessage('MetaMask not detected. Please install MetaMask.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      web3.eth.getAccounts().then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]); 
          onConnect(accounts[0]); 
        }
      });
    }
  }, [onConnect]);

  return (
    <>
      <Button
        variant="contained"
        onClick={connectWallet}
        sx={{
          backgroundColor: 'white',
          borderRadius: '40px',
          padding: '10px 20px',
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        <WalletIcon
          sx={{
            mr: 1,
            color: '#fff',
            background: 'linear-gradient(45deg, #004AAD, #CB6CE6)',
            padding: '8px',
            borderRadius: '20px',
            fontSize: '40px',
          }}
        />
        {account ? `Connected: ${account.substring(0, 6)}...` : 'Connect Wallet'}
      </Button>

      {/* Alert Modal */}
      <AlertModal
        open={alertOpen}
        severity={alertSeverity}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
};

export default ConnectWallet;
