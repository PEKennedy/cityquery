import React from 'react';
import { VStack, Text,HStack } from 'native-base';
import FileControl from '../atoms/FileControl';

const style = {
  menuContainer: {
    height: 50,
    width: '100%',
    backgroundColor: '#0F0',
  },
  menuText: {
    fontSize: 20,
    fontWeight: 500,
    color: '#000',
  },
};

const FileMenu = () => {


  return (


    <VStack style={style.menuContainer}>
      <Text style={style.menuText}>
        File Menu
      </Text>
      CityJSON Upload List:
      <FileControl upId={"cityUpload"} clearId={"cityClear"}  fileType={".json"}
            clearText={"Clear CityJSON Files"}  />


      <HStack style={style.innerContainer}>


      </HStack>



    </VStack>








  );
};

export default FileMenu;
