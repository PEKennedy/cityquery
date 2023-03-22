import React from 'react';
import { Text, VStack } from 'native-base';
import { ModificationPluginList } from '../3JS/pyScript';
import { useContext } from 'react';
import { strings } from '../../constants/strings';
import { PluginMenuContext } from '../../constants/context';

const style = {
  menuContainer: {
    width: '100%',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 500,
    color: '#000',
  },
  menuText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#000',
  },
};

const PluginMenu = () => {
  const { getSelected, ModifyCityJSON } = useContext(PluginMenuContext);
  return (
    <VStack style={style.menuContainer}>
      <Text style={style.titleText}>
        {strings.pluginMenu}
      </Text>
      <Text style={style.menuText}>
        {strings.modificationPlugins}
      </Text>
      <ModificationPluginList getSelected={getSelected} onResult={ModifyCityJSON} />
    </VStack>
  );
};

export default PluginMenu;
