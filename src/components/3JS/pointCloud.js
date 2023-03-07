
import React, { useRef, useState } from 'react'
import { BufferAttribute, BufferGeometry } from 'three';

import {transform, colourVerts, getSelectedTint} from './3dUtils'

//Loads a pointcloud from a cityjson file which directly contains the point data
/**
 * 
 * @param {*} cityJSONFile 
 * @param {*} objName 
 * @returns 
 */
function loadCityJsonPointCloud(cityJSONFile,geometry){

    
    let semantics = geometry.semantics;
    var vert_inds = geometry.boundaries;
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
        return (<points ref={ref} visible={false}></points>);
    }

    let tint = getSelectedTint(props.selected)

    let geometry = props.cityFile.CityObjects[props.objName].geometry[props.geoIndex];

    let [verts, colours] = loadCityJsonPointCloud(props.cityFile,geometry);

    if(verts == undefined){
        return (<points ref={ref} visible={false}></points>);
    }

    return (
        <points {...props} ref={ref} onClick={props.makeSelected}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={verts.length / 3} array={verts} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={colours.length / 3} array={colours} itemSize={3} /> 
            </bufferGeometry>
            {props.children}
            <pointsMaterial color={tint} size={0.25} vertexColors={!props.selected}/>
        </points>
    );
    

}

export default PointCloudObj;