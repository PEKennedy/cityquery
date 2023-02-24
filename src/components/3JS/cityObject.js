import Box from './Box';
import PointCloudObj from './pointCloud';
import MultiLineObj from './MultiLine';
import SurfaceObject from './surface';

//given a file (need a file as it contains the both object and the vertices) and an object name,
//gives the proper jsx for display
const chooseDisplayType = (cityFile, objectName, geometry, is_selected) => {

    let type = geometry.type;
      
    if(type == "MultiPoint"){
      return <PointCloudObj position={[5, 0, 0]} cityFile={cityFile} object={objectName} selected={is_selected}/>;
    }
    if(type == "MultiLineString"){
      return <MultiLineObj position={[5, 0, 0]} cityFile={cityFile} object={objectName} selected={is_selected}/>;
    }
    if(type == "MultiSurface" || type == "CompositeSurface"){
      return <SurfaceObject position={[5, 0, 0]} cityFile={cityFile} object={objectName} selected={is_selected}/>;
    }
    /*if(object.attributes != undefined && object.attributes["pointcloud-file"] != undefined){
      return <PointCloudObj position={[5, 0, 0]} cityFile={cityFile} object={objectName}/>;
    }*/
  
    //default
    return <Box position={[-2.4, 0, 0]}/>
  
    //Some notes:
    //- cityJSON files with external PointClouds always specify an extension you could check for in the file
    //- For an 'external' pointcloud, we can also check for an object with no geometry, 
    //but with "attributes"."pointcloud-file".pointFile
  }
  

const CityObjectDisplay = (cityFile, objectName,fileName,selected) => {
    let object = cityFile.CityObjects[objectName];
    let geometries = [];

    //check if the object is selected
    let is_selected = false
    if(selected[fileName]){
      let fileObjs = selected[fileName]["objects"]
      is_selected = fileObjs.find((name)=>{return name == objectName}) != undefined;
    }

    //for each geometry, choose a display type
    object.geometry.forEach((geometry,index)=>{
        geometries.push(chooseDisplayType(cityFile, objectName, geometry, is_selected))
    })

    //if there are multiple geometries, create a group
    if(geometries.length > 1){
        return <group>
            {geometries}
        </group>
    }
    else if(geometries.length == 1){ //just return the display type if only one geometry
        return geometries[0];
    }
    else{ //0 geometries, don't return anything
        return <></>
    }
  }

  export default CityObjectDisplay;