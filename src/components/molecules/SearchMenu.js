import React from 'react';
import { VStack, Text } from 'native-base';
import { strings } from '../../constants/strings';

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
  return (
    <VStack style={style.menuContainer}>
      <Text style={style.titleText}>
        {strings.searchMenu}
      </Text>
    </VStack>
  );
};

export default SearchMenu;
