import React from 'react';
import { VStack } from 'native-base';

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

import Box from '../3JS/Box';
import Plane from '../3JS/Plane';

//takes a file's contents, returns a list of objects as proper jsx types
const displayObjList = (cityJSONFile) => {
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


const VisualizationRoot = (props) => {
  const { cityFiles } = props;

  const objList = Object.values(cityFiles).map((file,index) =>{
    console.log(file)
    return displayObjList(file)
  });

  //TODO: make file inputs "multiple", change to iterate over them
  return (
    <VStack width="75%" height="100%" padding={5}>
      <div>
        <div style={{position:"relative",width:800,height:550}}>
          <Canvas>
            <PerspectiveCamera position={[0,5,10]} fov={75} makeDefault />
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

export default VisualizationRoot;