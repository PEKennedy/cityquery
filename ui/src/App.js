import logo from './logo.svg';
import './App.css';
import React, { useRef, useState } from 'react';
import axios from 'axios';

import { Canvas, useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry } from 'three';

import { loadPointCloud, PointCloudObj } from './pointCloud';

import CustomMesh from './cityJSONLoader.js'
//import CityObjects from './twobuildings.city.json';
//import CityObjects from './example.city.json';

//const backendURL = 'http://localhost:5000/'

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
    cityFiles: [],
    pointCloudGeo : undefined,
    details:[],
  }

  constructor(props){
    super(props);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.clearCityFiles = this.clearCityFiles.bind(this);
  }

  componentDidMount() {

  }

  handleFileChange(e) {
    if (e.target.files) {
      const file = e.target.files[0]
      console.log(file)

      const fr = new FileReader();

      fr.addEventListener("load",e=>{
        console.log(JSON.parse(fr.result));
        this.setState({
          cityFiles:[...this.state.cityFiles, JSON.parse(fr.result)]
        },()=>{
          console.log(this.state.cityFiles);
        })
      });
      fr.readAsText(file);

      /*this.setState({
        cityFiles:[...this.state.cityFiles, CityObjects]
      },()=>{
        console.log(this.state.cityFiles);
      })*/
    }
  }

  clearCityFiles(e){
    this.setState({
      cityFiles:[]
    },()=>{
      console.log(this.state.cityFiles);
    })
  }

  parseObjectType(object){
    //if(object is a mesh)
    //  return 'mesh'
    //if(object is a pointcloud)
    //  return 'pointcloud'
    //if(object is an external pointcloud)
    //  return 'ext_pointcloud'
    //if(object is a polygon terrain)
    //  return 'poly_terrain'
    //if(object is a heightmap terrain)
    //  return 'dem_terrain'
  }

  render(){

    //let filesList = [];
    //if(this.state.cityFiles != undefined){

    //+ " (" + file.size + ")"
    let filesList = this.state.cityFiles.map((file) => {
    //console.log(file);
      <li>{file.name }</li>
    });
    //console.log(filesList);

    return (
      <div>

        <br/>

        <input type="file" id="myFile" name="filename" onChange={this.handleFileChange}></input>
        <input type="button" id="clearCityFiles" name="clearCityFiles" onClick={this.clearCityFiles}
          value="Clear CityJSON Files"/>

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
          <PointCloudObj position={[5, 0, 0]} cityFile={this.state.cityFiles[0]} object={'25749c9a-e242-4f0e-bfb4-c1e28f2211f1'}/>
        </Canvas>

      </div>
    );
  }
}

export default App;
