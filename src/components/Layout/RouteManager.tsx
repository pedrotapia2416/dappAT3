import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from '../../pages/Home/Home';
import Admin from '../../pages/Admin/Admin';
import StakingPlus from '../../pages/Staking/StakingPlus';
import Auth from '../../pages/Login/Auth';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

interface RouteManagerProps {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

const RouteManager: React.FC<RouteManagerProps> = ({ account, setAccount }) => {
  const location = useLocation(); 

  return (
    <SwitchTransition>
      <CSSTransition
        key={location.key}
        timeout={300}
        classNames="fade"
      >
        <Routes location={location}>
          <Route path="/stakingplus" element={<StakingPlus />} />
          <Route path="/" element={<Home account={account} setAccount={setAccount} />} />
          <Route path="/home" element={<Home account={account} setAccount={setAccount} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default RouteManager;
