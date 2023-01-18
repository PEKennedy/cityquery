import React, { useState } from 'react';
import { HStack, VStack } from 'native-base';
import SideMenuTab from '../molecules/SideMenuTab';
import FileMenu from '../molecules/FileMenu';
import SearchMenu from '../molecules/SearchMenu';

const style = {
  menuContainer: {
    height: '100%',
    width: '25%',
    borderRightColor: '#d2303b',
    borderRightWidth: 1,
  },
  tabsContainer: {
    width: '20%',
    height: '100%',
    borderRightColor: '#d2303b',
    borderRightWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  listContainer: {
    width: '80%',
    height: '100%',
    padding: 20,
  },
};

const tabs = [
  {
    layout: 'file',
  },
  {
    layout: 'search',
  },
];

const getActiveLayout = (layout) => {
  switch(layout) {
    case 'file':
      return <FileMenu />;
    case 'search':
      return <SearchMenu />;
    default:
      return null;
  }
};

const SideMenu = () => {
  const [layout, setLayout] = useState('');

  return (
    <HStack style={style.menuContainer}>
      <VStack style={style.tabsContainer} space={3}>
        {tabs.map((tab) => (
          <SideMenuTab layout={tab.layout} setLayout={setLayout} />
        ))}
      </VStack>
      <VStack style={style.listContainer}>
        {getActiveLayout(layout)}
      </VStack>
    </HStack>
  );
};

export default SideMenu;
