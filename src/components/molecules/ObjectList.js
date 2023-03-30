import React, { useState } from 'react';
import { Checkbox, ScrollView, VStack } from 'native-base';
import ObjectInList from '../atoms/ObjectInList';

const style = {
  listContainer: {
    height: 300,
    width: '100%',
    marginLeft: 20,
    marginright: 20,
  },
};

const ObjectList = (props) => {
  const { file, fileName } = props;
  const [checkboxValues, setCheckboxValues] = useState([]);
  let objectList = [];
  for (const [key, ] of Object.entries(file)) {
    objectList.push(key);
  }

  return (
    <ScrollView>
      <VStack style={style.listContainer}>
        <Checkbox.Group defaultValue={checkboxValues} value={checkboxValues} colorScheme="red" onChange={values => {
          setCheckboxValues(values || []);
        }}>
          {objectList.map((object) => (
            <ObjectInList objectName={object} fileName={fileName} />
          ))}
        </Checkbox.Group>
      </VStack>
    </ScrollView>
  )
}

export default ObjectList;