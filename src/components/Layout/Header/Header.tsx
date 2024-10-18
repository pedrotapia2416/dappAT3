import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LockIcon from '@mui/icons-material/Lock'; 
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; 
import Web3 from 'web3';
import AT3Balance from '../../Commerce/AT3Balance';
import StakedBalance from '../../Staking/StakedBalance';
import AT3ToUSDTPrice from '../../Commerce/MarketPrice';
import AlertModal from '../../AlertModal'; 
import LogoutIcon from '@mui/icons-material/Logout';

interface HeaderProps {
  account: string | null;
  setAccount: (account: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ account, setAccount }) => {
  const [openAlert, setOpenAlert] = useState(false); 
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const showAlert = (severity: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setOpenAlert(true);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]); 
        showAlert('success', '¡Wallet conectada con éxito!');
      } catch (error) {
        console.error("Error al conectar MetaMask", error);
        showAlert('error', 'Error al conectar MetaMask');
      }
    } else {
      showAlert('warning', 'MetaMask no está instalado. Por favor, instálalo para continuar.');
    }
  };

  const handleLogout = () => {
    setAccount(null); // Limpiar la cuenta
    showAlert('info', 'Wallet desconectada con éxito.');
  };

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      web3.eth.getAccounts().then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]); 
        }
      });
    }
  }, [setAccount]);

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          {/* Icono del menú hamburguesa para pantallas pequeñas */}
          <IconButton
            edge="start"
            sx={{ display: { xs: 'block', md: 'none' } }} 
            color="inherit"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }} />

          {/* Elementos para pantallas más grandes */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {account && (
              <>
                {/* Balance de AT3 */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    color: '#3B3737',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    mt: 2,
                    boxShadow: '6px 5px 15px -5px',
                    mr: 2,
                  }}
                >
                  <WalletIcon sx={{ mr: 1, color: '#fff', background: 'linear-gradient(45deg, #004AAD, #CB6CE6)', padding: '8px', borderRadius: '20px', fontSize: '40px' }} />
                  <AT3Balance account={account} />
                </Box>

                {/* Staked Balance */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    color: '#3B3737',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    mt: 2,
                    boxShadow: '6px 5px 15px -5px',
                    mr: 2,
                  }}
                >
                  <LockIcon sx={{ mr: 1, color: '#fff', background: 'orange', padding: '8px', borderRadius: '20px', fontSize: '40px' }} />
                  <StakedBalance account={account} />
                </Box>

                {/* Precio de mercado USDT */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    color: '#3B3737',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    mt: 2,
                    boxShadow: '6px 5px 15px -5px',
                    mr: 2,
                  }}
                >
                  <AttachMoneyIcon sx={{ mr: 1, color: '#fff', background: '#2EA480', padding: '8px', borderRadius: '20px', fontSize: '40px' }} />
                  <AT3ToUSDTPrice />
                </Box>
                {account ? (
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  color: '#3B3737',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  mt: 2,
                  boxShadow: '6px 5px 15px -5px',
                }}
              >
                <WalletIcon sx={{ mr: 1, color: '#fff', background: 'linear-gradient(45deg, #004AAD, #CB6CE6)', padding: '8px', borderRadius: '20px', fontSize: '40px' }} />
                <Typography variant="body1">{account}</Typography>
              </Box>
            </Box>
          ) : (
            ''
          )}
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menú lateral (Drawer) para pantallas pequeñas */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          {account && (
            <>
              <ListItem>
                <WalletIcon sx={{ mr: 1, color: '#fff', background: 'linear-gradient(45deg, #004AAD, #CB6CE6)', padding: '8px', borderRadius: '20px', fontSize: '40px' }} />
                <AT3Balance account={account} />
              </ListItem>

              <ListItem>
                <LockIcon sx={{ mr: 1, color: '#fff', background: 'orange', padding: '8px', borderRadius: '20px', fontSize: '40px' }} />
                <StakedBalance account={account} />
              </ListItem>

              <ListItem>
                <AttachMoneyIcon sx={{ mr: 1, color: '#fff', background: '#2EA480', padding: '8px', borderRadius: '20px', fontSize: '40px' }} />
                <AT3ToUSDTPrice />
              </ListItem>

              {/* <ListItem>
                <LogoutIcon sx={{ mr: 1 }} />
                <ListItemText primary="Logout" onClick={handleLogout} />
              </ListItem> */}
            </>
          )}
        </List>
      </Drawer>

      <AlertModal open={openAlert} severity={alertSeverity} message={alertMessage} onClose={() => setOpenAlert(false)} />
    </>
  );
};

export default Header;
