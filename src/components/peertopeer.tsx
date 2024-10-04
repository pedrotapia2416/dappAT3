import React, { useState } from 'react';
import { Box, Button, Modal, Typography, MenuItem, Select, TextField } from '@mui/material';
import Web3 from 'web3';
import AlertModal from './AlertModal';
import emailjs from 'emailjs-com';

const PeerToPeer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [cantidadAT3, setCantidadAT3] = useState(300);
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [approving, setApproving] = useState(false); 
  const [transfering, setTransfering] = useState(false);

  const precioPorAT3 = 0.85;
  const totalUSDT = (cantidadAT3 * precioPorAT3).toFixed(2);
  const totalConAdicional = (cantidadAT3 * 1.75).toFixed(0);
  
  const empresaWalletAddress = process.env.REACT_APP_WALLETADMIN_ADDRESS;  
  const usdtTokenAddress = process.env.REACT_APP_USDT_CONTRACTUSDT_ADDRESS; 

  const resetForm = () => {
    setCantidadAT3(300);
    setNombre('');
    setDni('');
    setEmail('');
  };

  const handleTransfer = async () => {
    if (!nombre || !dni || !email || !cantidadAT3) {
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
  
        const increasedGasEstimate = (gasEstimate * BigInt(120)) / BigInt(100);

        const gasPrice = await web3.eth.getGasPrice();
  
        await usdtContract.methods
        .transfer(empresaWalletAddress, amountInUSDT)
        .send({
          from: userAddress,
          gas: increasedGasEstimate.toString(), 
          gasPrice : gasPrice.toString()
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
        Comprar AT3 300 y 500 (USDT)
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            p: 4,
            backgroundColor: 'white',
            borderRadius: '8px',
            maxWidth: '400px',
            margin: 'auto',
            mt: '50px',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6">Compra de AT3 (USDT)</Typography>

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
          <TextField
            label="Vas a recibir: ( + Plus del 75%)"
            value={`${totalConAdicional} AT3`}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            sx={{ mt: 2 }}
          />

          {/* Botón para iniciar la transferencia */}
          <Button
            variant="contained"
            onClick={handleTransfer}
            sx={{ mt: 3, backgroundColor: '#4CAF50', color: '#fff' }}
            disabled={transfering}
          >
            {transfering ? 'Transfiriendo USDT...' : 'Peer to Peer'}
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
