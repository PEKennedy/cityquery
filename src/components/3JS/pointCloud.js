
import React, { useMemo, useRef, useState } from 'react'

import  {transform, colourVerts } from './3dUtils'

import { useContext } from 'react';
import { MaterialsContext } from '../../constants/context';

//Loads a pointcloud from a cityjson file which directly contains the point data
/**
 * 
 * @param {*} verts 
 * @param {*} obj_transform 
 * @param {*} geometry 
 * @returns 
 */
function loadCityJsonPointCloud(verts,obj_transform,geometry){
    let semantics = geometry.semantics;
    var vert_inds = geometry.boundaries;

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
    return <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={vertices.length / 3} array={vertices} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colours.length / 3} array={colours} itemSize={3} /> 
    </bufferGeometry>
}

//The visual representation of a pointcloud
function PointCloudObj(props){

    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef();

    const { pointMatSelected, pointMatUnSelected } = useContext(MaterialsContext);
    let mat = props.selected ? pointMatSelected : pointMatUnSelected;

    let geometry = props.cityFile.CityObjects[props.objName].geometry[props.geoIndex];

    var verts = props.cityFile.vertices;
    let obj_transform = props.cityFile.transform;

    const pointGeometry = useMemo(()=>{
        return loadCityJsonPointCloud(verts,obj_transform,geometry);
    },[verts,obj_transform,geometry])

    const points = useMemo(()=>{
        return <points {...props} ref={ref} onClick={props.makeSelected} material={mat}>
            {pointGeometry}
        </points>
    },[pointGeometry,props.selected])

    return points;
}

export default PointCloudObj;