import { colours } from '../../constants/colours';

//applies scale to a vertex formatted as [x,y,z]
function scale(vert, transform){
    let scale = transform.scale;
    return [vert[0]*scale[0],vert[2]*scale[2],vert[1]*scale[1]];
}

//complete transform given a cityjson "transform" property.
//also switches z and y axis since cityjson z is up, but in threejs, y is up.
function transform(vert,transform){
    let scale = transform.scale;
    let translate = transform.translate;
    return [vert[0]*scale[0]+translate[0],vert[2]*scale[2]+translate[2],vert[1]*scale[1]+translate[1]];
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

function getColour(semantics,surface_index){
    if(semantics == undefined){
        let surface_colour = colours.default;
        return surface_colour;
    }
    let surface_type_ind = semantics.values[surface_index];
    let surface_type = semantics.surfaces[surface_type_ind].type;
    //console.log(surface_type)
    let surface_colour = [];

    surface_colour = colours.semantics.primary[surface_type];
    if(surface_colour == undefined) surface_colour = colours.default;
    return surface_colour;
}

function colourVerts(semantics,surface_index,numVerts){
    let surface_colour = getColour(semantics,surface_index);
    let vertex_colours = [];
    for(let i=0;i<numVerts;i++){
        vertex_colours.push(surface_colour[0], surface_colour[1], surface_colour[2])
    }
    return vertex_colours
}

function getSelectedTint(selected){
    let tint = 0xFFFFFF //default to white
    if(selected){
        tint = colours.selected //if selected, change the tint
    }
    return tint
}

export {transform, reverseWindingOrder, colourVerts, getSelectedTint}
