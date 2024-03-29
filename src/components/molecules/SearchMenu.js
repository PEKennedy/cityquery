import React, { useContext } from 'react';
import { VStack, Text } from 'native-base';
import { strings } from '../../constants/strings';
import { SearchPluginList } from '../Plugins/pyScript';
import { SearchMenuContext } from '../../constants/context';

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

const SearchMenu = () => {
  const { cityFiles, select } = useContext(SearchMenuContext);
  return (
    <VStack style={style.menuContainer}>
      <Text style={style.titleText}>
        {strings.searchPlugins}
      </Text>
      <SearchPluginList getSelected={()=>{return cityFiles}} onResult={select}/>
    </VStack>
  );
};

export default SearchMenu;
