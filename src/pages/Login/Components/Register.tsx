import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material';
const Register: React.FC = () => {
    const [isCompany, setIsCompany] = useState(false);
    const [step, setStep] = useState(1);
  
    const handleNextStep = () => setStep(prev => prev + 1);
    const handlePrevStep = () => setStep(prev => prev - 1);
    const handleSelectType = (type: string) => {
      setIsCompany(type === 'company');
      setStep(2);
    };
  
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 700 }}> {/* Ancho aumentado */}
        {step === 1 && (
          <>
            <Typography variant="h6" gutterBottom>
              ¿Eres una Empresa o una Persona Física?
            </Typography>
            <Button variant="outlined" onClick={() => handleSelectType('company')} sx={{ mb: 2 }}>
              Empresa
            </Button>
            <Button variant="outlined" onClick={() => handleSelectType('person')} sx={{ mb: 2 }}>
              Persona Física
            </Button>
          </>
        )}
  
        {/* Si se selecciona Empresa */}
        {isCompany && step > 1 && (
          <>
            {step === 2 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Datos de la Empresa
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}> {/* Layout de dos columnas */}
                  <TextField label="País de constitución" variant="outlined" fullWidth />
                  <TextField label="Domicilio Fiscal" variant="outlined" fullWidth />
                  <TextField label="Razón Social" variant="outlined" fullWidth />
                  <TextField label="Nombre y Apellido del Representante Legal" variant="outlined" fullWidth />
                  <TextField label="Nro de Identificación Tributaria" variant="outlined" fullWidth />
                  <TextField label="Nro de Teléfono" variant="outlined" fullWidth />
                  <TextField label="Correo Electrónico" variant="outlined" fullWidth />
                  <TextField label="Contraseña" type="password" variant="outlined" fullWidth />
                  <TextField label="Repetir Contraseña" type="password" variant="outlined" fullWidth />
                </Box>
              </>
            )}
            {step === 3 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Documentación Anexa
                </Typography>
                <Button variant="contained" component="label">
                  Subir documentación de Inscripción Impositiva
                  <input type="file" hidden />
                </Button>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Por favor, sube tu inscripción impositiva como archivo PDF o imagen clara.
                </Typography>
              </>
            )}
            {step === 4 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Aceptación de Condiciones
                </Typography>
                <FormControlLabel control={<Checkbox />} label="Acepto los términos y condiciones" />
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Crear Cuenta
                </Button> {/* Botón Crear Cuenta solo aparece aquí */}
              </>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button variant="outlined" onClick={handlePrevStep} disabled={step === 2}>
                Volver
              </Button>
              <Button variant="contained" onClick={handleNextStep} disabled={step === 4}>
                Siguiente
              </Button>
            </Box>
          </>
        )}
  
        {/* Si se selecciona Persona Física */}
        {!isCompany && step > 1 && (
          <>
            {step === 2 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Datos del Individuo
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}> {/* Layout de dos columnas */}
                  <TextField label="País" variant="outlined" fullWidth />
                  <TextField label="Domicilio Fiscal" variant="outlined" fullWidth />
                  <TextField label="Nombre y Apellido" variant="outlined" fullWidth />
                  <TextField label="Nro de Identificación Tributaria" variant="outlined" fullWidth />
                  <TextField label="Nro de Teléfono" variant="outlined" fullWidth />
                  <TextField label="Correo Electrónico" variant="outlined" fullWidth />
                  <TextField label="Contraseña" type="password" variant="outlined" fullWidth />
                  <TextField label="Repetir Contraseña" type="password" variant="outlined" fullWidth />
                </Box>
              </>
            )}
            {step === 3 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Documentación Anexa
                </Typography>
                <Button variant="contained" component="label">
                  Subir Imagen DNI Frente
                  <input type="file" hidden />
                </Button>
                <Button variant="contained" component="label" sx={{ mt: 2 }}>
                  Subir Imagen DNI Dorso
                  <input type="file" hidden />
                </Button>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Asegúrate de que las imágenes sean claras y en formato PNG o JPG.
                </Typography>
              </>
            )}
            {step === 4 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Aceptación de Condiciones
                </Typography>
                <FormControlLabel control={<Checkbox />} label="Soy una persona políticamente expuesta" />
                <FormControlLabel control={<Checkbox />} label="Soy obligado ante la UIFF" />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Soy mayor de edad y acepto los términos y condiciones"
                />
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Crear Cuenta
                </Button> {/* Botón Crear Cuenta solo aparece aquí */}
              </>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button variant="outlined" onClick={handlePrevStep} disabled={step === 2}>
                Volver
              </Button>
              <Button variant="contained" onClick={handleNextStep} disabled={step === 4}>
                Siguiente
              </Button>
            </Box>
          </>
        )}
      </Box>
    );
  };
  
  export default Register;
  