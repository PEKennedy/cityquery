import React, { memo, useRef } from 'react';
import { VStack } from 'native-base';

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, CameraControls } from '@react-three/drei';
import CityObjectDisplay from '../3JS/cityObject';
import { colourFloatToHex } from '../3JS/3dUtils';

import { useContext } from 'react';
import { SelectionContext, MaterialsContext } from '../../constants/context';
import { MeshStandardMaterial, PointsMaterial, LineBasicMaterial } from 'three';
import { colours } from '../../constants/colours';

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
  const controlsRef = useRef();
  const center = useRef();
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

  //let boundingBox = new Box3()
  const centerCamera = () =>{ //TODO: Doesn't work?
    /*console.log("Center Camera")
    let selected = getSelected()
    let keys = Object.keys(selected)

    let average_position = [0,0,0]
    //let count = 0
    console.log(controlsRef.current?.enabled)

    let points = [];

    keys.forEach((fileName)=>{
      let fileTranslation = selected[fileName]["file"]["transform"]["translate"]
      points.push(new Vector3(fileTranslation[0],fileTranslation[2],fileTranslation[1]))
    })
    if(points.length == 0) return;
    boundingBox.setFromPoints(points)

    console.log(boundingBox)*/
    //controlsRef.current.enabled = false
    controlsRef.current?.fitToBox(center.current,true)//meshRef.current,true
    //controlsRef.current.enabled = true

    //console.log(controlsRef.current?.enabled)
    //cameraRef.current?.update()
    //controlsRef.current?.update();
    //invalidate()
  }

  let objList = [];

  Object.keys(cityFiles).forEach((fileName,index) =>{
    let file = cityFiles[fileName]
    objList.push(...displayObjList(file,fileName))
  });


  //TODO: make file inputs "multiple", change to iterate over them
  return (
    <MaterialsContext.Provider value={materialsContext}>
      <VStack width="70%" height="100%" padding={2} borderBottomRightRadius={8}>
        <input type="button" id={"test"} name={"test"} onClick={centerCamera} />
        <Canvas onPointerMissed={clearSelect} >
          <PerspectiveCamera  position={[0,5,10]} fov={75} makeDefault ref={cameraRef}/>
          <CameraControls ref={controlsRef} />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <group ref={center}>
            {objList}
          </group>
        </Canvas>
      </VStack>
    </MaterialsContext.Provider>
  );
};

export default VisualizationRoot;
