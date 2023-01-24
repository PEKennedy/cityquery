import React from 'react';
import { VStack, Text } from 'native-base';

const style = {
  menuContainer: {
    height: 50,
    width: '100%',
    backgroundColor: '#0FF',
  },
  menuText: {
    fontSize: 20,
    fontWeight: 500,
    color: '#000',
  },
};

const PluginMenu = () => {
  return (
    <VStack style={style.menuContainer}>
      <Text style={style.menuText}>
        Plugin Menu
      </Text>
    </VStack>
  );
};

export default PluginMenu;
