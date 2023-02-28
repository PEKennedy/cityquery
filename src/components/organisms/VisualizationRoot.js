import React, { memo, useRef } from 'react';
import { VStack } from 'native-base';

import { Canvas, invalidate } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import Plane from '../3JS/Plane';
import CityObjectDisplay from '../3JS/cityObject';
import Box from '../3JS/Box';

import { getSelectedTint } from '../3JS/3dUtils';

import { useContext } from 'react';
import { SelectionContext, MaterialsContext } from '../../constants/context';
import { MeshStandardMaterial } from 'three';

//takes a file's contents, returns a list of objects as proper jsx types
const displayObjList = (cityJSONFile,fileName) => {
  //console.log(cityJSONFile.CityObjects);
  const objNames = Object.keys(cityJSONFile.CityObjects);
  var objs = objNames.map((name)=>{
    return <CityObjectDisplay cityFile={cityJSONFile} objectName={name}
     fileName={fileName} />
  });

  return (
    <>
      {objs}
    </>
  );
}



const VisualizationRoot = memo((props) => {
  const cityFiles = props.cityFiles;
  const { clearSelect, getSelected } = useContext(SelectionContext);

  const cameraRef = useRef();
  console.log("render root")

  //<meshStandardMaterial vertexColors={!props.selected} color={tint}/>
  let selectedTint = getSelectedTint(true)
  let unselectedTint = getSelectedTint(false)
  const standMatSelected = new MeshStandardMaterial({color:selectedTint, vertexColors:false})
  const standMatUnSelected = new MeshStandardMaterial({color:unselectedTint, vertexColors:true})
  const materialsContext = {standMatSelected, standMatUnSelected}

  const centerCamera = () =>{ //TODO: Doesn't work?
    console.log("Center Camera")
    let selected = getSelected()
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
    average_position[2] /= count;

    cameraRef.current.position.x = average_position[0]
    cameraRef.current.position.y = average_position[1]
    cameraRef.current.position.z = average_position[2]
    invalidate()
  }

  const objList = Object.keys(cityFiles).map((fileName,index) =>{
    let file = cityFiles[fileName]
    return displayObjList(file,fileName)
  });

  //TODO: make file inputs "multiple", change to iterate over them
  return (
    <MaterialsContext.Provider value={materialsContext}>
      <VStack width="75%" height="100%" padding={5}>
        <input type="button" id={"test"} name={"test"} onClick={centerCamera} />
        <Canvas onPointerMissed={clearSelect} frameloop="demand">
          <PerspectiveCamera ref={cameraRef} position={[0,5,10]} fov={75} makeDefault/>
          <OrbitControls />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[0, 0, 0]} />
          <Plane position={[0,0,0]} />
          { objList}
        </Canvas>
      </VStack>
    </MaterialsContext.Provider>
  );
})

export default VisualizationRoot;