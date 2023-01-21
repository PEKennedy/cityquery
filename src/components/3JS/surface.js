import React, { useRef, useState } from 'react'

import { Canvas, useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry, LineBasicMaterial, Uint32BufferAttribute } from 'three';
import { Earcut } from 'three/src/extras/Earcut';

function scale(vert, scale){
    return [vert[0]*scale[0],vert[1]*scale[1],vert[2]*scale[2]];
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
        */
        console.log(surface);
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
            console.log(new_surface_inds)
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

        //scale the vertex positions, and flatten the arrays
        let flat_verts = boundary_verts.map(vert=>scale(vert,obj_scale)).flat(3);

        let tris = Earcut.triangulate(flat_verts,holes,3);

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