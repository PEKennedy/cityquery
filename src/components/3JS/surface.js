import React, { useEffect, useMemo, useRef } from 'react'

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import { generateSurface} from './3dUtils'
import { useContext } from 'react';
import { MaterialsContext } from '../../constants/context';


//test funnction for getting and displaying a cityjson mesh (not working)
function SurfaceObject(props){

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
        let surface_meshes = surfaces.map((surface, index) =>{
            return generateSurface(surface,semantics,index,obj_transform,all_verts,false);
        });
        let combined_geo = BufferGeometryUtils.mergeBufferGeometries(surface_meshes)
        combined_geo.computeVertexNormals()
        combined_geo = BufferGeometryUtils.mergeVertices(combined_geo)
        return combined_geo
    },[geometry,obj_transform,all_verts])

    //only rerender the mesh if the material or geometry changes
    const surfaceMesh = useMemo(()=>{
        return <mesh {...props} ref={ref} onClick={props.makeSelected} material={mat}>
            <primitive object={mesh_geometry} />
        </mesh>
    },[mesh_geometry, mat])

    return surfaceMesh;
}

export default SurfaceObject;