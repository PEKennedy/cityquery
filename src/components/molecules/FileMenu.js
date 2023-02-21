import React, { useContext } from 'react';
import { VStack, Text } from 'native-base';
import FileControl from '../atoms/FileControl';
import { FileMenuContext } from '../../constants/context';
import { strings } from '../../constants/strings';

const style = {
  menuContainer: {
    width: '100%',
    borderBottomWidth: 1,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 500,
    color: '#000',
  },
  menuText: {
    fontSize: 16,
    fontWeight: 500,
    color: '#000',
  },
};

const FileMenu = () => {
  const { addFile, clearCityFiles } = useContext(FileMenuContext);
  return (
    <VStack style={style.menuContainer}>
      <Text style={style.titleText}>
        {strings.fileMenu}
      </Text>
      <Text style={style.menuText}>
        {strings.uploadList}
      </Text>
      <FileControl upId={"cityUpload"} clearId={"cityClear"} fileType={".json"}
        clearText={"Clear CityJSON Files"} addFile={addFile} clearFiles={clearCityFiles} />
    </VStack>
  );
};

export default FileMenu;
