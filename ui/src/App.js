import React from 'react';
import LandingPage from './components/pages/LandingPage';
import { NativeBaseProvider } from 'native-base';
import { Routes, Route } from 'react-router-dom';
import { strings } from './components/strings';
import HomePage from './components/pages/HomePage';

const App = () => {
  return (
    <NativeBaseProvider>
      <Routes>
        <Route exact path={strings.routes.landingPage} element={<LandingPage />} />
        <Route path={strings.routes.homePage} element={<HomePage />} />
      </Routes>
    </NativeBaseProvider>
  );
}

export default App;
