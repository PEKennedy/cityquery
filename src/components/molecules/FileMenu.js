import { VStack, Text,HStack } from 'native-base';
import FileControl from '../atoms/FileControl';
import React, { useState } from 'react';

const style = {
  menuContainer: {
    height: 50,
    width: '100%',
    backgroundColor: '#0F0',
    alignItems: 'center',


  },
  menuText: {
    fontSize: 20,
    fontWeight: 500,
    color: '#000',
    alignItems: 'center',
    
  },
};

const FileMenu = () => {

  const [cityFiles,setVal]= useState({});



  function addFile(file, fileName){
    //this.setState({ cityFiles:[...this.state.cityFiles,JSON.parse(file)] })
    let newCityFiles = cityFiles;
    newCityFiles[fileName] = JSON.parse(file);
    setVal(newCityFiles);
  }

  //clear all files from the canvas
  function clearCityFiles(){
    setVal([]);
  }



  return (


    <VStack style={style.menuContainer}>
      <Text style={style.menuText}>
        File Menu
      </Text>
      CityJSON Upload List:

        <FileControl upId={"cityUpload"} clearId={"cityClear"} fileType={".json"}
            clearText={"Clear CityJSON Files"} addFile={addFile} clearFiles={clearCityFiles}/>



      <HStack style={style.innerContainer}>


      </HStack>



    </VStack>








  );
};

export default FileMenu;
