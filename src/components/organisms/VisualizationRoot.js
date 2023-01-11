import React, { useRef, useState } from 'react';

import { Canvas, useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry } from 'three';

import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

import PointCloudObj from '../3JS/pointCloud';

import CustomMesh from '../3JS/cityJSONLoader.js'
import Box from '../3JS/Box';
import Plane from '../3JS/Plane';
import { VStack } from 'native-base';

class VisualizationRoot extends React.Component {
  state = {
    cityFilesMetaData: [],
    cityFiles: [],
    details:[],
  }

  constructor(props){
    super(props);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.clearCityFiles = this.clearCityFiles.bind(this);
    this.clearFileInput = this.clearFileInput.bind(this);
    this.chooseObjectType = this.chooseObjectType.bind(this);
  }

  componentDidMount() {

  }

  clearFileInput(){
    document.getElementById("FileIn").value = '';
  }

  handleFileChange(e) {
    if (e.target.files) {
      const file = e.target.files[0]
      console.log(file)

      const fr = new FileReader();

      fr.addEventListener("load",e=>{ //add an event listener for when the filereader has finished
        //console.log(JSON.parse(fr.result));
        this.setState({ //add the parsed file to the file list
          cityFiles:[...this.state.cityFiles, JSON.parse(fr.result)],
          cityFilesMetaData:[...this.state.cityFilesMetaData,file]
        },()=>{
          //console.log(this.state.cityFiles);
          this.clearFileInput(); //reset the file upload html component 
        })
      });
      fr.readAsText(file);
    }
  }

  //clear all files from the canvas
  clearCityFiles(e){
    this.setState({
      cityFiles:[],
      cityFilesMetaData:[]
    },()=>{
      //console.log(this.state.cityFiles);
      this.clearFileInput();
    })
  }

  //takes a file's contents, returns a list of objects as proper jsx types
  displayObjList(cityJSONFile){
    console.log(cityJSONFile.CityObjects);
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
    //if(object is a mesh)
    //  return 'mesh'
    //if(object is a polygon terrain)
    //  return 'poly_terrain'
    //if(object is a heightmap terrain)
    //  return 'dem_terrain'
    console.log(cityFile);
    console.log(objectName);
    var object = cityFile.CityObjects[objectName];
    console.log(object);

    if(object.geometry[0] != undefined && object.geometry[0].type == "MultiPoint"){
      return <PointCloudObj position={[5, 0, 0]} cityFile={cityFile} object={objectName}/>;
    }
    /*if(object.attributes != undefined && object.attributes["pointcloud-file"] != undefined){
      return <PointCloudObj position={[5, 0, 0]} cityFile={cityFile} object={objectName}/>;
    }*/

    //default
    return <Box position={[-2.4, 0, 0]}/>

    //Some notes:
    //- cityJSON files with PointClouds always specify an extension you could check for in the file
    //- For an 'internal' pointcloud (ie. a pt cloud with the vertices specified in the file)
    // it seems we can check for a "geometry" of type "MultiPoint"
    //- For an 'external' pointcloud, we can check for an object with no geometry, 
    //but with "attributes"."pointcloud-file".pointFile
    //- For a mesh, check for a geometry of type "Multisurface" as a starting point. There are many
    //different "types" of geometry in the cityJson spec, so this worries me the most

    //Might just let pointcloud determine itself whether its external or not
    // (such that there is only 1 type of pointcloud object in our project),
    // but we still need to parse both cases here
  }

  render(){

    //+ " (" + file.size + ")"
    //console.log(this.state.cityFilesMetaData)
    const filesList = this.state.cityFilesMetaData.map((file,index) => 
      <li key={file.name}>{file.name}</li>
    );
    
    //go through every uploaded file, add it to the canvas
    const objList = this.state.cityFiles.map((file,index) =>
      this.displayObjList(file)
    );
    
    //camera={{position:[0,0,10], fov:75, }}
    //, lookAt:[0,0,1]
    //camera can be manipulated manually by passing certain props to <Canvas>
    //or we can install react-three-drei for additional components such as <PerspectiveCamera makeDefault fov={} position={} />
    return (
      <VStack width="95%" height="75%" backgroundColor="#FFFFFF">
        <div>

          <br/>

          <input type="file" id="FileIn" name="filename" onChange={this.handleFileChange} ref={this.fileInRef} accept=".json"></input>
          <input type="button" id="clearCityFiles" name="clearCityFiles" onClick={this.clearCityFiles}
            value="Clear CityJSON Files"/>
          <br/>
          Uploaded File List:
          <br/>
          <ul>{filesList}</ul>
          <br/>
          This demos <code>react-three-fiber</code>, a library for using three.js and react together:
          <br/>
          <div style={{position:"relative",width:800,height:600}}>
            <Canvas>
              <PerspectiveCamera position={[0,0,10]} fov={75} makeDefault/>
              <OrbitControls />
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Box position={[-1.2, 0, 0]} />
              <Box position={[1.2, 0, 0]} />
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