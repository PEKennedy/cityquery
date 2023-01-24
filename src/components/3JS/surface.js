import React, { useRef, useState } from 'react'

import { Canvas, useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry, LineBasicMaterial, Uint32BufferAttribute, Vector3 } from 'three';
import { Earcut } from 'three/src/extras/Earcut';

//applies scale **and translation in the future** to a vertex formatted as [x,y,z]
function scale(vert, scale){
    return [vert[0]*scale[0],vert[1]*scale[1],vert[2]*scale[2]];
}

//to be displayed correctly, triangle indices must specify vertices in ccw order
//this reverses the order in case a series of tris needs to be flipped for this reason
function reverseWindingOrder(tris){
    let tris_out = [];
    for(let i=0;i<tris.length;i+=3){
        tris_out.push(tris[i+2],tris[i+1],tris[i]);
    }
    return tris_out;
}

//test funnction for getting and displaying a cityjson mesh (not working)
function SurfaceObject(props){
    //var CityObjects = props.CityObjects;
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    const groupRef = useRef()
    // Subscribe this component to the render-loop, rotate the mesh every frame
    //useFrame((state, delta) => (ref.current.rotation.x += 0.01))

    if(props.cityFile == undefined){ //not loaded yet
        return (<mesh ref={ref} visible={false}></mesh>);
    }
    
    //console.log(props.cityFile);
    //console.log(props.object);

    var object = props.cityFile.CityObjects[props.object];
    console.log(object);

    var surfaces = object.geometry[0].boundaries;

    let obj_scale = props.cityFile.transform.scale;
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
            //console.log(new_surface_inds)
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

        //console.log(boundary_verts);
        //console.log(holes);

        // ** There is an async problem around here, as removing the console logs between here
        // and the triangulate leads to failed faces
        // ** problem may be intermittent, as it doesn't affect anything now?


        
        //console.log(boundary_verts[0]);
        //console.log(boundary_verts[0][0],boundary_verts[0][1],boundary_verts[0][2])
        let v1 = new Vector3(boundary_verts[0][0],boundary_verts[0][1],boundary_verts[0][2])
        let v2 = new Vector3(boundary_verts[1][0],boundary_verts[1][1],boundary_verts[1][2])
        let v3 = new Vector3(boundary_verts[2][0],boundary_verts[2][1],boundary_verts[2][2])
        //Since by the cityjson spec, a surface is all along the same plane,
        // 2 verts crossed together should produce the normal
        let normal = v2.sub(v1).cross(v3.sub(v1)) // boundary_verts[0]
        let rot_axis = new Vector3(0,0,1).cross(normal);
        //console.log(v1,v2);
        //console.log(normal.normalize(),rot_axis.normalize());//normal


        //scale the vertex positions, and flatten the arrays
        let flat_verts = boundary_verts.map(vert=>scale(vert,obj_scale)).flat(3);

        let tris = [];

        let rotated_flat = [];
        //if the normal implies the vertices lie (almost) entirely along the z axis, rotate them
        //so the triangulation algorithm works correctly
        if(normal.z < 0.1 && normal.z > -0.1){ 
            //console.log(flat_verts.length);
            //console.log(flat_verts[0],flat_verts[1],flat_verts[2])
            for(let i=0;i<flat_verts.length;i+=3){
                let v = new Vector3(flat_verts[i],flat_verts[i+1],flat_verts[i+2])
                v.applyAxisAngle(rot_axis.normalize(),-Math.PI/2);
                rotated_flat.push(v.x,v.y,v.z);
            }
            tris = Earcut.triangulate(rotated_flat,holes,3);
        }
        else{
            tris = Earcut.triangulate(flat_verts,holes,3);
            //if the triangles are facing away from the camera, flip the triangles to face outwards correctly
            if(normal.z < 0){
                //console.log("reverse windings")
                tris = reverseWindingOrder(tris);
            }
        }




        //Convert to the object types 3js expects
        tris = new Uint32BufferAttribute(tris,1);
        const verts = new Float32Array(flat_verts);

        //console.log(tris);
        //console.log(verts);
        //<bufferAttribute attach="attributes-normal" count={normals.length/3} array={normals} itemSize={3} />

        return <mesh {...props} ref={ref} key={verts.toString()}>
            <bufferGeometry index={tris} count={tris.length} onUpdate={self=>self.computeVertexNormals()}>
                <bufferAttribute attach="attributes-position" count={verts.length / 3} array={verts} itemSize={3} />
                
            </bufferGeometry>
            <meshStandardMaterial color={'orange'} />
        </mesh>
    });

    return (
        <group ref={groupRef}>
            {surface_meshes}
        </group>
      )
}

export default SurfaceObject;