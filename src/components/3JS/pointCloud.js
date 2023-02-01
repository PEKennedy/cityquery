//contains functions for loading pointcloud data 
//(in the json file and external file)
//also contains functions for threejs to display it

//import { Las } from 'las-js'; //from https://github.com/laslibs/las-js
/// *** ^^ wrong kind of "LAS" file good for reference though (fetching uri content)

import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry } from 'three';

//figures out whether the pointcloud is internal or external, then loads it
function loadPointCloud(cityJSONFile,objIndex){
    //if(is external)
    // return loadExternalLASPointCloud(cityJSONFile,objIndex)
    //else
    return loadCityJsonPointCloud(cityJSONFile,objIndex);
}

//TODO
//parses a pointcloud LAS file into something usable
async function parseLASFile(){

}

/**
 * Loads a pointcloud from the specified external LAS file 
 * @param {*} cityJSONObj The cityJSONObj with the attribute to parse
 * @returns vertex position list
 */
async function loadExternalLASPointCloud(cityJSONObj, file){
    var attribs = cityJSONObj.attributes["pointcloud-file"];
    var fileType = attribs.mimeType;
    var uri = attribs.pointFile;

    console.log(fileType);
    console.log(uri);

    if(!fileType.includes(".las")){
        console.error("Attempted to load an external pointcloud file which was not .las");
        return;
    }

    try{

        console.log(file);
        return [0,0.1,0.1];

    } catch (error) {
        console.log(error);
    }
}

//requires use of the cityJSON pointcloud extension!
//TODO: cityGML with pointcloud, see if it converts correctly to cityJSON w/ pointcloud extension

//Loads a pointcloud from a cityjson file which directly contains the point data
/**
 * 
 * @param {*} cityJSONFile 
 * @param {*} objIndex 
 * @returns 
 */
function loadCityJsonPointCloud(cityJSONFile,objIndex){
    if(cityJSONFile.CityObjects == undefined){
        console.log("provided cityJSON file did not contain \"CityObjects\"")
        return;
    }
    var obj = cityJSONFile.CityObjects[objIndex];

    if(obj == undefined){
        console.error("specified CityJSON object ("+objIndex+") was not contained in the provided file")
        return;
    }

    console.log(obj);

    var vert_inds = obj.geometry[0].boundaries;
    var verts = cityJSONFile.vertices;

    var verts_filtered = [];

    //console.log(verts);

    vert_inds.forEach((index)=>{
        verts_filtered.push(verts[index]);
    })

    //console.log(verts_filtered)

    const vertices = new Float32Array(verts_filtered.flat(2));//.map(v=>v/2));//CityObjects.vertices.flat().map(v=>v/10000.0));

    return vertices;
}

//The visual representation of a pointcloud
function PointCloudObj(props){

    //console.log(props);
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef();
    // Subscribe this component to the render-loop, rotate the mesh every frame
    //useFrame((state, delta) => (ref.current.rotation.x += 0.01))

    if(props.cityFile == undefined){ //not loaded yet
    //if(props.object == undefined){
        //console.log("pt cloud not defined yet")
        return (<points ref={ref} visible={false}></points>);
    }

    console.log(props.cityFile);
    console.log(props.object);

    var verts = loadPointCloud(props.cityFile,props.object);
    //var verts = loadPointCloud(props.object);
    console.log(verts)
    if(verts == undefined){
        return (<points ref={ref} visible={false}></points>);
    }
    return (
        <points
            {...props}
            ref={ref}
        >
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={verts.length / 3} array={verts} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial color={0xFFFFFF} size={0.25}/>
        </points>
    );
    

}

export default PointCloudObj;