
import React, { useRef, useState } from 'react'

import { Three } from 'three'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry } from 'three';

import CityObjects from './twobuildings.city.json';


function CustomMesh(props){
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  
    //bring the vertices down to something reasonable
    let verts = [];
    CityObjects.vertices.forEach(v=>{
      //console.log(v)
      verts.push(v.map(comp=>comp/10000.0));
      console.log(v);
    });
    verts = verts.flat();
    console.log(verts) //undefined
    let geo = CityObjects.CityObjects.Building_1.geometry[0].boundaries.flatMap(x=>x);
    //console.log(CityObjects.CityObjects.Building_1.geometry[0].boundaries)
    console.log(geo)
  
    geo = geo.flatMap(tri=>{
      console.log(tri);
      console.log(tri[0]);
      console.log(verts[tri[0]]);
      return [verts[tri[0]],verts[tri[1]],verts[tri[2]]]
    });
    console.log(geo)
    /*geo = geo.flatMap(tri=>{
      return [verts[tri[0],tri[1],tri[2]]]
    })*/
      
      /*tri=>{
      let x = [verts[tri[0],tri[1],tri[2]]]
      console.log(x)
      return x;
    });*/
  
    const geometry = new BufferGeometry();
    const vertices = new Float32Array(geo);//CityObjects.vertices.flat().map(v=>v/10000.0));
  
    
    console.log(vertices);
  
    const bufAttr = new BufferAttribute( vertices, 3 ) 
    geometry.setAttribute( 'position', bufAttr);
    //const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    //const mesh = new THREE.Mesh( geometry, material );
  
    return (
      <mesh
        {...props}
        geometry={geometry}
        ref={ref}
        scale={clicked ? 1.5 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)} >
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    )
  }

export default CustomMesh;