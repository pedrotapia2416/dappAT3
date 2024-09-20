import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Typography, Box } from '@mui/material';

const StakedBalance: React.FC<{ account: string | null }> = ({ account }) => {
  const [totalStaked, setTotalStaked] = useState('0'); // Guardar el total en stake
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contractABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI || '[]');

  // Obtener los stakes del usuario y sumar los montos
  const fetchUserStakes = async () => {
    try {
      if (window.ethereum && account) {
        const web3 = new Web3(window.ethereum);
  
        // Obtener los stakes del usuario desde el contrato de staking
        const stakingContract = new web3.eth.Contract(contractABI, contractAddress);
        const userStakes = await stakingContract.methods.getUserStakes(account).call();
  
        // Verificar si `userStakes` es un array antes de llamar a `reduce`
        if (Array.isArray(userStakes)) {
          // Sumar los montos de todos los stakes
          const totalInWei = userStakes.reduce((acc: any, stake: any) => {
            return acc + BigInt(stake.amount); // Usar BigInt para manejar grandes cantidades
          }, BigInt(0));
  
          // Convertir de wei a AT3
          const totalInAT3 = web3.utils.fromWei(totalInWei.toString(), 'ether');
          setTotalStaked(totalInAT3); // Guardar el total en stake en el estado
        } else {
          // Si no es un array, asignar 0 como fallback
          setTotalStaked("0");
        }
      }
    } catch (error) {
      console.error('Error al obtener los stakes:', error);
      setTotalStaked('0'); // Si ocurre un error, asignar 0
    }
  };

  // Llamar a fetchUserStakes cuando el componente se monte o cuando `account` cambie
  useEffect(() => {
    if (account) {
      fetchUserStakes();
    }
  }, [account]);

  return (
    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
       <Typography variant="body1" sx={{fontWeight:'600'}}>
         En Stake: {totalStaked} AT3
      </Typography>
    </Box>
  );
};

export default StakedBalance;
