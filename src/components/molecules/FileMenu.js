import React from 'react';
import { VStack, Text } from 'native-base';

const style = {
  menuContainer: {
    height: 50,
    width: '100%',
    backgroundColor: '#0F0',
  },
  menuText: {
    fontSize: 20,
    fontWeight: 500,
    color: '#000',
  },
};

const FileMenu = () => {
  return (
    <VStack style={style.menuContainer}>
      <Text style={style.menuText}>
        File Menu
      </Text>
    </VStack>
  );
};

export default FileMenu;
