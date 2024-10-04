// src/services/polygonTokenService.ts
import axios from 'axios';

const POLYGONSCAN_API_KEY = process.env.REACT_APP_POLYGONSCAN_API_KEY;
const CONTRACT_ADDRESS = '0x22a79a08ddb74a9f1a4ebe5da75300ad9f1aed76';

const polygonTokenService = {
  async getTokenInfo() {
    const url = `https://api.polygonscan.com/api?module=token&action=tokeninfo&contractaddress=${CONTRACT_ADDRESS}&apikey=${POLYGONSCAN_API_KEY}`;
    const response = await axios.get(url);
    return response.data.result;
  },

  async getTokenHolders() {
    const url = `https://api.polygonscan.com/api?module=token&action=tokenholderlist&contractaddress=${CONTRACT_ADDRESS}&apikey=${POLYGONSCAN_API_KEY}`;
    const response = await axios.get(url);
    return response.data.result;
  },

  async getTokenTransfers() {
    const url = `https://api.polygonscan.com/api?module=account&action=tokentx&contractaddress=${CONTRACT_ADDRESS}&sort=desc&apikey=${POLYGONSCAN_API_KEY}`;
    const response = await axios.get(url);
    return response.data.result;
  },
};

export default polygonTokenService;
