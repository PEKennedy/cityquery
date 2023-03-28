import React, { useState } from 'react';
import { HStack, ScrollView, VStack } from 'native-base';
import FileMenu from '../molecules/FileMenu';
import SearchMenu from '../molecules/SearchMenu';
import SideMenuPluginTab from '../atoms/SideMenuPluginTab';
import PluginMenu from '../molecules/PluginMenu';
import SideMenuSearchTab from '../atoms/SideMenuSearchTab';

const style = {
  menuContainer: {
    height: '100%',
    width: '25%',
    borderRightColor: '#d2303b',
    borderRightWidth: 1,
  },
  tabsContainer: {
    width: '17%',
    height: '100%',
    borderRightColor: '#d2303b',
    borderRightWidth: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    width: '100%',
    height: '100%',
    padding: 10,
  },
};

const SideMenu = () => {
  //const [layout, setLayout] = useState('');

  return (
    <HStack style={style.menuContainer}>
      {/*<VStack style={style.tabsContainer} space={3}>
        <SideMenuSearchTab setLayout={setLayout} />
        <SideMenuPluginTab setLayout={setLayout} />
      </VStack>*/}
      <ScrollView height={"100%"}>
        <VStack style={style.listContainer} space={1}>
          <FileMenu />
          <SearchMenu />
          <PluginMenu />
        </VStack>
      </ScrollView>
    </HStack>
  );
};

export default SideMenu;
