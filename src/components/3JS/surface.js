import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Canvas, useFrame } from '@react-three/fiber'

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import {colourVerts, getSelectedTint, generateSurface} from './3dUtils'
import { Geometry } from 'three-stdlib';



//test funnction for getting and displaying a cityjson mesh (not working)
function SurfaceObject(props){
    //var CityObjects = props.CityObjects;
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Subscribe this component to the render-loop, rotate the mesh every frame
    //useFrame((state, delta) => (ref.current.rotation.x += 0.01))

    //call dispose on cleanup (useEffect will call any returned function when the component unmounts)
    useEffect(()=>{
        return function cleanup(){
            if(combined_geo.dispose){
                combined_geo.dispose()
            }
        }
    })


    
    let semantics = props.geometry.semantics;
    var surfaces = props.geometry.boundaries;

    let obj_transform = props.cityFile.transform
    let all_verts = props.cityFile.vertices;

    let combined_geo = {};
    //let surface_meshes = {};

    //use memoization to ensure the geometry is only rebuilt if it actually changes
    const surfaceMesh = useMemo(()=>{
        if(props.cityFile == undefined){ //not loaded yet
            return (<mesh ref={ref} visible={false}></mesh>);
        }
        let surface_meshes = surfaces.map((surface, index) =>{
            //console.log(surface);
            return generateSurface(surface,semantics,index,obj_transform,all_verts,false);
        });
        combined_geo = BufferGeometryUtils.mergeBufferGeometries(surface_meshes)
        combined_geo.computeVertexNormals()
        combined_geo = BufferGeometryUtils.mergeVertices(combined_geo)
        //let tint = getSelectedTint(props.selected)
        //<meshStandardMaterial vertexColors={!props.selected} color={tint}/>

        return (
            <mesh {...props} ref={ref} onClick={props.makeSelected}>
                <primitive object={combined_geo} />
                {props.children}
                <meshStandardMaterial vertexColors={true} color={0xFFFFFF}/>
            </mesh>
        )
    },
    [props.geometry,obj_transform,all_verts]) //dependencies

    return surfaceMesh;



}

export default SurfaceObject;