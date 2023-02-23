import React, { useState } from 'react';
import { HStack, VStack } from 'native-base';
import PageTitle from '../atoms/PageTitle';
import { strings } from '../../constants/strings';
import ToolBar from '../organisms/ToolBar';
import VisualizationRoot from '../organisms/VisualizationRoot';
import SideMenu from '../organisms/SideMenu';
import { FileMenuContext, PluginMenuContext } from '../../constants/context';
import { cloneDeep } from 'lodash';

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
    height: 500,
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
    let newCityFiles = cloneDeep(cityFiles);
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
  
  const select = (fileName, objNames, append=false) => {
    //return 0;
    let newSelected = selected;
    if(newSelected.fileName == undefined){
      newSelected[fileName] = {"objects":objNames}
    }
    else if(append){
      newSelected[fileName]["objects"].push(objNames)
    }
    else{
      newSelected[fileName]["objects"] = objNames
    }
    setSelected(newSelected)
    console.log(selected)
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
    let newSelected = selected
    let keys = Object.keys(newSelected)
    keys.forEach((fileName)=>{
      selected[fileName]["file"] = cityFiles[fileName]
    })
    return selected;
  }

  const ModifyCityJSON = (fileName, output) => {
    cityFiles[fileName] = output;
    console.log(cityFiles)
  }

  const fileMenuContext = { addFile, clearCityFiles };
  const pluginMenuContext = { cityFiles, getSelected, ModifyCityJSON, select_test, select };

  return (
    <FileMenuContext.Provider value={fileMenuContext}>
      <PluginMenuContext.Provider value={pluginMenuContext}>
        <VStack style={style.pageContainer}>
          <ToolBar />
          <PageTitle title={strings.visualization} titleStyle={style.visualizationTitle} />
          <HStack style={style.innerContainer}>
            <SideMenu />
            <VisualizationRoot cityFiles={cityFiles} selected={selected} />
          </HStack>
        </VStack>
      </PluginMenuContext.Provider>
    </FileMenuContext.Provider>
  );
};

export default VisualizationPage;