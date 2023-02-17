import React, { useRef, useState } from 'react'

import { Canvas, useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry, LineBasicMaterial } from 'three';
import {transform, colourVerts, getSelectedTint} from './3dUtils'

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
    let semantics = object.geometry[0].semantics;
    let obj_transform = props.cityFile.transform;

    const lines = line_segments.map((segment, index) =>{
        var verts_filtered = [];
        let colours = []
        segment.forEach((index)=>{
            verts_filtered.push(props.cityFile.vertices[index]);
        })
        colours.push(...colourVerts(semantics,index,segment.length));
        const verts = new Float32Array(
            verts_filtered.map((v)=>transform(v,obj_transform)).flat(2)
        );
        colours = new Float32Array(colours)

        let tint = getSelectedTint(props.selected)

        return <line {...props} ref={ref} key={verts.toString()}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={verts.length / 3} array={verts} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={colours.length / 3} array={colours} itemSize={3} /> 
            </bufferGeometry>
            <lineBasicMaterial vertexColors={!props.selected} color={tint}/>
        </line>
    });

    return (
        <group ref={groupRef}>
            {lines}
        </group>
      )
}

export default MultiLineObj;