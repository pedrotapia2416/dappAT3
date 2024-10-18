import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Typography, Box } from '@mui/material';

const AT3Balance: React.FC<{ account: string | null }> = ({ account }) => {
  const [balance, setBalance] = useState('0'); // Guardar el balance de AT3
  const tokenAddress = process.env.REACT_APP_CONTRACT_TOKEN; // Dirección del token AT3

  // Obtener el balance de AT3 del usuario
  const fetchUserBalance = async () => {
    try {
      if (window.ethereum && account) {
        const web3 = new Web3(window.ethereum);
  
        // Instanciar el contrato del token AT3
        const tokenContract = new web3.eth.Contract(
          [
            {
              constant: true,
              inputs: [{ name: "account", type: "address" }],
              name: "balanceOf",
              outputs: [{ name: "balance", type: "uint256" }],
              stateMutability: "view",
              type: "function",
            },
          ],
          tokenAddress
        );
  
        // Llamar a balanceOf para obtener el saldo
        const balanceInWei = await tokenContract.methods.balanceOf(account).call();
  
        // Verificar si el balance es válido y convertir de wei a ether
        if (balanceInWei && balanceInWei.toString) {
          const balanceInAT3 = web3.utils.fromWei(balanceInWei.toString(), 'ether'); // Convertir de wei a ether
          setBalance(balanceInAT3); // Guardar el balance en el estado
        } else {
          setBalance("0"); // Si no hay saldo, asignar 0
        }
      }
    } catch (error) {
      console.error("Error al obtener el balance:", error);
      setBalance("0"); // Asignar un valor predeterminado si ocurre un error
    }
  };

  // Llamar a fetchUserBalance cuando el componente se monte o cuando `account` cambie
  useEffect(() => {
    if (account) {
      fetchUserBalance();
    }
  }, [account]);

  return (
    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
      <Typography variant="body1" sx={{fontWeight:'600'}}>
        AT3: {balance}
      </Typography>
    </Box>
  );
};

export default AT3Balance;
