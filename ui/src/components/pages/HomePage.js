import React from 'react';
import { VStack } from 'native-base';
import PageTitle from '../atoms/PageTitle';
import { strings } from '../../constants/strings';
import ToolBar from '../organisms/ToolBar';

const style = {
  pageContainer: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#d2303b',
    alignItems: 'center',
  },
  homeTitle: {
    fontSize: 48,
    fontWeight: 500,
    color: '#ffffff',
    marginBottom: 20,
  },
};

const HomePage = () => {
  return (
    <VStack style={style.pageContainer}>
      <ToolBar />
      <PageTitle titleStyle={style.homeTitle} title={strings.home} />
    </VStack>
  );
};

export default HomePage;
