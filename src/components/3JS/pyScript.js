import { useEffect } from "react"
import { useState } from "react"

import FileControl from "../atoms/FileControl"


/**
 * Checks for if the python library pyodide is loaded
 * Then asynchronously calls pyodide to run the supplied python code string
 * @param {Python String} code Stringified Python code 
 * @returns {Promise} Promise which resolves to the return value of the python script ran
 */
function runPy(code){
    return new Promise((resolve,reject)=>{
      window.languagePluginLoader.then(() => {
        window.pyodide.loadPackage([]).then(() => {
          resolve(window.pyodide.runPython(code))
        })
      })
    })
}

//TODO: Select between SearchPlugin and ModificationPlugin

/**
 * Creates a FileControl for python plugins, and for each uploaded plugin creates a <ModificationPlugin> element
 * @param {*} props Methods getSelected and onResult for <ModificationPlugin> to call
 * getSelected should return an object containing the selected city objects as seen in VisualizationRoot
 * onResult will be called when a plugin is finished with each file. It will be passed fileName,pluginOutput
 * @returns {JSX} A <div> containing a FileControl and list of <ModificationPlugin>
 */
function PluginList(props){
    //props should have pass an object list?

    const [files, setFiles] = useState([]);

    const addFile = (file) =>{
        setFiles([...files, file])
    }
    const clearFiles = () =>{
        setFiles([])
    }

    const objList = files.map((file,index) =>
        <ModificationPlugin script={file} key={index}  getSelected={props.getSelected} onResult={props.onResult} />
    );

    return(
        <div>
            <FileControl upId={"pyUpload"} clearId={"pyClear"} fileType={".py"}
                clearText={"Clear Plugins"} addFile={addFile} clearFiles={clearFiles}/>
            <ul>
                {objList}
            </ul>
        </div>
    );
}

/**
 * A handler which will run "modifyCityJSON(file,objectsSelected,parameters)" in the uploaded python code
 * @param {*} props getSelected and onResult methods as seen on PluginList
 * @returns {JSX} Returns a <PluginParameters> followed by a <br/> which will run the modification plugin code
 */
function ModificationPlugin(props){

    const runPlugin = (parameters) =>{
        console.log(parameters)

        let selected = props.getSelected()
        console.log(selected)
        let fileNames = Object.keys(selected)

        fileNames.forEach((fileName)=>{
            let selection = selected[fileName];
            runPy(props.script+
                "\nmodifyCityJSON("+
                JSON.stringify(selection.file)+
                "," +
                JSON.stringify(selection.objects) +
                ","+
                JSON.stringify(parameters)+
                ")"
            ).then((output)=>{
                props.onResult(fileName,JSON.parse(output)) //file_name
            });
        })
    }
  
    return( 
        <>
            <PluginParameters script={props.script} onRun={runPlugin}/>
            <br/>
        </>
    );
  
}

function SearchPlugin(props){

}

//TODO: The ids for the "run" button might need to be made unique
//TODO: maybe move the "run" button's text to a prop

/**
 * Represents the parameters for a python plugin. Uses useEffect to run "getParams()" from the uploaded python
 * and generates a list of html parameters based on the JSON received
 * @param {*} props script (the uploaded python script in text)
 * @returns {JSX} html for the plugin parameters and a "Run" button
 */
function PluginParameters(props){
    
    const [params, setParams] = useState(undefined);
    const [initialized, setInitialized] = useState(false)
    const [inputs, setInputs] = useState({})

    const getParams = (script) =>{
        runPy(script+"\ngetParams()").then((params) =>{
            console.log(params);
            setParams(JSON.parse(params))
            //return JSON.parse(params);
        })
    }

    useEffect(()=>{
        if(!initialized){
            getParams(props.script)
            setInitialized(true)
        }
    })

    // return a dummy value until we get the parameters from the python file
    if(params == undefined){
        return <form></form>
    }

    let keys = Object.keys(params)
    let tabList = [];

    
    const onRun = () =>{
        let x = inputs;
        //assign default values for all unassigned parameters
        keys.forEach((name) =>{
            if(x[name] == undefined){
                if(params[name] == "float" || params[name] == "int"){
                    x[name] = 0.0
                }
                else{
                    x[name] = ""
                }
            }
        })
        setInputs(x)
        props.onRun(inputs)
    }
    
    const handleChange = (e) => {
        let x = inputs;


        let val = e.target.value
        if(e.target.step == 1){
            val = parseInt(val)
        }
        else if(e.target.type == "number"){
            //parse number
            val = parseFloat(val)
        }
        x[e.target.name] = val
        setInputs(x)
    }

    
    keys.forEach((paramName,index)=>{
        let type = params[paramName]

        if(type == "float"){
            tabList.push(<div key={paramName}>
                <label htmlFor={paramName}>{paramName} </label>
                <input type={"number"} name={paramName} id={paramName} onChange={handleChange}/>
                <br/>
            </div>)  
        }
        else if(type == "int"){
            tabList.push(<div key={paramName}>
                <label htmlFor={paramName}>{paramName} </label>
                <input type={"number"} name={paramName} id={paramName} onChange={handleChange} step={"1"}/>
                <br/>
            </div>)
        }
        else if(type == "string"){
            tabList.push(<div key={paramName}>
                <label htmlFor={paramName}>{paramName} </label>
                <input type={"text"} name={paramName} id={paramName} onChange={handleChange}/>
                <br/>
            </div>)
        }
    })
    tabList.push(<></>);


    return(
        <form >
            <ul>
                {tabList}
            </ul>
            <input onClick={onRun} key={"submit"} type="button" id="runPy" name="runPy" value="Run"/>
        </form>
    );
}
    





  export {PluginList, ModificationPlugin, SearchPlugin} //, SearchPlugin, PluginList