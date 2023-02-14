import React from 'react';
import { VStack } from 'native-base';
import { PluginList } from '../3JS/pyScript';
import { useContext } from 'react';
import { FileMenuContext } from '../../constants/context';

const style = {
  menuContainer: {
    height: '100%',
    width: '100%',
  },
  menuText: {
    fontSize: 20,
    fontWeight: 500,
    color: '#000',
  },
};

const PluginMenu = () => {
  const { cityFiles, getSelected, select_test, select, ModifyCityJSON } = useContext(FileMenuContext);
  return (
    <VStack style={style.menuContainer}>
      Modification Plugins:
      <PluginList getSelected={getSelected} onResult={ModifyCityJSON} />
      <input type={"button"} onClick={select_test} value={"Select Building_1"} />
      Search Plugins:
      <PluginList getSelected={()=>{return cityFiles}} onResult={select} pluginType={"search"} />
    </VStack>
  );
};

export default PluginMenu;
