import React from 'react';
import { Pressable, SearchIcon } from 'native-base';

const style = {
  link: {
    height: '3vw',
    width: '3vw',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  icon: {
    color: '#000',
  },
};

const SideMenuFilterTab = (props) => {
  const { setLayout } = props;

  return (
    <Pressable style={style.link} onPress={() => setLayout('search')} >
      <SearchIcon style={style.icon} />
    </Pressable>
  );
};

export default SideMenuFilterTab;
