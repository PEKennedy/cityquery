import React, { memo, useRef } from 'react';
import { VStack } from 'native-base';

import { Canvas, invalidate } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, CameraControls } from '@react-three/drei';
import Plane from '../3JS/Plane';
import CityObjectDisplay from '../3JS/cityObject';
import Box from '../3JS/Box';

import { colourFloatToHex } from '../3JS/3dUtils';

import { useContext } from 'react';
import { SelectionContext, MaterialsContext } from '../../constants/context';
import { MeshStandardMaterial, PointsMaterial, LineBasicMaterial, BackSide } from 'three';
import { colours } from '../../constants/colours';
import LASObj from '../3JS/LAS';

//takes a file's contents, returns a list of objects as proper jsx types
const displayObjList = (cityJSONFile,fileName) => {
  //console.log(cityJSONFile.CityObjects);
  const objNames = Object.keys(cityJSONFile.CityObjects);
  var objs = objNames.map((name)=>{
    return <CityObjectDisplay cityFile={cityJSONFile} objectName={name}
     fileName={fileName} key={fileName.concat(name)}/>
  });

  return objs;
}



const VisualizationRoot = (props) => {
  const cityFiles = props.cityFiles;
  const lasFiles = props.lasFiles;
  const { clearSelect, getSelected } = useContext(SelectionContext);

  const cameraRef = useRef();
  const x = useRef();
  console.log("render root")

  //if a transparent material was wanted: , transparent:true, opacity:0.75, side:BackSide
  const selected_colour = colourFloatToHex(colours.selected)
  const standMatSelected = new MeshStandardMaterial({color:selected_colour, vertexColors:false})
  const standMatUnSelected = new MeshStandardMaterial({color:0xFFFFFF, vertexColors:true})
  const pointMatSelected = new PointsMaterial({color:selected_colour, vertexColors:false, size:0.25})
  const pointMatUnSelected = new PointsMaterial({color:0xFFFFFF, vertexColors:true, size:0.25})
  const lineMatSelected = new LineBasicMaterial({color:selected_colour, vertexColors:false, linewidth:1})
  const lineMatUnSelected = new LineBasicMaterial({color:0xFFFFFF, vertexColors:true, linewidth:1})

  const materialsContext = {standMatSelected, standMatUnSelected, pointMatSelected, pointMatUnSelected, 
    lineMatSelected, lineMatUnSelected}

  const centerCamera = () =>{ //TODO: Doesn't work?
    console.log("Center Camera")
    /*let selected = getSelected()
    let keys = Object.keys(selected)

    let average_position = [0,0,0]
    let count = 0
    keys.forEach((fileName)=>{
      let fileTranslation = selected[fileName]["file"]["transform"]["translate"]
      average_position[0] += fileTranslation[0]
      average_position[1] += fileTranslation[1]
      average_position[2] += fileTranslation[2]
      count += 1;
    })
    if(count == 0) return;
    average_position[0] /= count;
    average_position[1] /= count;
    average_position[2] /= count;*/

    /*cameraRef.current.position.x = average_position[0]
    cameraRef.current.position.y = average_position[1]
    cameraRef.current.position.z = average_position[2]*/
    cameraRef.current?.fitToBox(x.current,true)//meshRef.current,true
    invalidate()
  }

  let objList = [];

  Object.keys(cityFiles).forEach((fileName,index) =>{
    let file = cityFiles[fileName]
    objList.push(...displayObjList(file,fileName))
  });

  let LASList = [];
  Object.keys(lasFiles).forEach((fileName,index) =>{
    let file = lasFiles[fileName]
    //console.log(file)
    LASList.push(<LASObj file={file} fileName={fileName} key={fileName}/>)
  }); 

  //console.log(objList)
  //PerspectiveCamera
  //TODO: make file inputs "multiple", change to iterate over them
  return (
    <MaterialsContext.Provider value={materialsContext}>
      <VStack width="75%" height="100%" padding={2} borderBottomRightRadius={8}>
        <input type="button" id={"test"} name={"test"} onClick={centerCamera} />
        <Canvas onPointerMissed={clearSelect} frameloop="demand">
          <PerspectiveCamera  position={[0,5,10]} fov={75} makeDefault/>
          <OrbitControls />
          <CameraControls ref={cameraRef}/>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[0, 0, 0]} ref={x}/>
          <Plane position={[0,0,0]} />
          {objList}
          {LASList}
        </Canvas>
      </VStack>
    </MaterialsContext.Provider>
  );
};

export default VisualizationRoot;