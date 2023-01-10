import React from 'react';
import { HStack } from 'native-base';
import { toolBarData } from '../../constants/strings';
import ToolBarLink from '../molecules/ToolBarLink';

const style = {
  toolBarContainer: {
    borderWidth: 2,
    borderColor: '#d2303b',
  },
};

const ToolBar = () => {
  return (
    <HStack style={style.toolBarContainer}>
      {toolBarData.map((data) => (
        <ToolBarLink label={data.label} link={data.link} />
      ))}
    </HStack>
  );
};

export default ToolBar;