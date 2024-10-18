import React, { useState } from 'react';
import { Tooltip, IconButton, Button, TextField, Modal, Box, MenuItem, Select, FormGroup, FormControlLabel, Checkbox, Grid, Stepper, Step, StepLabel } from '@mui/material';
import Web3 from 'web3';
import AlertModal from '../AlertModal'; 
import emailjs from 'emailjs-com';

const StakeForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [days, setDays] = useState(60);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState(''); 
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [addressFiscal, setAddressFiscal] = useState('');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState('');
  const [dataConsent, setDataConsent] = useState(false);
  const [politicallyExposed, setPoliticallyExposed] = useState(false);
  const [uifObligated, setUifObligated] = useState(false);
  const [open, setOpen] = useState(false);
  const [approving, setApproving] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [alertClosable, setAlertClosable] = useState(false);

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS_STAKING; 
  const contractABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI || '[]'); 
  const tokenAddress = process.env.REACT_APP_CONTRACT_TOKEN; 
  
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Cantidad y Días', 'Datos Personales', 'Consentimientos'];

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);


  const resetForm = () => {
    setAmount('');
    setDays(60);
    setName('');
    setEmail('');
    setDocument('');
    setCountry('');
    setState('');
    setAddress('');
    setAddressFiscal('');
    setPhone('');
    setProfession('');
    setDataConsent(false);
    setPoliticallyExposed(false);
    setUifObligated(false);
  };

  const handleTransaction = async () => {
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
        setAlertSeverity('info');
        setAlertMessage("Validando operación...\nDebe aprobar la operación en Metamask");
        setAlertOpen(true);
        setAlertClosable(false);

        const gasPrice = await web3.eth.getGasPrice();
        const increasedGasPrice = BigInt(gasPrice) * BigInt(125) / BigInt(100);

        const gasEstimate = await tokenContract.methods
          .approve(contractAddress, amountInWei)
          .estimateGas({ from: userAddress });

        const increasedGasEstimate = gasEstimate * BigInt(120) / BigInt(100);
        await tokenContract.methods
          .approve(contractAddress, amountInWei)
          .send({
            from: userAddress,
            gas: increasedGasEstimate.toString(),
            gasPrice: increasedGasPrice.toString(),
          })
          .on('receipt', async () => {
            setAlertSeverity('success');
            setAlertMessage("Operación Validada.\nRealizando staking... .\nConfirmar la operación en Metamask");
            setAlertOpen(true);
            setAlertClosable(false);
            await handleStake(userAddress, amountInWei, increasedGasPrice);
          })
          .on('error', (error) => {
            console.error("Error en la validación:", error);
            setAlertSeverity('error');
            setAlertMessage("Error en la validación. Inténtalo de nuevo.");
            setAlertOpen(true);
            setAlertClosable(true);
            setApproving(false);
          });
      } else {
        setAlertSeverity('error');
        setAlertMessage("MetaMask no está instalado. Por favor, instálalo para continuar.");
        setAlertOpen(true);
        setAlertClosable(true);
      }
    } catch (error) {
      console.error("Error capturado:", error);
      setAlertSeverity('error');
      setAlertMessage("Error inesperado. Inténtalo de nuevo.");
      setAlertOpen(true);
      setApproving(false);
    }
  };

  const handleStake = async (userAddress: string, amountInWei: string, increasedGasPrice: bigint) => {
    try {
      const web3 = new Web3(window.ethereum);
      const stakingContract = new web3.eth.Contract(contractABI, contractAddress);

      const gasEstimate = await stakingContract.methods
        .stake(amountInWei, days, name, email, document)
        .estimateGas({ from: userAddress });

      const increasedGasEstimate = gasEstimate * BigInt(120) / BigInt(100);

      await stakingContract.methods
        .stake(amountInWei, days, name, email, document)
        .send({
          from: userAddress,
          gas: increasedGasEstimate.toString(),
          gasPrice: increasedGasPrice.toString(),
        })
        .on('receipt', (receipt) => {
          const transactionHash = receipt.transactionHash;
          setAlertSeverity('success');
          setAlertMessage(`Staking realizado con éxito.\nHash de la transacción: ${receipt.transactionHash}.\nTe llegará un email con los detalles.`);
          setAlertOpen(true);
          setAlertClosable(true);
          setOpen(false);
          resetForm();
          setApproving(false);
          sendEmail(transactionHash, userAddress);
        })
        .on('error', (error) => {
          console.error("Error realizando staking:", error);
          setAlertSeverity('error');
          setAlertMessage("Error en el staking. Inténtalo de nuevo.");
          setAlertOpen(true);
          setAlertClosable(true);
          setApproving(false);
        });
    } catch (error) {
      console.error("Error capturado en staking:", error);
      setAlertSeverity('error');
      setAlertMessage("Error inesperado durante el staking.");
      setAlertOpen(true);
      setAlertClosable(false);
      setApproving(false);
    }
  };

   const sendEmail = (transactionHash: string,  userAddress: string) => {
    const dataStaking = {
      name,
      email,
      amount,
      days,
      document,
      country,
      state,
      address,
      addressFiscal,
      phone,
      profession,
      politicallyExposed,
      uifObligated,
      transactionHash,
      userAddress,
    };

    emailjs.send('service_mn0qbtj', 'template_s7tm63d', dataStaking, 'uJWGoBXmCBWYLpGfC')
      .then((response) => {
        console.log('Email enviado correctamente:', response.status, response.text);
      })
      .catch((error) => {
        console.error('Error al enviar el email:', error);
      });
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

      <Modal open={open} onClose={() => setOpen(false)} disableEscapeKeyDown>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '8px', maxWidth: '700px', margin: 'auto', mt: 15 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Cantidad de AT3"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth margin="normal"
                />
                <Select value={days} onChange={(e) => setDays(Number(e.target.value))} fullWidth >
                  <MenuItem value={60}>60 días - 19% recompensa</MenuItem>
                  <MenuItem value={180}>180 días - 14% recompensa</MenuItem>
                  <MenuItem value={240}>240 días - 10% recompensa</MenuItem>
                </Select>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
                <TextField label="Apellido" value={lastName} onChange={e => setLastName(e.target.value)} fullWidth />
                <TextField label="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
                <TextField label="Documento" value={document} onChange={(e) => setDocument(e.target.value)} fullWidth margin="normal" />
              </Grid>
              <Grid item xs={6}>
                <TextField label="País" value={country} onChange={(e) => setCountry(e.target.value)} fullWidth margin="normal" />
                <TextField label="Domicilio Fiscal" value={addressFiscal} onChange={e => setAddressFiscal(e.target.value)} fullWidth />
                <TextField label="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth margin="normal" />
                <TextField label="Profesión" value={profession} onChange={(e) => setProfession(e.target.value)} fullWidth margin="normal" />
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={dataConsent} onChange={(e) => setDataConsent(e.target.checked)} />}
                label="Acepto que los datos son fieles y no he omitido información relevante."
              />
              <FormControlLabel
                control={<Checkbox checked={politicallyExposed} onChange={(e) => setPoliticallyExposed(e.target.checked)} />}
                label="Soy persona políticamente expuesta."
              />
              <FormControlLabel
                control={<Checkbox checked={uifObligated} onChange={(e) => setUifObligated(e.target.checked)} />}
                label="Estoy obligado ante la UIF."
              />
            </FormGroup>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={handleBack} disabled={activeStep === 0}>Atrás</Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleTransaction} disabled={approving}>
                {approving ? 'Procesando...' : 'Staking'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>Siguiente</Button>
            )}
          </Box>
        </Box>
      </Modal>


      <AlertModal
        open={alertOpen}
        severity={alertSeverity}
        message={alertMessage}
        onClose={() => setAlertOpen(false)} 
        disableEscapeKeyDown={!alertClosable} 
      />

    </>
  );
};

export default StakeForm;
