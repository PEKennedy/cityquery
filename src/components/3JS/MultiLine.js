import React, { useRef, useState } from 'react'

import { Canvas, useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry, LineBasicMaterial } from 'three';
import {scale, transform, reverseWindingOrder, colourVerts} from './3dUtils'

//test funnction for getting and displaying a cityjson mesh (not working)
function MultiLineObj(props){
    //var CityObjects = props.CityObjects;
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    const groupRef = useRef()
    // Subscribe this component to the render-loop, rotate the mesh every frame
    //useFrame((state, delta) => (ref.current.rotation.x += 0.01))

    if(props.cityFile == undefined){ //not loaded yet
        return (<line ref={ref} visible={false}></line>);
    }
    
    console.log(props.cityFile);
    console.log(props.object);

    var object = props.cityFile.CityObjects[props.object];
    console.log(object);

    var line_segments = object.geometry[0].boundaries;

    const lines = line_segments.map((segment, index) =>{
        var verts_filtered = [];
        segment.forEach((index)=>{
            verts_filtered.push(props.cityFile.vertices[index]);
        })
        const verts = new Float32Array(verts_filtered.flat(2));
        
        return <line {...props} ref={ref} key={verts.toString()}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={verts.length / 3} array={verts} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color={'orange'}/>
        </line>
    });

    return (
        <group ref={groupRef}>
            {lines}
        </group>
      )
}

export default MultiLineObj;