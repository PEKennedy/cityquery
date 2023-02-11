import React, { useState } from 'react';
import { HStack, VStack } from 'native-base';
import PageTitle from '../atoms/PageTitle';
import { strings } from '../../constants/strings';
import ToolBar from '../organisms/ToolBar';
import VisualizationRoot from '../organisms/VisualizationRoot';
import SideMenu from '../organisms/SideMenu';
import { FileMenuContext } from '../../constants/context';

const style = {
  pageContainer: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#d2303b',
    alignItems: 'center',
    padding: 20,
  },
  innerContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  visualizationTitle: {
    fontSize: 48,
    fontWeight: 500,
    color: '#ffffff',
    marginBottom: 20,
  },
};

const VisualizationPage = () => {
  const [cityFiles, setCityFiles] = useState({});
  const [selected, setSelected] = useState([]);

  const addFile = (file, fileName) => {
    //this.setState({ cityFiles:[...this.state.cityFiles,JSON.parse(file)] })
    let newCityFiles = cityFiles
    newCityFiles[fileName] = JSON.parse(file);
    setCityFiles(newCityFiles);
  }
  
  //clear all files from the canvas
  const clearCityFiles = () => {
    setCityFiles({});
  }
  
  const select_test = () => {
    select("twobuildings.city.json","Building_1")
  }
  
  const select = (fileName, objName) => {
    //return 0;
    let newSelected = selected;
    if(newSelected.fileName == undefined){
      newSelected[fileName] = {"objects":[objName]}
    }
    else{
      newSelected[fileName]["objects"] = [objName]
    }
    setSelected(newSelected);
  }
  
  //example state.selected: {"file.city.json":{"objects"[objName1,objName2]}}
  //becomes in getSelected function:
  // {"file.city.json":{"objects":[objName1,objName2], "file":this.state.cityFiles[fileName]}}
  //we do this conversion process when needed so we don't have to store+update the entire cityFile again
  // every time we want to do a conversion
  //this could be simplified to adding a "objectsSelected" property to state.cityFiles though (and iterate through that)
  
  //We list selected object names with a file to ensure the objects are unique, and so plugins can update
  //all a file's objects at once. This also avoids asynchronisity issues that updating a file's 'vertices' might cause
  
  const getSelected = () => {
    let selected = selected
    let keys = Object.keys(selected)
    keys.forEach((fileName)=>{
      selected[fileName]["file"] = cityFiles[fileName]
    })
    return selected;
  }
  
  const ModifyCityJSON = (fileName, output) => {
    cityFiles[fileName] = output;
    console.log(cityFiles);
  }

  const fileMenuContext = { addFile, clearCityFiles };
  console.log(cityFiles);

  return (
    <FileMenuContext.Provider value={fileMenuContext}>
      <VStack style={style.pageContainer}>
        <ToolBar />
        <PageTitle title={strings.visualization} titleStyle={style.visualizationTitle} />
        <HStack style={style.innerContainer}>
          <SideMenu />
          <VisualizationRoot cityFiles selected getSelected ModifyCityJSON select_test />
        </HStack>
      </VStack>
    </FileMenuContext.Provider>
  );
};

export default VisualizationPage;