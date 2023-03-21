import React, { memo, useState } from 'react';
import { HStack, VStack } from 'native-base';
import ToolBar from '../organisms/ToolBar';
import VisualizationRoot from '../organisms/VisualizationRoot';
import SideMenu from '../organisms/SideMenu';
import { FileMenuContext, PluginMenuContext, SearchMenuContext, SelectionContext } from '../../constants/context';
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
    height: '85%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginTop: 20,
  },
};

const VisualizationPage = () => {
  const [cityFiles, setCityFiles] = useState({});
  const [lasFiles, setLasFiles] = useState({});
  const [selected, setSelected] = useState({});

  const addFile = (file, fileName) => {
    //this.setState({ cityFiles:[...this.state.cityFiles,JSON.parse(file)] })
    let newCityFiles = cloneDeep(cityFiles);
    newCityFiles[fileName] = JSON.parse(file);
    setCityFiles(newCityFiles);
  }
  const addFileLAS = (file, fileName) => {
    //this.setState({ cityFiles:[...this.state.cityFiles,JSON.parse(file)] })
    let newLASFile = cloneDeep(cityFiles);
    newLASFile[fileName] = JSON.parse(file);
    setCityFiles(newLASFile);
  }
  
  //clear all files from the canvas
  const clearCityFiles = () => {
    setCityFiles({});
    setLasFiles({});
    clearSelect();
  }
  
  const select_test = () => {
    select("twobuildings.city.json",["Building_1"])
  }
  
  const select = (fileName, objNames, append=false) => {

    let newSelected = cloneDeep(selected);

    if(newSelected[fileName] == undefined){
      newSelected[fileName] = {"objects":objNames}
    }
    else if(append){
      newSelected[fileName]["objects"].push(objNames)
    }
    else{
      newSelected[fileName]["objects"] = objNames
    }
    setSelected(newSelected)
  }

  const deSelect = (fileName, objNames) => {
    console.log("Deselect")
    let newSelected = cloneDeep(selected);
    if(newSelected[fileName]){
      objNames.forEach((name,index)=>{
        console.log(name)
        let indexForRemoving = newSelected[fileName]["objects"].findIndex((val)=>{return val==name})
        console.log(indexForRemoving)
        newSelected[fileName]["objects"].splice(indexForRemoving,1);
      })
      if(newSelected[fileName]["objects"].length == 0){ //if no more selected objects
        delete newSelected[fileName]
      }
      setSelected(newSelected)
    }
  }

  const clearSelect = () =>{
    console.log("Clear all selections")
    setSelected({});
  }
  
  //example state.selected: {"file.city.json":{"objects"[objName1,objName2]}}
  //becomes in getSelected function:
  // {"file.city.json":{"objects":[objName1,objName2], "file":this.state.cityFiles[fileName]}}
  //we do this conversion process when needed so we don't have to store+update the entire cityFile again
  // every time we want to do a conversion
  //this could be simplified to adding a "objectsSelected" property to state.cityFiles though (and iterate through that)
  
  //We list selected object names with a file to ensure the objects are unique, and so plugins can update
  //all a file's objects at once. This also avoids asynchronisity issues that updating a file's 'vertices' might cause
  

  //Get the selected state with the corresponding cityFile
  const getSelected = () => {
    let newSelected = cloneDeep(selected)
    let keys = Object.keys(newSelected)
    keys.forEach((fileName)=>{
      newSelected[fileName]["file"] = cityFiles[fileName]
    })
    return newSelected;
  }

  const ModifyCityJSON = (fileName, output) => {
    cityFiles[fileName] = output;
  }

  const fileMenuContext = { addFile, addFileLAS, clearCityFiles };
  const pluginMenuContext = { cityFiles, getSelected, ModifyCityJSON, select_test, select, deSelect, clearSelect };
  const searchMenuContext = { cityFiles, select }
  const selectionContext = {selected, getSelected, select, deSelect, clearSelect, select_test}

  return (
    <FileMenuContext.Provider value={fileMenuContext}>
      <PluginMenuContext.Provider value={pluginMenuContext}>
        <SearchMenuContext.Provider value={searchMenuContext}>
          <SelectionContext.Provider value={selectionContext}>
            <VStack style={style.pageContainer}>
              <ToolBar />
              <HStack style={style.innerContainer}>
                <SideMenu />
                <VisualizationRoot cityFiles={cityFiles} selected={selected} />
              </HStack>
            </VStack>
          </SelectionContext.Provider>
        </SearchMenuContext.Provider>
      </PluginMenuContext.Provider>
    </FileMenuContext.Provider>
  );
};

export default VisualizationPage;