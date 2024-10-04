// src/services/web3TokenService.ts
import Web3 from 'web3';

const CONTRACT_ADDRESS = '0x22a79a08ddb74a9f1a4ebe5da75300ad9f1aed76';
const CONTRACT_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

const web3 = new Web3(window.ethereum);

const web3TokenService = {
  async getTokenInfo() {
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    try {
      const name = await contract.methods.name().call();
      const symbol = await contract.methods.symbol().call();
      const decimals = Number(await contract.methods.decimals().call());
      
      // Verificar que totalSupplyRaw no sea vacío o nulo
      const totalSupplyRaw = await contract.methods.totalSupply().call();
      if (!totalSupplyRaw || Array.isArray(totalSupplyRaw) || typeof totalSupplyRaw !== 'string') {
        throw new Error('Valor inesperado para totalSupply.');
      }

      // Convertir totalSupplyRaw a número y aplicar decimales
      const totalSupply = (parseFloat(totalSupplyRaw) / 10 ** decimals).toFixed(2);

      return { name, symbol, decimals, totalSupply };
    } catch (error) {
      console.error('Error obteniendo información del token:', error);
      throw new Error('No se pudo obtener la información del token.');
    }
  },
};

export default web3TokenService;
