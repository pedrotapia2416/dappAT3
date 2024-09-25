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
  const [approving, setApproving] = useState(false); // Estado para controlar el proceso de aprobación
  const [transfering, setTransfering] = useState(false); // Estado para controlar la transferencia

  const precioPorAT3 = 0.85;
  const totalUSDT = (cantidadAT3 * precioPorAT3).toFixed(2);
  const totalConAdicional = (cantidadAT3 * 1.75).toFixed(0);

  // Función para aprobar la transacción
  const handleApprove = async () => {
    if (window.ethereum) {
      try {
        setApproving(true);
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        const usdtContractAddress = process.env.REACT_APP_USDT_CONTRACTUSDT_ADDRESS;
        const walletAddress = process.env.REACT_APP_WALLETADMIN_ADDRESS;
        const usdtABI = JSON.parse(process.env.REACT_APP_USDT_ABI || '[]');

        const tokenContract = new web3.eth.Contract(usdtABI, usdtContractAddress);

        const amountInUSDT = web3.utils.toWei(totalUSDT.toString(), 'mwei'); 

        const gasPrice = await web3.eth.getGasPrice();
        const increasedGasPrice = BigInt(gasPrice) * BigInt(125) / BigInt(100);

        const gasEstimate = await tokenContract.methods
          .approve(walletAddress, amountInUSDT)
          .estimateGas({ from: userAddress });

        const increasedGasEstimate = gasEstimate * BigInt(120) / BigInt(100);

        // Aprobar la transferencia
        await tokenContract.methods
          .approve(walletAddress, amountInUSDT)
          .send({
            from: userAddress,
            gas: increasedGasEstimate.toString(),
            gasPrice: increasedGasPrice.toString(),
          })
          .on('receipt', () => {
            setAlertMessage('Aprobación realizada. Ahora puedes proceder con la compra.');
            setAlertSeverity('info');
            setAlertOpen(true);
            handleTransfer();
          });

        setApproving(false);
      } catch (error: any) {
        const errorMessage = error?.data?.message || 'Error al aprobar la compra. Revisa tu conexión con MetaMask.';
        setAlertMessage(errorMessage);
        setAlertSeverity('error');
        setAlertOpen(true);
        setApproving(false);
      }
    } else {
      setAlertMessage('MetaMask no está instalado. Por favor, instálalo para continuar.');
      setAlertSeverity('warning');
      setAlertOpen(true);
    }
  };

  // Función para realizar la transferencia de USDT
  const handleTransfer = async () => {
    if (window.ethereum) {
      try {
        setTransfering(true);
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        const usdtContractAddress = process.env.REACT_APP_USDT_CONTRACTUSDT_ADDRESS;
        const walletAddress = process.env.REACT_APP_WALLETADMIN_ADDRESS;
        const usdtABI = JSON.parse(process.env.REACT_APP_USDT_ABI || '[]');

        const tokenContract = new web3.eth.Contract(usdtABI, usdtContractAddress);

        const amountInUSDT = web3.utils.toWei(totalUSDT.toString(), 'mwei');

        const gasPrice = await web3.eth.getGasPrice();
        const increasedGasPrice = BigInt(gasPrice) * BigInt(125) / BigInt(100);

        const gasEstimate = await tokenContract.methods
          .transferFrom(userAddress, walletAddress, amountInUSDT)
          .estimateGas({ from: userAddress });

        const increasedGasEstimate = gasEstimate * BigInt(120) / BigInt(100);

        // Realizar la transferencia
        const tx = await tokenContract.methods
          .transferFrom(userAddress, walletAddress, amountInUSDT)
          .send({
            from: userAddress,
            gas: increasedGasEstimate.toString(),
            gasPrice: increasedGasPrice.toString(),
          });

        setAlertMessage('Compra realizada con éxito. Hash de transacción: ' + tx.transactionHash);
        setAlertSeverity('success');
        setAlertOpen(true);

        sendEmail(nombre, dni, email, totalUSDT, totalConAdicional, tx.transactionHash);
        setOpen(false);
        setTransfering(false);
      } catch (error: any) {
        const errorMessage = error?.data?.message || 'Error realizando la compra. Revisa tu conexión con MetaMask.';
        setAlertMessage(errorMessage);
        setAlertSeverity('error');
        setAlertOpen(true);
        setTransfering(false);
      }
    } else {
      setAlertMessage('MetaMask no está instalado. Por favor, instálalo para continuar.');
      setAlertSeverity('warning');
      setAlertOpen(true);
    }
  };

  // Función para enviar correo electrónico con EmailJS
  const sendEmail = (nombre: string, dni: string, email: string, total: string, totalConAdicional: string, transactionHash: string) => {
    const emailParams = {
      from_name: nombre,
      dni: dni,
      email: email,
      total_usdt: total,
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
        Comprar AT3 (USDT)
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

          {/* Botón para aprobar la transacción */}
          <Button
            variant="contained"
            onClick={handleApprove}
            disabled={approving}
            sx={{ mt: 3, backgroundColor: '#4CAF50', color: '#fff' }}
          >
            {approving ? 'Realizando operación...' : 'Peer to Peer'}
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
