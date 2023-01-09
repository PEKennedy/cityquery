import logo from './logo.svg';
import './App.css';
import React, { useRef, useState } from 'react';

import { Canvas, useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry } from 'three';

import { loadPointCloud, PointCloudObj } from './pointCloud';

import CustomMesh from './cityJSONLoader.js'

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  // Return the view, these are regular Threejs elements expressed in JSX

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>

  )
}

//<CustomMesh position={[1.7,0,0]} />
//In another file I have a cityJSON test I'm working on

//<CustomMesh position={[5,0,0]}/>

class App extends React.Component {

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

  clearCityFiles(e){
    this.setState({
      cityFiles:[],
      cityFilesMetaData:[]
    },()=>{
      //console.log(this.state.cityFiles);
      this.clearFileInput();
    })
  }

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
    const filesList = this.state.cityFilesMetaData.map((file) => 
      <li>{file.name}</li>
    );
    //console.log(filesList);
    //<PointCloudObj position={[5, 0, 0]} cityFile={this.state.cityFiles[0]} object={'25749c9a-e242-4f0e-bfb4-c1e28f2211f1'}/>
    const objList = this.state.cityFiles.map((file) =>
      this.displayObjList(file)
    );
    return (
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
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
          {objList}
        </Canvas>

      </div>
    );
  }
}

export default App;
