import React, { useContext } from 'react';
import { VStack, Text, Checkbox, HStack } from 'native-base';
import FileControl from '../atoms/FileControl';
import { FileMenuContext } from '../../constants/context';
import { strings } from '../../constants/strings';

const style = {
  menuContainer: {
    width: '100%',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 500,
    color: '#000',
  },
  menuText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#000',
  },
};

const FileMenu = () => {
  const { addFile, clearCityFiles } = useContext(FileMenuContext);
  return (
    <VStack style={style.menuContainer}>
      <HStack>
        {/*Leaving this below as an example for using native base checkboxes.*/}
        {/*<Checkbox />*/}
        <Text style={style.titleText}>
          {strings.fileMenu}
        </Text>
      </HStack>
      <Text style={style.menuText}>
        {strings.uploadList}
      </Text>
      <FileControl upId={"cityUpload"} clearId={"cityClear"} fileType={".json"}
        clearText={"Clear CityJSON Files"} addFile={addFile} clearFiles={clearCityFiles} />
    </VStack>
  );
};

export default FileMenu;
