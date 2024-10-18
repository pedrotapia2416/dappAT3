import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Modal } from '@mui/material';
import emailjs from 'emailjs-com';
import AlertModal from '../../components/AlertModal';
import stakingImage from '../../assets/images/staking.jpeg';
import linesImage from '../../assets/images/lineas.png';
import { useNavigate } from 'react-router-dom';

const StakingPlus: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    idDocument: '',
    purchaseDate: '',
    transactionNumber: '',
    email: '',
    emailConfirmation: '',
    phone: '',
    at3Amount: '',
    quickswapHash: '', 
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [imageModalOpen, setImageModalOpen] = useState(false); 

  const navigate = useNavigate(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (date: string): string => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.email !== formData.emailConfirmation) {
      setEmailError('Los correos electrónicos no coinciden');
      return;
    }

    if (!formData.quickswapHash) {
      setAlertSeverity('warning');
      setAlertMessage('El campo "Hash Transacción de Compra AT3 en QuickSwap" es obligatorio.');
      setAlertOpen(true);
      return;
    }

    setEmailError(null);
    const numeroSolicitud = `SP-${Date.now()}`;
    const dataToSend = {
      ...formData,
      purchaseDate: formatDate(formData.purchaseDate),
      solicitudNumber: numeroSolicitud,
    };


    emailjs.send('service_mn0qbtj', 'template_2q3nxeo', dataToSend, 'uJWGoBXmCBWYLpGfC')
      .then((response) => {
        setAlertSeverity('info');
        setAlertMessage(`Solicitud Staking Plus 5% Número: ${numeroSolicitud}`);
        setAlertOpen(true);
      }, (error) => {
        setAlertSeverity('error');
        setAlertMessage('Error al enviar la solicitud. Inténtalo nuevamente.');
        setAlertOpen(true);
      });
  };

  const openImageModal = () => setImageModalOpen(true);
  const closeImageModal = () => setImageModalOpen(false);

  const handleRedirectToQuickswap = () => {
    window.open('https://quickswap.exchange/#/swap?swapIndex=0&currency0=ETH&currency1=0x22a79a08ddb74A9F1A4eBE5da75300Ad9f1AED76', '_blank');
  };

  const handleRedirectToHome = () => {
    navigate('/');
  };

  return (
    
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: { xs: '100vh', md: '80vh' }, 
        margin: { xs: -10, md: 2 },
        borderRadius: { xs: '0px', md: '100px' },
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
      
      <Grid container sx={{ maxWidth: '1200px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
      
        {/* Columna izquierda con la imagen */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
            }}
          >
            <img
              src={stakingImage}
              alt="Staking"
              style={{
                width: '100%',
                maxWidth: '500px', 
                objectFit: 'contain',
                borderRadius: '20px',
                cursor: 'pointer',
              }}
              onClick={openImageModal} 
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box sx={{display:'flex'}}>
           
              <Button
                variant="contained"
                color="secondary"
                sx={{ mb: 2, }}
                onClick={handleRedirectToHome}
              >
                Volver al inicio
              </Button>
              
            </Box>
            <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>Staking Plus 5%</Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nombre y Apellido"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Documento de Identificación"
                    name="idDocument"
                    value={formData.idDocument}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Hash Compra en QuickSwap"
                    name="quickswapHash"
                    value={formData.quickswapHash}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>


                <Grid item xs={12} md={6}>
                  <TextField
                    label="Fecha de Compra"
                    name="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Hash Staking"
                    name="transactionNumber"
                    value={formData.transactionNumber}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Correo Electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Confirmar Correo Electrónico"
                    name="emailConfirmation"
                    value={formData.emailConfirmation}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    error={!!emailError}
                    helperText={emailError}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Teléfono de Contacto"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Cantidad de AT3 Comprados"
                    name="at3Amount"
                    value={formData.at3Amount}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2 }}
                fullWidth
              >
                Enviar
              </Button>
            </form>

            <AlertModal
              open={alertOpen}
              severity={alertSeverity}
              message={alertMessage}
              onClose={() => setAlertOpen(false)}
            />
          </Box>
        </Grid>
      </Grid>

      <Modal open={imageModalOpen} onClose={closeImageModal}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            p: 2,
          }}
        >
          <img
            src={stakingImage}
            alt="Staking"
            style={{
              width: '100%',
              maxWidth: '800px',
              objectFit: 'contain',
              borderRadius: '20px',
              marginBottom: '20px',
            }}
          />
         


          
        </Box>
      </Modal>
    </Box>
  );
};

export default StakingPlus;
