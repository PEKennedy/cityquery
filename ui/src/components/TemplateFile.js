import React from 'react';
// Native base provides the components needed to make a simple UI
import { HStack, VStack, Text } from 'native-base';

// This is a functional component. Using these along with hooks is a more efficient use of React vs classes and lifecycle methods imo
// Plus React is moving away from class based to functional components
const TemplateFile = (props) => {
  // Extract individual props from the props object
  const { prop } = props;
  // Insert logic, setup, functions, hooks, etc here
  // Return the UI in here
  return (
    <></>
  );
};

export default TemplateFile;
