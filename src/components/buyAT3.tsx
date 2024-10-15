import React, { useState } from 'react';
import { Box, Button, Modal, Typography, TextField, Switch, FormControlLabel, Grid, FormGroup, Checkbox, Stepper, Step, StepLabel } from '@mui/material';
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
  const [pais, setPais] = useState('');
  const [telefono, setTelefono] = useState('');
  const [profesion, setProfesion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [dataConsent, setDataConsent] = useState(false);
  const [politicallyExposed, setPoliticallyExposed] = useState(false);
  const [uifObligated, setUifObligated] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [transfering, setTransfering] = useState(false);
  const [isAT3Mode, setIsAT3Mode] = useState(true); 
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Inversión/Compra', 'Datos Personales', 'Consentimientos'];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);


  
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

            sendEmail(
              nombre,
              dni,
              email,
              pais,
              telefono,
              profesion,
              direccion,
              totalUSDT,
              totalConAdicional,
              receipt.transactionHash,
              politicallyExposed,
              uifObligated
            );
            resetForm();
            setOpen(false);
          })
          .on('error', (error) => {
            console.error('Error en la transferencia:', error);
            const errorMessage = extractErrorMessage(error);
            setAlertSeverity('error');
            setAlertMessage(`Error: ${errorMessage}`);
            setAlertOpen(true);
          });
      } else {
        setAlertSeverity('error');
        setAlertMessage('MetaMask no está instalado. Por favor, instálalo para continuar.');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Error en la transferencia:', error);
      const errorMessage = extractErrorMessage(error);
      setAlertSeverity('error');
      setAlertMessage(`Error inesperado: ${errorMessage}`);
      setAlertOpen(true);
    } finally {
      setTransfering(false);
    }
  };

  const sendEmail = (
    nombre: string,
    dni: string,
    email: string,
    pais: string,
    telefono: string,
    profesion: string,
    direccion: string,
    totalUSDT: string,
    totalConAdicional: string,
    transactionHash: string,
    politicallyExposed: boolean,
    uifObligated: boolean
  ) => {
    const emailParams = {
      from_name: nombre,
      dni,
      email,
      pais,
      telefono,
      profesion,
      direccion,
      total_usdt: totalUSDT,
      total_con_adicional: totalConAdicional,
      transaction_hash: transactionHash,
      politically_exposed: politicallyExposed ? 'Sí' : 'No',
      uif_obligated: uifObligated ? 'Sí' : 'No',
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

  const extractErrorMessage = (error: any): string => {
    if (error?.data?.message) {
      return error.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'Error desconocido. Revisa la consola para más detalles.';
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Peer to Peer
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '8px', maxWidth: '800px', margin: 'auto', mt: 5 }}>
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={isAT3Mode}
                      onChange={() => setIsAT3Mode(!isAT3Mode)}
                    />
                  }
                  sx={{m:2}}
                  label={isAT3Mode ? 'Comprar AT3' : 'Invertir USDT'}
                />
                <TextField
                 sx={{m:2}}
                  label={isAT3Mode ? 'Cantidad de AT3' : 'Monto en USDT'}
                  value={isAT3Mode ? cantidadAT3 : montoUSDT}
                  onChange={(e) =>
                    isAT3Mode
                      ? setCantidadAT3(Number(e.target.value))
                      : setMontoUSDT(Number(e.target.value))
                  }
                  fullWidth
                  type="number"
                />
                <TextField label="Precio por AT3" sx={{m:2}} value={`$${precioPorAT3} USDT`} fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Total"  sx={{m:2}} value={`$${totalUSDT} USDT`} fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Vas a recibir (con 75% adicional)"  sx={{m:2}} value={`${totalConAdicional} AT3`} fullWidth InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Nombre" sx={{m:2}} value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth />
                <TextField label="DNI"  sx={{m:2}} value={dni} onChange={(e) => setDni(e.target.value)} fullWidth />
                <TextField label="Correo Electrónico"  sx={{m:2}} value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="País"  sx={{m:2}} value={pais} onChange={(e) => setPais(e.target.value)} fullWidth />
                <TextField label="Teléfono"  sx={{m:2}} value={telefono} onChange={(e) => setTelefono(e.target.value)} fullWidth />
                <TextField label="Profesión"  sx={{m:2}} value={profesion} onChange={(e) => setProfesion(e.target.value)} fullWidth />
                <TextField label="Dirección Fiscal"  sx={{m:2}} value={direccion} onChange={(e) => setDireccion(e.target.value)} fullWidth />
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <FormGroup  sx={{mt:5}}>
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={handleBack} disabled={activeStep === 0}>Atrás</Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleTransfer} disabled={transfering}>
                {transfering ? 'Transfiriendo...' : 'Finalizar'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>Siguiente</Button>
            )}
          </Box>
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
