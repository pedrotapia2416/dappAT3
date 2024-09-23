import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';
import emailjs from 'emailjs-com';
import AlertModal from '../components/AlertModal';

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
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');

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

  return (
    <Box
      sx={{
        maxWidth: '800px',
        margin: 'auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>Staking Plus 5%</Typography>
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
              label="Número de Transacción"
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
  );
};

export default StakingPlus;
