import React from 'react';
import { VStack } from 'native-base';
import PageTitle from '../atoms/PageTitle';
import { strings } from '../../constants/strings';
import NavBar from '../organisms/NavBar';

const style = {
  pageContainer: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#d2303b',
    alignItems: 'center',
    padding: 20,
  },
  userManualTitle: {
    fontSize: 48,
    fontWeight: 500,
    color: '#ffffff',
    marginBottom: 20,
  },
};

const UserManualPage = () => {
  return (
    <VStack style={style.pageContainer}>
      <NavBar selected="User Manual" />
      <PageTitle titleStyle={style.userManualTitle} title={strings.userManual} />
    </VStack>
  );
};

export default UserManualPage;
