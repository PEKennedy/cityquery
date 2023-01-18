import React from 'react';
import { HStack, VStack, Text } from 'native-base';

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

const SearchMenu = (props) => {
  const { prop } = props;
  return (
    <VStack style={style.menuContainer}>
      <Text style={style.menuText}>
        Search
      </Text>
    </VStack>
  );
};

export default SearchMenu;
