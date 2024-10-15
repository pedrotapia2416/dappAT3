import axios from 'axios';
import Web3 from 'web3';

const POLYGONSCAN_API_KEY = process.env.REACT_APP_POLYGONSCAN_API_KEY;
const CONTRACT_ADDRESS_STAKING = process.env.REACT_APP_CONTRACT_ADDRESS_STAKING;

const polygonScanService = {
  async getERC20Transfers() {
    const url = `https://api.polygonscan.com/api?module=account&action=tokentx&address=${CONTRACT_ADDRESS_STAKING}&sort=asc&apikey=${POLYGONSCAN_API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  },

  async getStakesByAddress(address: string): Promise<any[]> {
    const contractABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI || '[]');
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS_STAKING);

    try {
      const userStakes = await contract.methods.getUserStakes(address).call();
      return Array.isArray(userStakes)
        ? userStakes.map((stake: any) => ({
            amount: web3.utils.fromWei(BigInt(stake.amount).toString(), 'ether'),
            stakingDays: Number(stake.stakingDays),
            startTime: Number(stake.startTime),
            reward: web3.utils.fromWei(BigInt(stake.reward).toString(), 'ether'),
            active: stake.active,
          }))
        : [];
    } catch (error) {
      console.error('Error fetching stakes:', error);
      return [];
    }
  },
};

export default polygonScanService;
