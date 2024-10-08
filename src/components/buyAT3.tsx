import React, { useState } from 'react';
import { Box, Button, Modal, Typography, TextField, Switch, FormControlLabel, Grid } from '@mui/material';
import Web3 from 'web3';
import AlertModal from './AlertModal';
import emailjs from 'emailjs-com';

const BuyAT3: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [cantidadAT3, setCantidadAT3] = useState(0);
  const [montoUSDT, setMontoUSDT] = useState(0); 
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [transfering, setTransfering] = useState(false);
  const [isAT3Mode, setIsAT3Mode] = useState(true); 

  const precioPorAT3 = 0.85;

  const totalUSDT = isAT3Mode
    ? (cantidadAT3 * precioPorAT3).toFixed(2)
    : montoUSDT.toFixed(2); 

    const cantidadCalculadaAT3 = Number((montoUSDT / precioPorAT3).toFixed(0));
    const totalConAdicional = ((isAT3Mode ? cantidadAT3 : cantidadCalculadaAT3) * 1.75).toFixed(0);

    
  const empresaWalletAddress = process.env.REACT_APP_WALLETADMIN_ADDRESS;  
  const usdtTokenAddress = process.env.REACT_APP_USDT_CONTRACTUSDT_ADDRESS; 

  const resetForm = () => {
    setCantidadAT3(0);
    setMontoUSDT(0);
    setNombre('');
    setDni('');
    setEmail('');
  };

  const handleTransfer = async () => {
    if (!nombre || !dni || !email || (isAT3Mode ? !cantidadAT3 : !montoUSDT)) {
      setAlertSeverity('warning');
      setAlertMessage('Todos los campos son obligatorios.');
      setAlertOpen(true);
      return;
    }

    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        const amountInUSDT = web3.utils.toWei(totalUSDT, 'mwei');

        const usdtContract = new web3.eth.Contract([
          {
            "constant": false,
            "inputs": [
              { "name": "_to", "type": "address" },
              { "name": "_value", "type": "uint256" }
            ],
            "name": "transfer",
            "outputs": [{ "name": "", "type": "bool" }],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ], usdtTokenAddress);

        setTransfering(true);
        setAlertSeverity('info');
        setAlertMessage('Transfiriendo USDT. Por favor, confirma en MetaMask.');
        setAlertOpen(true);

        const gasEstimate = await usdtContract.methods
          .transfer(empresaWalletAddress, amountInUSDT)
          .estimateGas({ from: userAddress });

        const increasedGasEstimate = (BigInt(gasEstimate) * BigInt(120)) / BigInt(100);

        const gasPrice = await web3.eth.getGasPrice();

        await usdtContract.methods
          .transfer(empresaWalletAddress, amountInUSDT)
          .send({
            from: userAddress,
            gas: increasedGasEstimate.toString(),
            gasPrice: gasPrice.toString()
          })
          .on('receipt', (receipt) => {
            setAlertSeverity('success');
            setAlertMessage(`Transferencia completada. Hash de la transacción: ${receipt.transactionHash}`);
            setAlertOpen(true);

            sendEmail(nombre, dni, email, totalUSDT, totalConAdicional, receipt.transactionHash);
            resetForm();
            setOpen(false);
          })
          .on('error', (error) => {
            console.error('Error en la transferencia:', error);
            setAlertSeverity('error');
            setAlertMessage('Error en la transferencia. Inténtalo de nuevo.');
            setAlertOpen(true);
          });
      } else {
        setAlertSeverity('error');
        setAlertMessage('MetaMask no está instalado. Por favor, instálalo para continuar.');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Error en la transferencia:', error);
      setAlertSeverity('error');
      setAlertMessage('Error inesperado. Inténtalo de nuevo.');
      setAlertOpen(true);
    } finally {
      setTransfering(false);
    }
  };

  const sendEmail = (nombre: string, dni: string, email: string, totalUSDT: string, totalConAdicional: string, transactionHash: string) => {
    const emailParams = {
      from_name: nombre,
      dni: dni,
      email: email,
      total_usdt: totalUSDT,
      total_con_adicional: totalConAdicional,
      transaction_hash: transactionHash,
    };

    emailjs.send(
      'service_mn0qbtj',  
      'template_8kdv3ap',  
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
        Peer to Peer
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            p: 4,
            backgroundColor: 'white',
            borderRadius: '8px',
            maxWidth: '800px', // Aumentamos el ancho para permitir dos columnas
            margin: 'auto',
            mt: '50px',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6">Peer to Peer</Typography>
          <FormControlLabel
                control={
                  <Switch
                    checked={isAT3Mode}
                    onChange={() => setIsAT3Mode(!isAT3Mode)}
                  />
                }
                label={isAT3Mode ? "Comprar AT3" : "Invertir USDT"}
                sx={{ mb: 2, mt: 2 }}
              />
          <Grid container spacing={3} >
            {/* Columna izquierda: Datos personales */}
            <Grid item xs={12} md={6} >
              <TextField
                label="Nombre y Apellido"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                fullWidth
                required
                sx={{ mt: 2 }}
              />
              <TextField
                label="DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                fullWidth
                required
                sx={{ mt: 2 }}
              />
              <TextField
                label="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                sx={{ mt: 2 }}
              />
            </Grid>

            {/* Columna derecha: Datos de la compra */}
            <Grid item xs={12} md={6}>
              

              <TextField
                label={isAT3Mode ? "Cantidad de AT3" : "Monto en USDT"}
                value={isAT3Mode ? cantidadAT3 : montoUSDT}
                onChange={(e) => {
                  if (isAT3Mode) {
                    setCantidadAT3(Number(e.target.value));
                  } else {
                    setMontoUSDT(Number(e.target.value));
                  }
                }}
                fullWidth
                type="number"
                sx={{ mt: 2 }}
              />

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
              <TextField
                label="Vas a recibir: ( + Plus del 75%)"
                value={`${totalConAdicional} AT3`}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>

          {/* Botón para iniciar la transferencia */}
          <Button
            variant="contained"
            onClick={handleTransfer}
            sx={{ mt: 3, backgroundColor: '#4CAF50', color: '#fff' }}
            disabled={transfering}
          >
            {transfering ? 'Transfiriendo USDT...' : 'Comprar AT3'}
          </Button>
        </Box>
      </Modal>

      {/* Modal de alerta para mostrar mensajes de éxito o error */}
      <AlertModal
        open={alertOpen}
        severity={alertSeverity}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
};

export default BuyAT3;
