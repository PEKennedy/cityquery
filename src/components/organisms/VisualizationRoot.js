import React from 'react';
import { VStack } from 'native-base';

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import Plane from '../3JS/Plane';
import CityObjectDisplay from '../3JS/cityObject';
import Box from '../3JS/Box';

import { useContext } from 'react';
import { PluginMenuContext } from '../../constants/context';

//takes a file's contents, returns a list of objects as proper jsx types
const displayObjList = (cityJSONFile,fileName,selected) => {
  //console.log(cityJSONFile.CityObjects);
  const objNames = Object.keys(cityJSONFile.CityObjects);
  var objs = objNames.map((name)=>{
    return <CityObjectDisplay cityFile={cityJSONFile} objectName={name}
     fileName={fileName} selected={selected}/>
  });

  return (
    <>
      {objs}
    </>
  );
}

const VisualizationRoot = (props) => {
  const cityFiles = props.cityFiles;
  const selected = props.selected;
  const { clearSelect } = useContext(PluginMenuContext);

  const objList = Object.keys(cityFiles).map((fileName,index) =>{
    let file = cityFiles[fileName]
    return displayObjList(file,fileName,selected)
  });

  //onPointerMissed={clearSelect}
  //TODO: make file inputs "multiple", change to iterate over them
  return (
    <VStack width="75%" height="100%" padding={5}>
      <Canvas onPointerMissed={clearSelect}>
        <PerspectiveCamera position={[0,5,10]} fov={75} makeDefault/>
        <OrbitControls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[0, 0, 0]} />
        <Plane position={[0,0,0]} />
        { objList}
      </Canvas>
    </VStack>
  );
}

export default VisualizationRoot;