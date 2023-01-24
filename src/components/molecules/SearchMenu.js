import React from 'react';
import { VStack, Text } from 'native-base';

const style = {
  menuContainer: {
    height: 50,
    width: '100%',
    backgroundColor: '#00F',
  },
  menuText: {
    fontSize: 20,
    fontWeight: 500,
    color: '#000',
  },
};

const SearchMenu = () => {
  return (
    <VStack style={style.menuContainer}>
      <Text style={style.menuText}>
        Search Menu
      </Text>
    </VStack>
  );
};

export default SearchMenu;
