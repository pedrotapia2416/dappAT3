import React, { useState } from 'react';
import { Button, TextField, Modal, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Web3 from 'web3';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AlertModal from './AlertModal'; 

type Stake = {
  amount: string;
  stakingDays: number;
  startTime: number;
  reward: string;
  name: string;
  email: string;
  document: string;
  active: boolean;
};

const GetStakeForm: React.FC = () => {
  const [userAddress, setUserAddress] = useState('');
  const [stakes, setStakes] = useState<Stake[]>([]); 
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info'); 

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contractABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI || '[]');

  const handleGetStakes = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
  
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const userStakes = await contract.methods.getUserStakes(userAddress).call();
  
        if (Array.isArray(userStakes)) {
          const formattedStakes: Stake[] = userStakes.map((stake: any) => ({
            amount: web3.utils.fromWei(BigInt(stake.amount).toString(), 'ether'),
            stakingDays: Number(stake.stakingDays),
            startTime: Number(stake.startTime),
            reward: web3.utils.fromWei(BigInt(stake.reward).toString(), 'ether'),
            name: stake.name,
            email: stake.email,
            document: stake.document,
            active: stake.active,
          }));
          setStakes(formattedStakes);
        } else {
          throw new Error("Invalid result from getUserStakes");
        }
      } else {
        throw new Error("MetaMask no está instalado.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setAlertMessage(error.message);
      } else {
        setAlertMessage("Ocurrió un error desconocido.");
      }
      setAlertSeverity('error');
      setAlertOpen(true); 
    }
  };
  

  return (
    <>
      <Button sx={{
            textAlign: 'left',
            backgroundColor: 'white',
            borderRadius: '40px',
            padding: '10px 20px',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        onClick={() => setOpen(true)}>
        Consultar Stakes
      </Button>

      {/* Modal para consultar stakes */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '8px', maxWidth: '800px', margin: 'auto', mt: 5 }}>
          <Typography variant="h6">Consultar Stakes</Typography>
          <TextField
            label="Dirección de billetera"
            fullWidth
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" onClick={handleGetStakes} sx={{ mt: 2 }}>
            Obtener Stakes
          </Button>

          {stakes.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Resultados de los Stakes:</Typography>

              {/* Tabla de resultados de los stakes */}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Días de Staking</TableCell>
                    <TableCell>Fecha de Inicio</TableCell>
                    <TableCell>Recompensa</TableCell>
                    <TableCell>Activo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stakes.map((stake, index) => (
                    <TableRow key={index}>
                      <TableCell>{stake.amount} Tokens</TableCell>
                      <TableCell>{stake.stakingDays}</TableCell>
                      <TableCell>{new Date(stake.startTime * 1000).toLocaleString()}</TableCell>
                      <TableCell>{stake.reward} Tokens</TableCell>
                      <TableCell>{stake.active ? 'Sí' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Modal>

      {/* AlertModal para mostrar mensajes de error o éxito */}
      <AlertModal
        open={alertOpen}
        severity={alertSeverity}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
};

export default GetStakeForm;
