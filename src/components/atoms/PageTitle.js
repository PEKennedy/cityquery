import React from 'react';
import { Text } from 'native-base';

const PageTitle = (props) => {
  const { title, titleStyle } = props;
  return (
    <Text style={titleStyle}>
      {title}
    </Text>
  );
};

export default PageTitle;
