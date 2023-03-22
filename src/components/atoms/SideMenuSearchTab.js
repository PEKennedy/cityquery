import React from 'react';
import { Pressable, SearchIcon } from 'native-base';

const style = {
  link: {
    height: '3.5vw',
    width: '3.5vw',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  icon: {
    color: '#000',
  },
};

const SideMenuSearchTab = (props) => {
  const { setLayout } = props;

  return (
    <Pressable style={style.link} onPress={() => setLayout('search')} >
      <SearchIcon style={style.icon} size="1.25vw" />
    </Pressable>
  );
};

export default SideMenuSearchTab;
