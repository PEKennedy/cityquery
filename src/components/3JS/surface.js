import React, { useEffect, useRef, useState } from 'react'

import { Canvas, useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry, LineBasicMaterial, Mesh, MeshStandardMaterial, Uint32BufferAttribute, Vector3 } from 'three';
import { Earcut } from 'three/src/extras/Earcut';
import { Geometry } from 'three-stdlib';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import {scale, transform, reverseWindingOrder, colourVerts} from './3dUtils'
//import {VertexColors} from 'three/src/materials/'


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
            if(combined_geo){
                combined_geo.dispose()
            }
        }
    })

    if(props.cityFile == undefined){ //not loaded yet
        return (<mesh ref={ref} visible={false}></mesh>);
    }
    
    //console.log(props.cityFile);
    //console.log(props.object);

    var object = props.cityFile.CityObjects[props.object];
    console.log(object);

    let semantics = object.geometry[0].semantics;
    var surfaces = object.geometry[0].boundaries;

    let obj_transform = props.cityFile.transform
    let all_verts = props.cityFile.vertices;

    const surface_meshes = surfaces.map((surface, index) =>{
        
        /*
            Since a surface can have an arbitrary number of vertices, forming (non)concave polygons,
             we must prepare the vert formatting for the Earcut triangulation algorithm,
             which will give us a list of triangle indices to use in geometry.
            
            Earcut will try to triangulate all vertices passed to it, so we must filter the vertices
             down from all vertices in the file to what we want.
            Earcut also assumes all vertices used to create holes in the polygon are at the end of the 
             vertex list, and grouped together by hole; Such that holes can be specified by a 'start of
             the hole' list of vertex indices.

            Earcut([vertices of the polygon],[hole indices],# dimensions)
            The vertex list must be 'flat' too (no nested lists like cityjson uses)

            a cityjson surface has [[Exterior vertex indices],[hole 1 vertex indices], [hole 2], ...]
            Thus the main step is building a new vertex list which produces an index list where the
             indices from [[exterior],[hole1],...]] are all in ascending order.
            Hole indices can be found by taking the first elements of [hole1],[hole2],...
            And the filtered vertex list can just be flattened.

            A final problem is that Earcut assumes polygons to be flat along the Z-axis for its triangulation.
            This leads to problems with triangles not showing up if the are along that axis.
            This means that just before triangulation, we need to determine the normal of the surface,
            rotate it to be flat along the z-axis, then triangulate to get the triangle indices. 
        */
        //console.log(surface);
        let num_interior_surfaces = surface.length-1;
        
        let boundaries = [];
        let boundary_verts = [];
        let holes = [];

        let end_index = 0;
        
        //A boundary is going to be the list of exterior verts, then each list of interior verts
        surface.forEach(boundary=>{
            //for each boundary, add the verts it references in order to boundary_verts
            //new_surface_inds is a new list of vertex indices
            //end_index is used to track where the index listings should resume on the next boundary
            let new_surface_inds = boundary.map((ind,new_ind)=>{
                boundary_verts.push(all_verts[ind]);
                return end_index + new_ind;
            });
            end_index = new_surface_inds[new_surface_inds.length-1]+1;
            boundaries.push(new_surface_inds);
            //boundaries is the new [[exterior],[hole1],...] where the indices now correspond to verts found in boundary_verts
        });

        if(num_interior_surfaces > 0){
            //the holes array Earcut wants the start indices of each hole, so iterate through the holes and
            //push the starting index
            boundaries.splice(1).forEach(hole=>{
                holes.push(hole[0]);
            })
        }
        else{
            holes = null;
        }

        //scale the vertex positions, and flatten the arrays
        //TODO: scale(...) should be transform(...). 
        //But this sends the building off into the distance due to the large translation
        let flat_verts = boundary_verts.map(vert=>transform(vert,obj_transform))

        let v1 = new Vector3(flat_verts[0][0],flat_verts[0][1],flat_verts[0][2])
        let v2 = new Vector3(flat_verts[1][0],flat_verts[1][1],flat_verts[1][2])
        let v3 = new Vector3(flat_verts[2][0],flat_verts[2][1],flat_verts[2][2])

        flat_verts = flat_verts.flat(3);

        //Since by the cityjson spec, a surface is all along the same plane,
        // 2 verts crossed together should produce the normal
        let normal = v2.sub(v1).cross(v3.sub(v1)) // boundary_verts[0]
        let rot_axis = new Vector3(0,0,1).cross(normal);



        let tris = [];

        let rotated_flat = [];
        //if the normal implies the vertices lie (almost) entirely along the z axis, rotate them
        //so the triangulation algorithm works correctly
        if(normal.z < 0.1 && normal.z > -0.1){ 
            for(let i=0;i<flat_verts.length;i+=3){
                let v = new Vector3(flat_verts[i],flat_verts[i+1],flat_verts[i+2])
                v.applyAxisAngle(rot_axis.normalize(),Math.PI/2);
                rotated_flat.push(v.x,v.y,v.z);
            }
            tris = Earcut.triangulate(rotated_flat,holes,3);
        }
        else{
            tris = Earcut.triangulate(flat_verts,holes,3);
            //if the triangles are facing away from the camera, flip the triangles to face outwards correctly
            if(normal.z > 0){
                tris = reverseWindingOrder(tris);
            }
        }

        //Convert to the object types 3js expects
        tris = new Uint32BufferAttribute(tris,1);
        const verts = new Float32Array(flat_verts);
        let colours = new Float32Array(colourVerts(semantics,index,boundary_verts.length))

        let geo = new BufferGeometry()
        geo.setIndex(tris);
        geo.setAttribute('position',new BufferAttribute(verts,3))
        geo.setAttribute('color',new BufferAttribute(colours,3))

        return geo
    });

    let combined_geo = BufferGeometryUtils.mergeBufferGeometries(surface_meshes)
    combined_geo.computeVertexNormals()
    combined_geo = BufferGeometryUtils.mergeVertices(combined_geo)

    return (
        <mesh {...props} ref={ref}>
            <primitive object={combined_geo} />
            <meshStandardMaterial  vertexColors={true}/>
        </mesh>
    )

}

export default SurfaceObject;