import React from 'react';
import { Pressable, Text } from 'native-base';
import { useNavigate } from 'react-router-native';

const style = {
  textContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#d2303b',
    borderRadius: 8,
  },
  textContainerSelected: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#770d09',
    borderWidth: 4,
    borderColor: '#d2303b',
    borderRadius: 8,
  },
  labelText: {
    fontSize: 20,
    fontWeight: 500,
    color: '#d2303b',
  },
  labelTextSelected: {
    fontSize: 20,
    fontWeight: 500,
    color: '#FFF',
  },
};

const NavBarLink = (props) => {
  const { label, link, selected } = props;
  const nav = useNavigate();
  const navToLink = () => {
    nav(link);
  };
  return (
    <Pressable style={selected ? style.textContainerSelected : style.textContainer} onPress={() => navToLink()}>
      <Text style={selected? style.labelTextSelected : style.labelText}>
        {label}
      </Text>
    </Pressable>
  );
};

export default NavBarLink;