import React, { useContext, useMemo, useState } from "react";
import { Checkbox, HStack } from "native-base";
import { SelectObjectContext } from "../../constants/context";

const style = {
  objectInListContainer: {
    fontSize: 12,
    marginTop: 2.5,
    marginBottom: 2.5,
    alignItems: 'center',
  },
}

const selectObject = (selected, setSelected, select, deSelect, objectName, fileName) => {
  if (selected) {
    deSelect(fileName, [objectName]);
  } else {
    select(fileName, [objectName], true);
  }
  setSelected(!selected);
}

const ObjectInList = (props) => {
  const { objectName, fileName } = props;
  const [selected, setSelected] = useState(false);
  const { select, deSelect } = useContext(SelectObjectContext);

  const obj = useMemo(() => {
    return (
      <HStack style={style.objectInListContainer}>
        <Checkbox mr={2} size="sm" value={objectName} onChange={() => selectObject(selected, setSelected, select, deSelect, objectName, fileName)} />
        {objectName}
      </HStack>
    )
  }, [selected]);
  return (
    obj
  )
}

export default ObjectInList;