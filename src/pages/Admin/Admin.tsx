import React, { useState } from 'react';
import { Container, Tabs, Tab, Box, Typography } from '@mui/material';
import StakingInfo from '../../components/Staking/StakingInfo';


const Admin: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Container sx={{marginTop:'20px'}} >
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      <Tabs sx={{background:'#fff', borderRadius:'8px'}}value={selectedTab} onChange={handleTabChange} aria-label="Admin Tabs">
        <Tab label="Staking Info" />
        {/* <Tab label="AT3 Info" />
        <Tab label="Otra Sección 2" /> */}
      </Tabs>

      {/* Contenido de las pestañas */}
      <Box sx={{background:'#fff', borderRadius:'8px', p:3}} mt={1}>
        {selectedTab === 0 && <StakingInfo />}
        {/* {selectedTab === 1 && <StakingInfo />} 
        {selectedTab === 2 && <StakingInfo />}  */}

        

      </Box>
    </Container>
  );
};

export default Admin;
