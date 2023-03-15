import React, { useContext } from 'react';
import { VStack, Text } from 'native-base';
import { strings } from '../../constants/strings';
import { SearchPluginList } from '../3JS/pyScript';
import { SearchMenuContext } from '../../constants/context';

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

const SearchMenu = () => {
  const { cityFiles, select } = useContext(SearchMenuContext);
  return (
    <VStack style={style.menuContainer}>
      <Text style={style.titleText}>
        {strings.searchMenu}
      </Text>
      <Text style={style.menuText}>
        {strings.searchPlugins}
      </Text>
      <SearchPluginList getSelected={()=>{return cityFiles}} onResult={select}/>
    </VStack>
  );
};

export default SearchMenu;
