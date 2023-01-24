import React, { useState } from 'react';
import { HStack, VStack } from 'native-base';
import FileMenu from '../molecules/FileMenu';
import SearchMenu from '../molecules/SearchMenu';
import SideMenuPluginTab from '../atoms/SideMenuPluginTab';
import PluginMenu from '../molecules/PluginMenu';
import SideMenuFilterTab from '../atoms/SideMenuFilterTab';

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
    justifyContent: 'center',
  },
  listContainer: {
    width: '80%',
    height: '100%',
    padding: 20,
  },
};

const getActiveLayout = (layout) => {
  switch(layout) {
    case 'file':
      return <FileMenu />;
    case 'search':
      return <SearchMenu />;
    case 'plugin':
      return <PluginMenu />;
    default:
      return null;
  }
};

const SideMenu = () => {
  const [layout, setLayout] = useState('');

  return (
    <HStack style={style.menuContainer}>
      <VStack style={style.tabsContainer} space={3}>
        <SideMenuFilterTab setLayout={setLayout} />
        <SideMenuPluginTab setLayout={setLayout} />
      </VStack>
      <VStack style={style.listContainer} space={3}>
        <FileMenu />
        {getActiveLayout(layout)}
      </VStack>
    </HStack>
  );
};

export default SideMenu;
