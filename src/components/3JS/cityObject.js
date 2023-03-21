import PointCloudObj from './pointCloud';
import MultiLineObj from './MultiLine';
import SurfaceObject from './surface';
import SolidObj from './Solid';
import MultiSolidObj from './MultiSolid';

import { useContext } from 'react';
import { SelectionContext } from '../../constants/context';


const CityObjectDisplay = ({cityFile,objectName,fileName}) => {
 
    //console.log(cityFile)
    let object = cityFile.CityObjects[objectName];
    let geometries = [];

    const {selected, select, deSelect } = useContext(SelectionContext);
    const clickSelection = (e,value) =>{
        e.stopPropagation();

        if(e.shiftKey){
            if(is_selected) deSelect(fileName,[objectName]);
            else            select(fileName,[objectName],true);
        }
        else if(e.ctrlKey){
            //deSelect(fileName,[objectName])
        }
        else{
            select(fileName,[objectName],false)
        }
    }

    //check if the object is selected
    let is_selected = false
    if(selected[fileName]){
      let fileObjs = selected[fileName]["objects"]
      is_selected = fileObjs.find((name)=>{return name == objectName}) != undefined;
    }


    //given a file (need a file as it contains the both object and the vertices) and an object name,
    //gives the proper jsx for display
    const chooseDisplayType = (cityFile, objectName, geoIndex, is_selected, fileName, makeSelected) => {

        if(cityFile.CityObjects == undefined){
            console.error("provided cityJSON file did not contain \"CityObjects\"")
            return;
        }
        if(cityFile.CityObjects[objectName] == undefined){
            console.error("specified CityJSON object ("+objectName+") was not contained in the provided file")
            return;
        }
        let geometry = cityFile.CityObjects[objectName].geometry[geoIndex];
        let type = geometry.type;
        
        if(type == "MultiPoint"){
            return <PointCloudObj fileName={fileName} cityFile={cityFile} geoIndex={geoIndex}
                objName={objectName} selected={is_selected} makeSelected={makeSelected}/>
        }
        if(type == "MultiLineString"){
            return <MultiLineObj fileName={fileName} cityFile={cityFile} geoIndex={geoIndex} 
                objName={objectName} selected={is_selected} makeSelected={makeSelected}/>
        }
        if(type == "MultiSurface" || type == "CompositeSurface"){
            return <SurfaceObject fileName={fileName} cityFile={cityFile} geoIndex={geoIndex} 
                objName={objectName} selected={is_selected} makeSelected={makeSelected}/>;
        }
        if(type == "Solid"){
            return <SolidObj fileName={fileName} cityFile={cityFile} geoIndex={geoIndex} 
                objName={objectName} selected={is_selected} makeSelected={makeSelected}/>;
        }
        if(type == "MultiSolid" || type == "CompositeSolid"){
            return <MultiSolidObj fileName={fileName} cityFile={cityFile} geoIndex={geoIndex} 
                objName={objectName} selected={is_selected} makeSelected={makeSelected}/>;
        }

        /*if(object.attributes != undefined && object.attributes["pointcloud-file"] != undefined){
        return <PointCloudObj cityFile={cityFile} object={objectName}/>;
        }*/
    
        //default
        return <></>
    
        //Some notes:
        //- cityJSON files with external PointClouds always specify an extension you could check for in the file
        //- For an 'external' pointcloud, we can also check for an object with no geometry, 
        //but with "attributes"."pointcloud-file".pointFile
    }

    if(object.geometry == undefined) return <></>;
    //for each geometry, choose a display type
    object.geometry.forEach((geometry,index)=>{
        geometries.push(chooseDisplayType(cityFile, objectName, index, is_selected, fileName, clickSelection))
    })

    //if there are multiple geometries, create a group
    if(geometries.length >= 1){ //was >, this is temp
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
  };

  export default CityObjectDisplay;