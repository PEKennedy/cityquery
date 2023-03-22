import React from 'react';
import { Pressable, Text } from 'native-base';
import { strings } from '../../constants/strings';
import { useNavigate } from 'react-router-native';

const style = {
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%',
    padding: '10px',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10,
    backgroundColor: '#d2303b',
    hover: {
      bg: '#b1303b',
    },
  },
  text: {
    fontSize: 24,
    fontWeight: 500,
    color: '#FFFFFF',
  },
};

const StartApplication = () => {
  const navigate = useNavigate();
  return (
    <Pressable
      onPress={() => navigate(strings.routes.userManualPage)}
      alignItems={style.button.alignItems}
      justifyContent={style.button.justifyContent}
      width={style.button.width}
      padding={style.button.padding}
      borderWidth={style.button.borderWidth}
      borderColor={style.button.borderColor}
      borderRadius={style.button.borderRadius}
      backgroundColor={style.button.backgroundColor}
      fontSize={style.button.fontSize}
      fontWeight={style.button.fontWeight}
      color={style.button.color}
      _hover={style.button.hover}
    >
      <Text style={style.text}>
        {strings.startApplication}
      </Text>
    </Pressable>
  );
};

export default StartApplication;
