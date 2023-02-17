import React from 'react';
import { VStack } from 'native-base';

import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

import Box from '../3JS/Box';
import Plane from '../3JS/Plane';

import PointCloudObj from '../3JS/pointCloud';
import MultiLineObj from '../3JS/MultiLine';
import SurfaceObject from '../3JS/surface';

import { PluginList } from '../3JS/pyScript';
import FileControl from '../atoms/FileControl';

class VisualizationRoot extends React.Component {
  state = {
    cityFiles: {},
    selected:{}
  }

  constructor(props){
    super(props);
    this.clearCityFiles = this.clearCityFiles.bind(this);
    this.chooseObjectType = this.chooseObjectType.bind(this);
    this.addFile = this.addFile.bind(this);
    this.ModifyCityJSON = this.ModifyCityJSON.bind(this);
    this.select = this.select.bind(this);
    this.select_test = this.select_test.bind(this);
    this.getSelected = this.getSelected.bind(this);
  }

  addFile(file, fileName){
    //this.setState({ cityFiles:[...this.state.cityFiles,JSON.parse(file)] })
    let newCityFiles = this.state.cityFiles
    newCityFiles[fileName] = JSON.parse(file);
    this.setState({ cityFiles: newCityFiles})
  }

  //clear all files from the canvas
  clearCityFiles(){
    this.setState({
      cityFiles:[],
    })
  }

  //takes a file's contents, returns a list of objects as proper jsx types
  displayObjList(cityJSONFile,fileName){
    //console.log(cityJSONFile.CityObjects);
    const objNames = Object.keys(cityJSONFile.CityObjects);
    var objs = objNames.map((name)=>{
      return this.chooseObjectType(cityJSONFile,name,fileName);
    });

    return (
      <>
        {objs}
      </>
    );
  }

  //given a file (need a file as it contains the both object and the vertices) and an object name,
  //gives the proper jsx for display
  chooseObjectType(cityFile,objectName,fileName){

    var object = cityFile.CityObjects[objectName];

    if(object.geometry[0] == undefined){ //invalid object
      console.error(objectName+".geometry[0] was undefined");
      return <mesh visible={false}></mesh>
    }

    let type = object.geometry[0].type;

    let is_selected = false

    if(this.state.selected[fileName]){
      let fileObjs = this.state.selected[fileName]["objects"]
      is_selected = fileObjs.find((name)=>{return name == objectName}) != undefined;
    }
    
    if(type == "MultiPoint"){
      return <PointCloudObj position={[5, 0, 0]} cityFile={cityFile} object={objectName} selected={is_selected}/>;
    }
    if(type == "MultiLineString"){
      return <MultiLineObj position={[5, 0, 0]} cityFile={cityFile} object={objectName} selected={is_selected}/>;
    }
    if(type == "MultiSurface" || type == "CompositeSurface"){
      return <SurfaceObject position={[5, 0, 0]} cityFile={cityFile} object={objectName} selected={is_selected}/>;
    }
    /*if(object.attributes != undefined && object.attributes["pointcloud-file"] != undefined){
      return <PointCloudObj position={[5, 0, 0]} cityFile={cityFile} object={objectName}/>;
    }*/

    //default
    return <Box position={[-2.4, 0, 0]}/>

    //Some notes:
    //- cityJSON files with external PointClouds always specify an extension you could check for in the file
    //- For an 'external' pointcloud, we can also check for an object with no geometry, 
    //but with "attributes"."pointcloud-file".pointFile
  }

  select_test(){
    this.select("twobuildings.city.json","Building_1")
  }

  select(fileName, objName){
    //return 0;
    let newSelected = this.state.selected;
    if(newSelected.fileName == undefined){
      newSelected[fileName] = {"objects":[objName]}
    }
    else{
      newSelected[fileName]["objects"] = [objName]
    }
    this.setState({selected:newSelected})
  }

  //example state.selected: {"file.city.json":{"objects"[objName1,objName2]}}
  //becomes in getSelected function:
  // {"file.city.json":{"objects":[objName1,objName2], "file":this.state.cityFiles[fileName]}}
  //we do this conversion process when needed so we don't have to store+update the entire cityFile again
  // every time we want to do a conversion
  //this could be simplified to adding a "objectsSelected" property to state.cityFiles though (and iterate through that)

  //We list selected object names with a file to ensure the objects are unique, and so plugins can update
  //all a file's objects at once. This also avoids asynchronisity issues that updating a file's 'vertices' might cause

  getSelected(){
    let selected = this.state.selected
    let keys = Object.keys(selected)
    keys.forEach((fileName)=>{
      selected[fileName]["file"] = this.state.cityFiles[fileName]
    })
    return selected;
  }

  ModifyCityJSON(fileName, output){
    this.state.cityFiles[fileName] = output;
    console.log(this.state.cityFiles)
  }

  render(){

    //go through every uploaded file, add it to the canvas
    //this.state.cityFiles
    const objList = Object.keys(this.state.cityFiles).map((fileName,index) =>{
      let file = this.state.cityFiles[fileName]
      console.log(file)
      return this.displayObjList(file,fileName)
    });

    //TODO: make file inputs "multiple", change to iterate over them
    return (
      <VStack width="75%" height="100%" padding={5}>
        <div>
          <br/>
          Modification Plugins:
          <PluginList getSelected={this.getSelected} onResult={this.ModifyCityJSON}/>
          CityJSON Upload List:
          <FileControl upId={"cityUpload"} clearId={"cityClear"} fileType={".json"}
                clearText={"Clear CityJSON Files"} addFile={this.addFile} clearFiles={this.clearCityFiles}/>
          <input type={"button"} onClick={this.select_test} value={"Select Building_1"} />
          
          <br/>
          <div style={{position:"relative",width:800,height:600}}>
            <Canvas>
              <PerspectiveCamera position={[0,5,10]} fov={75} makeDefault/>
              <OrbitControls />
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Box position={[0, 0, 0]} />

              <Plane position={[0,0,0]} />
              {objList}
            </Canvas>
          </div>
        </div>
      </VStack>
    );
  }
}

export default VisualizationRoot;