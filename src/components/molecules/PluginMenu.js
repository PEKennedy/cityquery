import React from 'react';
import { Text, VStack } from 'native-base';
import { ModificationPluginList, SearchPluginList } from '../3JS/pyScript';
import { useContext } from 'react';

import { strings } from '../../constants/strings';
import { PluginMenuContext } from '../../constants/context';

const style = {
  menuContainer: {
    width: '100%',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 500,
    color: '#000',
  },
  menuText: {
    fontSize: 16,
    fontWeight: 500,
    color: '#000',
  },
};

const PluginMenu = () => {
  const { cityFiles, getSelected, ModifyCityJSON, select_test, select } = useContext(PluginMenuContext);
  return (
    <VStack style={style.menuContainer}>
      <Text style={style.titleText}>
        {strings.pluginMenu}
      </Text>
      <Text style={style.menuText}>
        {strings.modificationPlugins}
      </Text>
      <ModificationPluginList getSelected={getSelected} onResult={ModifyCityJSON} />
      <Text style={style.menuText}>
        {strings.searchPlugins}
      </Text>
      <SearchPluginList getSelected={()=>{return cityFiles}} onResult={select}/>
      <input type={"button"} onClick={() => {
        select_test()
        }} value={"Select Building_1"} />
    </VStack>
  );
};

export default PluginMenu;
