import React from 'react';
import { Box, Typography, Modal, IconButton, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { green, red, orange, blue } from '@mui/material/colors';

interface AlertModalProps {
  open: boolean;
  severity: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
  disableEscapeKeyDown?: boolean; // Esta propiedad ya es parte del Modal
}

const AlertModal: React.FC<AlertModalProps> = ({ open, severity, message, onClose, disableEscapeKeyDown = false }) => {
  const getColorAndIcon = () => {
    switch (severity) {
      case 'success':
        return { color: green[600], icon: <CheckCircleIcon sx={{ fontSize: '60px' }} /> };
      case 'error':
        return { color: red[600], icon: <ErrorIcon sx={{ fontSize: '60px' }} /> };
      case 'warning':
        return { color: orange[600], icon: <WarningIcon sx={{ fontSize: '60px' }} /> };
      case 'info':
        return { color: blue[600], icon: <InfoIcon sx={{ fontSize: '60px' }} /> };
      default:
        return { color: blue[600], icon: <InfoIcon sx={{ fontSize: '60px' }} /> };
    }
  };

  const { color, icon } = getColorAndIcon();

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose();
        }
      }}
      disableEscapeKeyDown={disableEscapeKeyDown} 
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          maxWidth: '60%',
          width: '500px',
          margin: 'auto',
          mt: '10%',
          borderTop: `8px solid ${color}`, 
        }}
      >
        <IconButton sx={{ color, fontSize: '160px' }}>{icon}</IconButton>
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 2, 
            wordWrap: 'break-word', 
            maxWidth: '100%' 
          }}
        >
          {message}
        </Typography>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{ 
            mt: 2, 
            background: `linear-gradient(45deg, ${color}, ${color})`, 
            '&:hover': {
              background: `linear-gradient(45deg, ${color}, ${color})`,
            },
            color: 'white',
            borderRadius: '20px',
          }}
        >
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default AlertModal;
