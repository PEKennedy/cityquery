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
            if(mesh_geometry.dispose){
                mesh_geometry.dispose()
            }
        }
    })


    let geometry = props.cityFile.CityObjects[props.objName].geometry[props.geoIndex];
    let semantics = geometry.semantics;
    var surfaces = geometry.boundaries;

    let obj_transform = props.cityFile.transform;
    let all_verts = props.cityFile.vertices;

    //let combined_geo = {};
    //let surface_meshes = {};
    let mat = props.selected ? props.mata : props.matb
    //use memoization to ensure the geometry is only rebuilt if it actually changes

    const mesh_geometry = useMemo(()=>{
        let surface_meshes = surfaces.map((surface, index) =>{
            return generateSurface(surface,semantics,index,obj_transform,all_verts,false);
        });
        let combined_geo = BufferGeometryUtils.mergeBufferGeometries(surface_meshes)
        combined_geo.computeVertexNormals()
        combined_geo = BufferGeometryUtils.mergeVertices(combined_geo)
        return combined_geo
    },[geometry,obj_transform,all_verts])

    const surfaceMesh = useMemo(()=>{
        console.log(props.selected)
        return <mesh {...props} ref={ref} onClick={props.makeSelected} material={mat}>
            <primitive object={mesh_geometry} />
        </mesh>
    },[mesh_geometry, mat])

    /*const surfaceMesh = useMemo(()=>{
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
        //<meshStandardMaterial vertexColors={true} color={0xFFFFFF}/>
        //let material = props.is_selected ? 
        console.log(props.selected)
        return (
            <mesh {...props} ref={ref} onClick={props.makeSelected} material={mat}>
                <primitive object={combined_geo} />
                {props.children}
                
            </mesh>
        )
    },//,props.selected
    [geometry,obj_transform,all_verts,props.selected]) //dependencies*/

    return surfaceMesh;



}

export default SurfaceObject;