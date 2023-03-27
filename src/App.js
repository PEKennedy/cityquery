import React from 'react';
import LandingPage from './components/pages/LandingPage';
import { NativeBaseProvider } from 'native-base';
import { Routes, Route } from 'react-router-dom';
import { strings } from './constants/strings';
import UserManualPage from './components/pages/UserManualPage';
import CityQueryPage from './components/pages/CityQueryPage';

const App = () => {
  return (
    <NativeBaseProvider>
      <Routes>
        <Route exact path={strings.routes.landingPage} element={<LandingPage />} />
        <Route path={strings.routes.userManualPage} element={<UserManualPage />} />
        <Route path={strings.routes.cityQueryPage} element={<CityQueryPage />} />
      </Routes>
    </NativeBaseProvider>
  );
}

export default App;
