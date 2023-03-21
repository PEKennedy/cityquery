import React, { memo, useRef } from 'react';
import { VStack } from 'native-base';

import { Canvas, invalidate } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, CameraControls } from '@react-three/drei';
import Plane from '../3JS/Plane';
import CityObjectDisplay from '../3JS/cityObject';
import Box from '../3JS/Box';

<<<<<<< HEAD
import PointCloudObj from '../3JS/pointCloud';
import MultiLineObj from '../3JS/MultiLine';
import SurfaceObject from '../3JS/surface';

//given a file (need a file as it contains the both object and the vertices) and an object name,
//gives the proper jsx for display
const chooseObjectType = (cityFile, objectName,fileName,selected) => {
  console.log(objectName)
  var object = cityFile.CityObjects[objectName];
  if(object.geometry[0] == undefined){ //invalid object
    console.error(objectName+".geometry[0] was undefined");
    return <mesh visible={false}></mesh>
  }
  let type = object.geometry[0].type;

  let is_selected = false

  if(selected[fileName]){
    let fileObjs = selected[fileName]["objects"]
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
=======
import { colourFloatToHex } from '../3JS/3dUtils';

import { useContext } from 'react';
import { SelectionContext, MaterialsContext } from '../../constants/context';
import { MeshStandardMaterial, PointsMaterial, LineBasicMaterial, BackSide } from 'three';
import { colours } from '../../constants/colours';
>>>>>>> origin/master

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

  //console.log(objList)
  //PerspectiveCamera
  //TODO: make file inputs "multiple", change to iterate over them
  return (
    <MaterialsContext.Provider value={materialsContext}>
      <VStack width="70%" height="100%" padding={2} borderBottomRightRadius={8}>
        <input type="button" id={"test"} name={"test"} onClick={centerCamera} />
        <Canvas onPointerMissed={clearSelect} frameloop="demand">
          <PerspectiveCamera  position={[0,5,10]} fov={75} makeDefault/>
          <OrbitControls />
          <CameraControls ref={cameraRef}/>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          {objList}
        </Canvas>
      </VStack>
    </MaterialsContext.Provider>
  );
};

export default VisualizationRoot;
