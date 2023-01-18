import React from 'react';
import { Pressable, AddIcon } from 'native-base';

const style = {
  link: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  icon: {
    color: '#000',
  },
};

const SideMenuTab = (props) => {
  const { layout, setLayout } = props;

  return (
    <Pressable style={style.link} onPress={() => setLayout(layout)} >
      <AddIcon style={style.icon} />
    </Pressable>
  );
};

export default SideMenuTab;
