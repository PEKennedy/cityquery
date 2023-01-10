import React from 'react';
import { VStack } from 'native-base';
import PageTitle from '../atoms/PageTitle';
import { strings } from '../../constants/strings';
import ToolBar from '../organisms/ToolBar';
import VisualizationRoot from '../organisms/VisualizationRoot';

const style = {
  pageContainer: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#d2303b',
    alignItems: 'center',
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
      <VisualizationRoot />
    </VStack>
  );
};

export default VisualizationPage;