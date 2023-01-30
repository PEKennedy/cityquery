import React, { useRef, useState } from 'react';

import { Canvas, useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry } from 'three';

import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

import PointCloudObj from '../3JS/pointCloud';

import CustomMesh from '../3JS/cityJSONLoader.js'
import Box from '../3JS/Box';
import Plane from '../3JS/Plane';
import { VStack } from 'native-base';
import MultiLineObj from '../3JS/MultiLine';
import SurfaceObject from '../3JS/surface';

import LoadScript from '../3JS/pyScript';
import { useEffect } from 'react';

import test from '../3JS/test.py'
import { async } from 'q';

//import { loadPyodide } from 'pyodide';

//const { loadPyodide } = require("pyodide");
/*async function hello_python() {
  let pyodide = await loadPyodide();
  return pyodide.runPythonAsync("1+1");
}*/


function RandomFuncComp(props){

  const [script, setScript] = useState("print('loading')");
  const [params, setParams] = useState(undefined);

  function runPy(code){
    return new Promise((resolve,reject)=>{
      window.languagePluginLoader.then(() => {
        window.pyodide.loadPackage([]).then(() => {
          resolve(window.pyodide.runPython(code))
        })
      })
    })
  }

  /*
    TODO:
    - Run getParams(), JSON.parse result, display appropriate inputs
    - on "Run Python", collect params into an array, pass 
  */
  const tabs = () =>{
    if(params == undefined){
      return undefined
    }
    let keys = Object.keys(params)
    //let vals = Object.values(params)
    let tabList = [];
    keys.forEach((paramName,index)=>{
      let type = params[paramName]
      if(type == "float"){
        tabList.push(<>
          <label for={paramName}>{paramName} </label>
          <input type={"number"} name={paramName} id={paramName}></input>
          <br/>
        </>)
      }
      else if(type == "int"){
        tabList.push(<>
          <label for={paramName}>{paramName} </label>
          <input type={"number"} name={paramName} id={paramName}></input>
          <br/>
        </>)
      }
      else if(type == "string"){
        tabList.push(<>
          <label for={paramName}>{paramName} </label>
          <input type={"text"} name={paramName} id={paramName}></input>
          <br/>
        </>)
      }
    })
    tabList.push(<></>);
    return tabList;
  }

  const getParams = (script) =>{
    runPy(script+"\ngetParams()").then((params) =>{
      console.log(params);
      setParams(JSON.parse(params))
    })
  }

  const runPlugin = () =>{
    runPy(script+
      "\nmodifyCityJSON("+
      JSON.stringify({"bla":"blabla","test":"fail"})+
      ","+
      JSON.stringify({"p1":12.5,"p2":3,"p3":"abc"})+
      ")"
    ).then((output)=>{
      
    });
  }

  const handleScriptChange = (e) =>{
    if (e.target.files) {
      const file = e.target.files[0]
      //console.log(file)

      const fr = new FileReader();

      fr.addEventListener("load",e=>{ //add an event listener for when the filereader has finished
        setScript(fr.result)
        getParams(fr.result)
        },()=>{
          this.clearFileInput(); //reset the file upload html component 
        })
      
      fr.readAsText(file);
    }

  }

  /*const clearCityFiles = (e) =>{
    this.setState({
      script:[],
    },()=>{
      //console.log(this.state.cityFiles);
      this.clearFileInput();
    })
  }

  const clearFileInput = () =>{
    document.getElementById("FileIn").value = '';
  }*/

//
  let parameters = tabs()
  return (
    <div>
      <input type="file" id="pyFile" name="pyFile" accept=".py" onChange={handleScriptChange}></input>

      <ul>
        {parameters}
      </ul>
      <input type="button" id="runPy" name="runPy" onClick={runPlugin}
            value="Run Python"/>
    </div>


  );


}



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

  async componentDidMount(){


    //OLD PYODIDE
    /*async function hello_python() {
      let pyodide = await loadPyodide();
      return pyodide.runPythonAsync("1+1");
    }
    
    hello_python().then((result) => {
      console.log("Python says that 1+1 =", result);
    });*/
  }

  clearFileInput(){
    document.getElementById("FileIn").value = '';
  }

  handleFileChange(e) {
    if (e.target.files) {
      const file = e.target.files[0]
      //console.log(file)

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
    //if(object is a mesh)
    //  return 'mesh'
    //if(object is a polygon terrain)
    //  return 'poly_terrain'
    //if(object is a heightmap terrain)
    //  return 'dem_terrain'
    //console.log(cityFile);
    //console.log(objectName);
    var object = cityFile.CityObjects[objectName];
    //console.log(object);

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

    //<input type="button" id="x" name="x" onClick={print_something()}></input>
    
    //camera={{position:[0,0,10], fov:75, }}
    //, lookAt:[0,0,1]
    //camera can be manipulated manually by passing certain props to <Canvas>
    //or we can install react-three-drei for additional components such as <PerspectiveCamera makeDefault fov={} position={} />
    //              <Box position={[1.2, 0, 0]} />
    //<RandomFuncComp/>
    //TODO: make file inputs "multiple", change to iterate over them
    return (
      <VStack width="75%" height="100%" padding={5}>
        <div>
          <br/>
          <RandomFuncComp/>
          <input type="file" id="FileIn" name="filename" onChange={this.handleFileChange} accept=".json"></input>
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