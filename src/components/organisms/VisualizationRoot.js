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
    cityFiles: [],
  }

  constructor(props){
    super(props);
    this.clearCityFiles = this.clearCityFiles.bind(this);
    this.clearFileInput = this.clearFileInput.bind(this);
    this.chooseObjectType = this.chooseObjectType.bind(this);
    this.addFile = this.addFile.bind(this);
  }

  addFile(file){
    this.setState({ cityFiles:[...this.state.cityFiles,JSON.parse(file)] })
  }

  clearFileInput(){
    document.getElementById("FileIn").value = '';
  }

  //clear all files from the canvas
  clearCityFiles(){
    this.setState({
      cityFiles:[],
    })
  }

  //takes a file's contents, returns a list of objects as proper jsx types
  displayObjList(cityJSONFile){
    //console.log(cityJSONFile.CityObjects);
    const keys = Object.keys(cityJSONFile.CityObjects);
    var objs = keys.map((key)=>{
      return this.chooseObjectType(cityJSONFile,key);
    });

    return (
      <>
        {objs}
      </>
    );
  }

  //given a file (need a file as it contains the both object and the vertices) and an object name,
  //gives the proper jsx for display
  chooseObjectType(cityFile,objectName){

    var object = cityFile.CityObjects[objectName];

    if(object.geometry[0] == undefined){ //invalid object
      console.error(objectName+".geometry[0] was undefined");
      return <mesh visible={false}></mesh>
    }

    if(object.geometry[0].type == "MultiPoint"){
      return <PointCloudObj position={[5, 0, 0]} cityFile={cityFile} object={objectName}/>;
    }
    if(object.geometry[0].type == "MultiLineString"){
      return <MultiLineObj position={[5, 0, 0]} cityFile={cityFile} object={objectName}/>;
    }
    if(object.geometry[0].type == "MultiSurface" || object.geometry[0].type == "CompositeSurface"){
      return <SurfaceObject position={[5, 0, 0]} cityFile={cityFile} object={objectName}/>;
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

  render(){

    //go through every uploaded file, add it to the canvas
    const objList = this.state.cityFiles.map((file,index) =>{
      return this.displayObjList(file)
    });

    //TODO: make file inputs "multiple", change to iterate over them
    return (
      <VStack width="75%" height="100%" padding={5}>
        <div>
          <br/>
          Plugin Upload List:
          <PluginList/>
          CityJSON Upload List:
          <FileControl upId={"cityUpload"} clearId={"cityClear"} fileType={".json"}
                clearText={"Clear CityJSON Files"} addFile={this.addFile} clearFiles={this.clearCityFiles}/>
          <br/>
          This demos <code>react-three-fiber</code>, a library for using three.js and react together:
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