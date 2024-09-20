import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

const Admin: React.FC = () => {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const web3 = new Web3(window.ethereum);

        // Cargar variables de entorno
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        const contractABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI || '[]');

        if (!contractAddress || !contractABI) {
          console.error('Missing contract address or ABI');
          return;
        }

        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Obtener cuentas y forzar que sea un array de strings
        const accounts: string[] = (await web3.eth.getAccounts()) as string[];

        if (accounts && accounts.length > 0) {
          // Obtener el propietario del contrato
          const owner: string = await contract.methods.owner().call();
          
          // Comparar la primera cuenta con el owner
          setIsOwner(accounts[0] === owner);
        } else {
          console.error('No accounts found');
        }
      } catch (error) {
        console.error('Error checking owner:', error);
      }
    };

    checkOwner();
  }, []);

  return (
    <div>
      {isOwner ? <div>Owner Panel: View all stakes, etc.</div> : <div>Access Denied</div>}
    </div>
  );
};

export default Admin;
