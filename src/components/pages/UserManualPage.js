import React from 'react';
import { VStack } from 'native-base';
import NavBar from '../organisms/NavBar';

const style = {
  pageContainer: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#d2303b',
    alignItems: 'center',
    padding: 20,
  },
};

const UserManualPage = () => {
  return (
    <VStack style={style.pageContainer}>
      <NavBar selected="User Manual" />
    </VStack>
  );
};

export default UserManualPage;
