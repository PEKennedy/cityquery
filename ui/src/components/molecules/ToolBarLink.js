import React from 'react';
import { Pressable, Text } from 'native-base';
import { useNavigate } from 'react-router-native';

const style = {
  textContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#d2303b',
  },
  labelText: {
    fontSize: 20,
    fontWeight: 500,
    color: '#d2303b',
  },
};

const ToolBarLink = (props) => {
  const { label, link } = props;
  const nav = useNavigate();
  const navToLink = () => {
    nav(link);
  };
  return (
    <Pressable style={style.textContainer} onPress={() => navToLink()}>
      <Text style={style.labelText}>
        {label}
      </Text>
    </Pressable>
  );
};

export default ToolBarLink;