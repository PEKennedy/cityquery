import React, { useRef, useMemo } from 'react'
import { transform, colourVerts } from './3dUtils'

import { useContext } from 'react';
import { MaterialsContext } from '../../constants/context';

//test funnction for getting and displaying a cityjson mesh (not working)
function MultiLineObj(props){

    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    const groupRef = useRef()

    const { lineMatSelected, lineMatUnSelected } = useContext(MaterialsContext);
    let mat = props.selected ? lineMatSelected : lineMatUnSelected;

    let geometry = props.cityFile.CityObjects[props.objName].geometry[props.geoIndex];

    var line_segments = geometry.boundaries;
    let semantics = geometry.semantics;
    let obj_transform = props.cityFile.transform;
    let all_verts = props.cityFile.vertices;

    const lineGeometries = useMemo(()=>{
        return line_segments.map((segment, index) =>{
            var verts_filtered = [];
            
            segment.forEach((index)=>{
                verts_filtered.push(all_verts[index]);
            })
            const verts = new Float32Array(
                verts_filtered.map((v)=>transform(v,obj_transform)).flat(2)
            );
    
            let colours = []
            colours.push(...colourVerts(semantics,index,segment.length));
            colours = new Float32Array(colours)
    
            return <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={verts.length / 3} array={verts} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={colours.length / 3} array={colours} itemSize={3} /> 
            </bufferGeometry> 
        });
    },[geometry,obj_transform,all_verts])

    const linesGroup = useMemo(()=>{
        let lines = lineGeometries.map((geo,index)=>{
            return <line {...props} ref={ref} key={index} onClick={props.makeSelected} material={mat}>
                {geo}
            </line>
        })
        return <group ref={groupRef}>
            {lines}
        </group>
    },[lineGeometries,props.selected])

    return linesGroup;
}

export default MultiLineObj;