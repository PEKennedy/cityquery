import React, { forwardRef, useEffect, useMemo, useRef } from 'react'

import { generateCombinedSurfaces, mergeSurface } from './3dUtils'
import { useContext } from 'react';
import { MaterialsContext } from '../../constants/context';


//test funnction for getting and displaying a cityjson mesh (not working)
const SurfaceObject = (props)=>{

    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()

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

    const { standMatSelected, standMatUnSelected } = useContext(MaterialsContext);
    let mat = props.selected ? standMatSelected : standMatUnSelected;

    //use memoization to ensure the geometry is only rebuilt if it actually changes
    const mesh_geometry = useMemo(()=>{
        return  mergeSurface(generateCombinedSurfaces(surfaces,semantics,obj_transform,all_verts));
    },[geometry,obj_transform,all_verts])

    //
    //only rerender the mesh if the material or geometry changes
    const surfaceMesh = useMemo(()=>{
        return <mesh {...props}  onClick={props.makeSelected} material={mat} ref={ref}>
            <primitive object={mesh_geometry} />
        </mesh>
    },[mesh_geometry, mat])

    return surfaceMesh;
};

export default SurfaceObject;