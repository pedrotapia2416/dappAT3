import React, { useState } from 'react';
import { Button, TextField, Modal, Box, MenuItem, Select } from '@mui/material';
import Web3 from 'web3';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AlertModal from './AlertModal'; 

const StakeForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [days, setDays] = useState(60); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState('');
  const [open, setOpen] = useState(false);

  // Estados para el AlertModal
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  // Estados para manejar la aprobación y staking por separado
  const [canStake, setCanStake] = useState(false); 
  const [approving, setApproving] = useState(false);

  // Variables del contrato
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; 
  const contractABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI || '[]'); 
  const tokenAddress = process.env.REACT_APP_CONTRACT_TOKEN; 

  const resetForm = () => {
    setAmount('');
    setDays(60); 
    setName('');
    setEmail('');
    setDocument('');
    setCanStake(false); 
  };

  //Aprobación del contrato
  const handleApprove = async () => {
    if (!amount || !name || !email || !document) {
      setAlertSeverity('warning');
      setAlertMessage("Todos los campos son obligatorios");
      setAlertOpen(true);
      return;
    }

    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];
        const amountInWei = web3.utils.toWei(amount, 'ether');

        const tokenContract = new web3.eth.Contract([
          {
            "constant": true,
            "inputs": [
              { "name": "spender", "type": "address" },
              { "name": "amount", "type": "uint256" }
            ],
            "name": "approve",
            "outputs": [{ "name": "", "type": "bool" }],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ], tokenAddress);

        setApproving(true); 
        setCanStake(true);
        setAlertSeverity('info');
        setAlertMessage("Este proceso puede demorar unos minutos, recomendamos verificar la aprobación en Metamask, y luego relizar el staking");
        setAlertOpen(true);
        
        await tokenContract.methods.approve(contractAddress, amountInWei).send({ from: userAddress });

        // Mostrar éxito de la aprobación
        setAlertSeverity('info');
        setAlertMessage("Tokens aprobados. Ahora puedes realizar el stake.");
        setAlertOpen(true);

        // Habilitar el staking
        setApproving(false);
      } else {
        setAlertSeverity('error');
        setAlertMessage("MetaMask no está instalado. Por favor, instálalo para continuar.");
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Error realizando la aprobación:", error);
      setApproving(false);
      setAlertSeverity('error');
      setAlertMessage("Error durante la aprobación. Verifica MetaMask e inténtalo nuevamente.");
      setAlertOpen(true);
    }
  };

  // Realizar el staking después de la aprobación
  const handleStake = async () => {
    if (!canStake) {
      setAlertSeverity('warning');
      setAlertMessage("Primero debes aprobar la transacción antes de realizar el stake.");
      setAlertOpen(true);
      return;
    }

    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];
        const amountInWei = web3.utils.toWei(amount, 'ether');

        const stakingContract = new web3.eth.Contract(contractABI, contractAddress);
        const tx = await stakingContract.methods.stake(amountInWei, days, name, email, document).send({ from: userAddress });

        console.log("Transacción de Staking completada:", tx);
        setAlertSeverity('success');
        setAlertMessage("Staking realizado con éxito");
        setAlertOpen(true);
        setOpen(false);
        setCanStake(false); 
      }
    } catch (error) {
      console.error("Error realizando staking:", error);
      setAlertSeverity('error');
      setAlertMessage("Hubo un error al realizar el staking. Revisa los datos y vuelve a intentarlo.");
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Button 
        sx={{
          backgroundColor: 'white',
          borderRadius: '40px',
          padding: '10px 100px',
          '&:hover': {
            backgroundColor: '#f0f0f0',
            width: '100%'
          },
        }}
        onClick={() => setOpen(true)}
      >
        Stake Tokens
      </Button>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '8px', maxWidth: '400px', margin: 'auto', mt: 5 }}>
          <TextField
            label="Cantidad de AT3"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Select
            label="Días de Staking"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            fullWidth
          >
            <MenuItem value={60}>60 días - 19% recompensa</MenuItem>
            <MenuItem value={180}>180 días - 14% recompensa</MenuItem>
            <MenuItem value={240}>240 días - 10% recompensa</MenuItem>
          </Select>
          <TextField
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Documento de Identificación"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            fullWidth
            margin="normal"
          />

 
          <Button variant="contained" onClick={handleApprove} sx={{ mt: 2 }} disabled={approving}>
            {approving ? 'Aprobando...' : 'Aprobar Tokens'}
          </Button>

          <Button variant="contained" onClick={handleStake} sx={{ mt: 2 }} disabled={!canStake}>
            Realizar Stake
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

export default StakeForm;
