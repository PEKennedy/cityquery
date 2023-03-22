import React from 'react';
import { HStack } from 'native-base';
import { navBarData } from '../../constants/strings';
import NavBarLink from '../molecules/NavBarLink';

const style = {
  navBarContainer: {
    borderWidth: 2,
    borderColor: '#d2303b',
  },
};

const NavBar = (props) => {
  const { selected } = props;
  return (
    <HStack style={style.navBarContainer}>
      {navBarData.map((data) => (
        <NavBarLink label={data.label} link={data.link} selected={selected === data.label} />
      ))}
    </HStack>
  );
};

export default NavBar;