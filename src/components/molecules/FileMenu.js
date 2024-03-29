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
    alignItems: 'center',
  },
};

//TODO: LAS functionality is unfinished/not working, so we have disabled its upload interface
//for now
const FileMenu = () => {
  const { addFile, addFileLAS, clearCityFiles, clearLASFiles, selectFile,
     deSelectFile, checkboxValues, setCheckboxValues } = useContext(FileMenuContext);
  return (
    <VStack style={style.menuContainer}>
      <HStack>
        <Text style={style.titleText}>
          {strings.fileMenu}
        </Text>
      </HStack>
      <Text style={style.menuText}>
        {strings.uploadList}
      </Text>
      <FileControl upId={"cityUpload"} clearId={"cityClear"} fileType={".json"}
        clearText={"Clear CityJSON Files"} addFile={addFile} clearFiles={clearCityFiles}
        selectFile={selectFile} deSelectFile={deSelectFile} checkboxValues={checkboxValues}
        setCheckboxValues={setCheckboxValues} isFileMenu />
        {/*<FileControl upId={"lasUpload"} clearId={"lasClear"} fileType={".las"}
        clearText={"Clear LAS Files"} addFile={addFileLAS} clearFiles={clearLASFiles} />*/}
    </VStack>
  );
};

export default FileMenu;
