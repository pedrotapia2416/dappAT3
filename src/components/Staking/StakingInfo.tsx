import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import polygonScanService from '../../services/polygonScanService';

interface ERC20Transfer {
  from: string;
  to: string;
  value: string;
  tokenSymbol: string;
  timeStamp: string;
}

interface StakeInfo {
  amount: string;
  stakingDays: number;
  startTime: number;
  reward: string;
}

const StakingInfo: React.FC = () => {
  const [transfers, setTransfers] = useState<ERC20Transfer[]>([]);
  const [stakingInfo, setStakingInfo] = useState<{ [address: string]: StakeInfo[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [searchAddress, setSearchAddress] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [transfersPerPage, setTransfersPerPage] = useState<number>(5);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const fetchERC20Transfers = async () => {
      try {
        setLoading(true);
        const transferResponse = await polygonScanService.getERC20Transfers();
        if (transferResponse.status === '1') {
          const transfersData = transferResponse.result;
          setTransfers(transfersData);

          for (const transfer of transfersData) {
            const stakeData = await polygonScanService.getStakesByAddress(transfer.from);

            if (stakeData.length > 0) {
              setStakingInfo(prevState => ({
                ...prevState,
                [transfer.from]: stakeData,
              }));
            } else {
              setStakingInfo(prevState => ({
                ...prevState,
                [transfer.from]: [],
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching ERC20 transfers or staking info', error);
      } finally {
        setLoading(false);
      }
    };

    fetchERC20Transfers();
  }, []);

  const findMatchingStake = (transferAmount: number, stakes: StakeInfo[] = []) => {
    return stakes.find(stake => {
      const stakedAmount = parseFloat(stake.amount);
      return Math.abs(stakedAmount - transferAmount) < 0.0001;
    });
  };

  const calculateEndDate = (startTime: number, stakingDays: number) => {
    return new Date((startTime + stakingDays * 24 * 60 * 60) * 1000);
  };

  const calculateDaysToEnd = (endDate: Date) => {
    const currentDate = new Date();
    const difference = endDate.getTime() - currentDate.getTime();
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleTransfersPerPageChange = (event: SelectChangeEvent<number>) => {
    setTransfersPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
    setCurrentPage(1);
  };

  const filteredTransfers = transfers.filter(transfer => {
    const transferDate = new Date(parseInt(transfer.timeStamp) * 1000);
    const isAfterStartDate = startDate ? transferDate >= new Date(startDate) : true;
    const isBeforeEndDate = endDate ? transferDate <= new Date(endDate) : true;

    return (
      transfer.from.toLowerCase().includes(searchAddress) &&
      isAfterStartDate &&
      isBeforeEndDate
    );
  });

  const totalStakedTokens = filteredTransfers.reduce((total, transfer) => {
    const stakes = stakingInfo[transfer.from] || [];
    const matchingStake = findMatchingStake(parseFloat((parseFloat(transfer.value) / 10 ** 18).toFixed(4)), stakes);
    return matchingStake ? total + parseFloat(matchingStake.amount) : total;
  }, 0);

  const indexOfLastTransfer = currentPage * transfersPerPage;
  const indexOfFirstTransfer = indexOfLastTransfer - transfersPerPage;
  const currentTransfers = filteredTransfers.slice(indexOfFirstTransfer, indexOfLastTransfer);

  return (
    <Box>
      <TextField
        label="Buscar por dirección"
        variant="outlined"
        
        margin="normal"
        value={searchAddress}
        onChange={handleSearchChange}
        placeholder="Introduce una dirección para buscar"
        sx={{width:'100%'}}
      />

      <TextField
        label="Desde"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        
        margin="normal"
        value={startDate}
        onChange={handleStartDateChange}
        sx={{width:'30%', p:2}}
      />

      <TextField
        label="Hasta"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        sx={{width:'30%', p:2}}
        
        margin="normal"
        value={endDate}
        onChange={handleEndDateChange}
      />

      <FormControl  margin="normal"
        sx={{width:'10%', p:2}}

      >
        <InputLabel id="transfers-per-page-label">Registros por página</InputLabel>
        <Select
          labelId="transfers-per-page-label"
          id="transfers-per-page"
          value={transfersPerPage}
          onChange={handleTransfersPerPageChange}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>


        </Select>
      </FormControl>

      <Typography variant="h6">
        Total de tokens en stake: {totalStakedTokens.toFixed(4)} AT3
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>From</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount (Transfer)</TableCell>
                <TableCell>Token</TableCell>
                <TableCell>Staked Amount</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Days to End</TableCell>
                <TableCell>Reward</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTransfers.length > 0 ? (
                currentTransfers.map((transfer: ERC20Transfer) => {
                  const transferAmount = parseFloat((parseFloat(transfer.value) / 10 ** 18).toFixed(4));
                  const stakes = stakingInfo[transfer.from] || [];
                  const matchingStake = findMatchingStake(transferAmount, stakes);

                  const endDate = matchingStake?.startTime
                    ? calculateEndDate(matchingStake.startTime, matchingStake.stakingDays)
                    : null;
                  const daysToEnd = endDate ? calculateDaysToEnd(endDate) : 'N/A';

                  return (
                    <TableRow key={transfer.timeStamp + transfer.from}>
                      <TableCell>{transfer.from}</TableCell>
                      <TableCell>{new Date(parseInt(transfer.timeStamp) * 1000).toLocaleString()}</TableCell>
                      <TableCell>{transferAmount.toFixed(4)}</TableCell>
                      <TableCell>{transfer.tokenSymbol}</TableCell>
                      <TableCell>{matchingStake?.amount || 'N/A'}</TableCell>
                      <TableCell>
                        {matchingStake?.startTime
                          ? new Date(matchingStake.startTime * 1000).toLocaleString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{endDate ? endDate.toLocaleString() : 'N/A'}</TableCell>
                      <TableCell>{daysToEnd}</TableCell>
                      <TableCell>{matchingStake?.reward || 'N/A'}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No se encontraron transferencias ERC20.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Box display="flex" justifyContent="center" marginTop="16px">
            <Pagination
              count={Math.ceil(filteredTransfers.length / transfersPerPage)}
              page={currentPage}
              onChange={handlePageChange}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default StakingInfo;

