import React from 'react';
import { HStack, VStack } from 'native-base';
import PageTitle from '../atoms/PageTitle';
import { strings } from '../../constants/strings';
import ToolBar from '../organisms/ToolBar';
import VisualizationRoot from '../organisms/VisualizationRoot';
import SideMenu from '../organisms/SideMenu';

const style = {
  pageContainer: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#d2303b',
    alignItems: 'center',
    padding: 20,
  },
  innerContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  visualizationTitle: {
    fontSize: 48,
    fontWeight: 500,
    color: '#ffffff',
    marginBottom: 20,
  },
};

const VisualizationPage = () => {
  return (
    <VStack style={style.pageContainer}>
      <ToolBar />
      <PageTitle title={strings.visualization} titleStyle={style.visualizationTitle} />
      <HStack style={style.innerContainer}>
        <SideMenu />
        <VisualizationRoot />
      </HStack>
    </VStack>
  );
};

export default VisualizationPage;