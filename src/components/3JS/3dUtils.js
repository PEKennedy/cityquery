import { colours } from '../../constants/colours';

import { BufferAttribute, BufferGeometry, Uint32BufferAttribute, Vector3 } from 'three';
import { Earcut } from 'three/src/extras/Earcut';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

//applies scale to a vertex formatted as [x,y,z]
function scale(vert, transform){
    let scale = transform.scale;
    return [vert[0]*scale[0],vert[2]*scale[2],vert[1]*scale[1]];
}

//complete transform given a cityjson "transform" property.
//also switches z and y axis since cityjson z is up, but in threejs, y is up.
function transform(vert,transform){
    if(transform != undefined){
        let scale = transform.scale;
        let translate = transform.translate;
        return [vert[0]*scale[0]+translate[0],vert[2]*scale[2]+translate[2],vert[1]*scale[1]+translate[1]];
    }
    //if there is no transform, just fix the orientation (from z is up to y is up)
    return [vert[0],vert[2],vert[1]];
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

/*
    Since a surface can have an arbitrary number of vertices, forming (non)concave polygons,
        we must prepare the vert formatting for the Earcut triangulation algorithm,
        which will give us a list of triangle indices to use in geometry.
    
    Earcut will try to triangulate all vertices passed to it, so we must filter the vertices
        down from all vertices in the file to what we want.
    Earcut also assumes all vertices used to create holes in the polygon are at the end of the 
        vertex list, and grouped together by hole; Such that holes can be specified by an index
        indicating the 'first vertex of the hole'.

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
function generateSurface(surface, semantics, index, obj_transform, all_verts, invert=false){
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
    //But this sends the building off into the distance due to the large translation
    
    let flat_verts = boundary_verts.map(vert=>transform(vert,obj_transform))

    let normal = newell_normal(flat_verts);

    flat_verts = flat_verts.flat(3);


    //The tricky part, to use the Earcut algorithm (for now, this could probably be improved),
    //we must rotate the surface such that not everything lies along the z-axis (which breaks Earcut)
    let rot_axis = new Vector3(0,0,1).cross(normal);
    let tris = [];
    let rotated_flat = [];
    let axisAngle = Math.PI/2;
    let reverseNormal_cond = normal.z > 0;
    //flip the normals if this is an inverted mesh
    if(invert){
        axisAngle = -Math.PI/2;
        reverseNormal_cond = normal.z < 0;
    }

    //if the normal implies the vertices lie (almost) entirely along the z axis, rotate them
    //so the triangulation algorithm works correctly
    if(normal.z < 0.1 && normal.z > -0.1){ 
        for(let i=0;i<flat_verts.length;i+=3){
            let v = new Vector3(flat_verts[i],flat_verts[i+1],flat_verts[i+2])
            v.applyAxisAngle(rot_axis.normalize(),axisAngle);
            rotated_flat.push(v.x,v.y,v.z);
        }
        tris = triangulate(rotated_flat,holes,false)//Earcut.triangulate(rotated_flat,holes,3);
    }
    else{
        tris = triangulate(flat_verts,holes,reverseNormal_cond)//Earcut.triangulate(flat_verts,holes,3);
        //if the triangles are facing away from the camera, flip the triangles to face outwards correctly
        if(reverseNormal_cond){
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
}

/*
Triangulate the faces, if there are only 4 vertices or 3 vertices, then we can simply return
the appropriate arrays directly. Otherwise, use the earcut algorithm.
*/
function triangulate(verts,holes,reverse=false){
    if(verts.length == 12){
        if(reverse) return [2,3,0,0,1,2]
        return [1,0,3,3,2,1]
    }
    if(verts.length == 9){
        if(reverse) return [1,2,0]
        return [1,0,2]
    }
    return Earcut.triangulate(verts,holes,3);
}

//generates a list of bufferGeometries for surfaces (note "combined" is not an accurate description anymore)
function generateCombinedSurfaces(surfaces,semantics,obj_transform,all_verts,invert=false){
    let surface_meshes = surfaces.map((surface, index) =>{
        return generateSurface(surface,semantics,index,obj_transform,all_verts,invert);
    });
    return surface_meshes;
}

//takes a list of geometries from generateCombinedSurfaces and merges them
function mergeSurface(surfaces){
    let combined_geo = BufferGeometryUtils.mergeBufferGeometries(surfaces)
    combined_geo.computeVertexNormals()
    combined_geo = BufferGeometryUtils.mergeVertices(combined_geo)
    return combined_geo;
}

//Checks a cityjson semantics object against the colours constants file to get a geometry its correct
//surface type colour
function getColour(semantics,surface_index){
    if(semantics == undefined){
        let surface_colour = colours.default;
        return surface_colour;
    }
    //flat because sometimes it is a 2 or 3 deep array (which seems pointless, but thats the standard)
    let surface_type_ind = semantics.values.flat(3)[surface_index]; 
    let surface_type = semantics.surfaces[surface_type_ind].type;
    //console.log(surface_type)
    let surface_colour = [];

    surface_colour = colours.semantics.primary[surface_type];
    if(surface_colour == undefined) surface_colour = colours.default;
    return surface_colour;
}

//Given a cityjson semantics object, and the index for the surface/geometry, builds 
//an array of colour values for the three.js buffer geometry vertex colours.
function colourVerts(semantics,surface_index,numVerts){
    let surface_colour = getColour(semantics,surface_index);
    let vertex_colours = [];
    for(let i=0;i<numVerts;i++){
        vertex_colours.push(surface_colour[0], surface_colour[1], surface_colour[2])
    }
    return vertex_colours
}

//Sometimes we need to convert a colour specified as a decimal value and convert it to hex
function colourFloatToHex(colour){
    return Math.round(colour[0]*0xFF0000 + colour[1]*0x00FF00 + colour[2]*0x0000FF);
}

/*
A normal in computer graphics is a vector that indicates what way a triangle faces,
 which determines whether a face is visible, and how light bounces off of it.
This function is the Newell method for finding a normal for a polygon.
 This is what Ninja uses, and seems to be what some CityJSON example files expect, as it somehow?
  avoids the normals being flipped.
See https://www.khronos.org/opengl/wiki/Calculating_a_Surface_Normal for the algorithm pseudocode
*/
function newell_normal(vertices){
    let n = new Vector3(0,0,0);
    for(let i=0;i<vertices.length;i++){
        let next_index = i+1
        if(next_index == vertices.length) next_index = 0;
        let current = vertices[i]
        let next = vertices[next_index]
        n.x += (current[1]-next[1])*(current[2]+next[2])
        n.y += (current[2]-next[2])*(current[0]+next[0])
        n.z += (current[0]-next[0])*(current[1]+next[1])
    }
    return n.normalize();
}

export {transform, reverseWindingOrder, colourVerts, generateCombinedSurfaces, mergeSurface, colourFloatToHex}
