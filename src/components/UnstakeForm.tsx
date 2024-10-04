import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody } from '@mui/material';
import Web3 from 'web3';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';

const UnstakeForm: React.FC = () => {
  const [stakes, setStakes] = useState<any[]>([]); 
  const [balance, setBalance] = useState(''); 
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS_STAKING;
  const contractABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI || '[]');
  const tokenAddress = process.env.REACT_APP_CONTRACT_TOKEN;  


  const fetchUserStakes = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        // Obtener los stakes del usuario
        const stakingContract = new web3.eth.Contract(contractABI, contractAddress);
        const userStakes = await stakingContract.methods.getUserStakes(userAddress).call();
        const validUserStakes = Array.isArray(userStakes) ? userStakes : [];

        // Mapeo y formato de los datos obtenidos
        const formattedStakes = validUserStakes.map((stake: any, index: number) => ({
          index,
          amount: web3.utils.fromWei(stake.amount.toString(), 'ether'),
          stakingDays: Number(stake.stakingDays),
          startTime: new Date(Number(stake.startTime) * 1000).toLocaleString(),
          reward: web3.utils.fromWei(stake.reward.toString(), 'ether'),
          active: stake.active,
        }));

        setStakes(formattedStakes); 
      } else {
        alert("MetaMask no está instalado. Por favor, instálalo para continuar.");
      }
    } catch (error) {
      console.error("Error al obtener los stakes:", error);
    }
  };

  // Obtener el balance de AT3 del usuario
  const fetchUserBalance = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        // Instanciar el contrato del token AT3
        const tokenContract = new web3.eth.Contract([
          {
            "constant": true,
            "inputs": [{ "name": "account", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "name": "balance", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
          }
        ], tokenAddress);

        // Llamar a balanceOf para obtener el saldo
        const balanceInWei = await tokenContract.methods.balanceOf(userAddress).call();

        // Verificar si el balance es válido y convertir de wei a ether
        if (balanceInWei) {
          const balanceInAT3 = web3.utils.fromWei(balanceInWei.toString(), 'ether'); // Convertir de wei a ether
          setBalance(balanceInAT3); // Guardar el balance en el estado
        } else {
          setBalance("0"); 
        }
      }
    } catch (error) {
      console.error("Error al obtener el balance:", error);
      setBalance("0"); 
    }
  };

  // Llamar a fetchUserStakes y fetchUserBalance cuando el modal se abra
  useEffect(() => {
    if (open) {
      fetchUserStakes();
      fetchUserBalance();
    }
  }, [open]);

  const handleUnstake = async (stakeIndex: number) => {
    setLoading(true);
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        const stakingContract = new web3.eth.Contract(contractABI, contractAddress);
        const tx = await stakingContract.methods.unstake(stakeIndex).send({ from: userAddress });

        console.log("Unstake completado:", tx);
        alert("Unstake realizado con éxito");
        setStakes(stakes.filter((_, i) => i !== stakeIndex));
      }
    } catch (error) {
      console.error("Error realizando el unstake:", error);
      alert("Hubo un error al realizar el unstake. Por favor, revisa los datos y vuelve a intentarlo.");
    }
    setLoading(false);
  };

  return (
    <>
      <Button 
      sx={{
        backgroundColor: 'white',
        borderRadius: '40px',
        padding: '10px 20px',
        '&:hover': {
          backgroundColor: '#f0f0f0',
          textAlign:'left',

        width:'100%'
        },
      }}
      onClick={() => setOpen(true)}>

        Unstake Tokens
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '8px', maxWidth: '800px', margin: 'auto', mt: 5 }}>
          <Typography variant="h6">Stakes Activos</Typography>


          {stakes.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Días de Staking</TableCell>
                    <TableCell>Fecha de Inicio</TableCell>
                    <TableCell>Recompensa</TableCell>
                    <TableCell>Activo</TableCell>
                    <TableCell>Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stakes.map((stake, index) => (
                    <TableRow key={index}>
                      <TableCell>{stake.amount} AT3</TableCell>
                      <TableCell>{stake.stakingDays}</TableCell>
                      <TableCell>{stake.startTime}</TableCell>
                      <TableCell>{stake.reward} AT3</TableCell>
                      <TableCell>{stake.active ? 'Sí' : 'No'}</TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => handleUnstake(stake.index)}
                          disabled={!stake.canUnstake || loading} 
                          sx={{ mt: 2 }}
                        >
                          Unstake
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No tienes stakes activos.</Typography>
          )}

          <Button variant="contained" onClick={() => setOpen(false)} sx={{ mt: 4 }}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default UnstakeForm;
