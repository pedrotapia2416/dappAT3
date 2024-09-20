import React, { useState } from 'react';
import { Box, Button, Modal, Typography, MenuItem, Select, TextField } from '@mui/material';
import Web3 from 'web3';
import AlertModal from './AlertModal';
import emailjs from 'emailjs-com';

const PeerToPeer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [cantidadAT3, setCantidadAT3] = useState(300); 
  const [alertOpen, setAlertOpen] = useState(false); 
  const [alertMessage, setAlertMessage] = useState(''); 
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info'); 
  const precioPorAT3 = 0.85; 

  // Calcular el total
  const totalUSDT = (cantidadAT3 * precioPorAT3).toFixed(2);

  const handleComprar = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];
  
        const usdtContractAddress = process.env.REACT_APP_USDT_CONTRACTUSDT_ADDRESS;
        const walletAddress = process.env.REACT_APP_WALLETADMIN_ADDRESS;
        const usdtABI = JSON.parse(process.env.REACT_APP_USDT_ABI || '[]');

  
        const tokenContract = new web3.eth.Contract(usdtABI, usdtContractAddress);
  
        // Convertir el total a Wei (el número de decimales en USDT es 6)
        const amountInUSDT = web3.utils.toWei(totalUSDT.toString(), 'mwei'); 

        //ENVIAR EMAIL DE NOTIFICACION 
        // sendEmail(totalUSDT, userAddress);

        // Aprobar la transferencia
        await tokenContract.methods
          .approve(walletAddress, amountInUSDT)
          .send({ from: userAddress });
  
        // Realizar la transferencia 
        const tx = await tokenContract.methods
          .transferFrom(userAddress, walletAddress, amountInUSDT)
          .send({ from: userAddress });
  
          console.log('Transacción completada:', tx);
          setAlertMessage('Compra realizada con éxito');
          setAlertSeverity('success');
          setAlertOpen(true);
  
          setOpen(false);
      } catch (error: any) {
        const errorMessage = error?.message || 'Error realizando la compra. Revisa tu conexión con MetaMask.';
        console.error('Error realizando la compra:', errorMessage);

        setAlertMessage(errorMessage);
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } else {
        setAlertMessage('MetaMask no está instalado. Por favor, instálalo para continuar.');
        setAlertSeverity('warning');
        setAlertOpen(true);
    }
  };

   // Función para enviar correo electrónico con EmailJS
   const sendEmail = ( total: string, userAddress: string) => {
    const emailParams = {
      from_name: userAddress,
      to_name: 'Tu Nombre',
      message: `Se ha completado una transacción de ${total} USDT. }`,
    };

    emailjs.send(
      'service_mn0qbtj',  
      'template_2q3nxeo',  
      emailParams,
      'uJWGoBXmCBWYLpGfC'  
    ).then((result) => {
      console.log('Correo enviado:', result.text);
    }, (error) => {
      console.log('Error enviando el correo:', error.text);
    });
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Comprar AT3
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            p: 4,
            backgroundColor: 'white',
            borderRadius: '8px',
            maxWidth: '400px',
            margin: 'auto',
            mt: '10%',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6">Compra de AT3</Typography>

      
          <Select
            value={cantidadAT3}
            onChange={(e) => setCantidadAT3(Number(e.target.value))}
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value={300}>300 AT3</MenuItem>
            <MenuItem value={500}>500 AT3</MenuItem>
          </Select>

       
          <TextField
            label="Precio por AT3"
            value={`$${precioPorAT3} USDT`}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Total"
            value={`$${totalUSDT} USDT`}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            sx={{ mt: 2 }}
          />


          <Button
            variant="contained"
            onClick={handleComprar}
            sx={{ mt: 3, backgroundColor: '#4CAF50', color: '#fff' }}
          >
            Buy Peer to Peer
          </Button>
        </Box>
      </Modal>
      <AlertModal
        open={alertOpen}
        severity={alertSeverity}
        message={alertMessage}
        onClose={() => setAlertOpen(false)} 
      />
    </>
  );
};

export default PeerToPeer;
