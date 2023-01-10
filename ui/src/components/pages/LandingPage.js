import React from 'react';
import { VStack } from 'native-base';
import PageTitle from '../atoms/PageTitle';
import { strings } from '../../constants/strings';
import StartApplication from '../atoms/StartApplication';

const style = {
  pageContainer: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#d2303b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 48,
    fontWeight: 500,
    color: '#ffffff',
    marginBottom: 20,
  },
};

const LoginPage = () => {
  return (
    <VStack style={style.pageContainer}>
      <PageTitle titleStyle={style.loginTitle} title={strings.cityQuery} />
      <StartApplication />
    </VStack>
  );
};

export default LoginPage;
