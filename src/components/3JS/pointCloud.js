
import React, { useRef, useState } from 'react'
import { BufferAttribute, BufferGeometry } from 'three';

import {transform, colourVerts} from './3dUtils'

//Loads a pointcloud from a cityjson file which directly contains the point data
/**
 * 
 * @param {*} cityJSONFile 
 * @param {*} objName 
 * @returns 
 */
function loadCityJsonPointCloud(cityJSONFile,objName){
    if(cityJSONFile.CityObjects == undefined){
        console.log("provided cityJSON file did not contain \"CityObjects\"")
        return;
    }
    var obj = cityJSONFile.CityObjects[objName];
    
    if(obj == undefined){
        console.error("specified CityJSON object ("+objName+") was not contained in the provided file")
        return;
    }

    
    //console.log(obj);
    let semantics = obj.geometry[0].semantics;
    var vert_inds = obj.geometry[0].boundaries;
    var verts = cityJSONFile.vertices;
    let obj_transform = cityJSONFile.transform;

    var verts_filtered = [];
    let colours = []

    vert_inds.forEach((verts_index, i)=>{
        verts_filtered.push(verts[verts_index]);
        colours.push(...colourVerts(semantics,i,1));
    })
    colours = new Float32Array(colours);
    const vertices = new Float32Array(
        verts_filtered.map((v)=>transform(v,obj_transform)).flat(2)
    );
    return [vertices,colours];
}

//The visual representation of a pointcloud
function PointCloudObj(props){

    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef();
    // Subscribe this component to the render-loop, rotate the mesh every frame
    //useFrame((state, delta) => (ref.current.rotation.x += 0.01))

    if(props.cityFile == undefined){ //not loaded yet
        //console.log("pt cloud not defined yet")
        return (<points ref={ref} visible={false}></points>);
    }

    console.log(props.cityFile);
    console.log(props.object);

    let [verts, colours] = loadCityJsonPointCloud(props.cityFile,props.object);
    //color={0xFFFFFF}

    if(verts == undefined){
        return (<points ref={ref} visible={false}></points>);
    }
    return (
        <points {...props} ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={verts.length / 3} array={verts} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={colours.length / 3} array={colours} itemSize={3} /> 
            </bufferGeometry>
            <pointsMaterial color={0xFFFFFF} size={0.25} vertexColors={true}/>
        </points>
    );
    

}

export default PointCloudObj;