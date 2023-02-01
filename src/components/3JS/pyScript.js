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


function PluginList(props){
    //props should have pass an object list?

    const [files, setFiles] = useState([]);

    const addFile = (file) =>{
        setFiles([...files, file])
    }
    const clearFiles = () =>{
        setFiles([])
    }

    if(files.length == 0){}

    const objList = files.map((file,index) =>
        <ModificationPlugin script={file} key={index} />
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

    /*
      TODO:
      - on "Run Python", collect params into an array, get the cityjsonFile and specified object
    */

function ModificationPlugin(props){
    //const [script, setScript] = useState("print('loading')");
    //const [params, setParamValues] = useState(undefined);

    //cityJsonFile,objectsSelected,
    const runPlugin = (parameters) =>{
        console.log(parameters)


        /*runPy(props.script+
            "\nmodifyCityJSON("+
            JSON.stringify({"bla":"blabla","test":"fail"})+
            ","+
            "MultiSurface"+ //TODO: this should be updated based on a selected obj
            ","+
            JSON.stringify(parameters)+
            ")"
        ).then((output)=>{
            
        });*/
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
            <input onClick={onRun} key={"submit"} type="button" id="runPy" name="runPy" value="Run Modification"/>
        </form>
    );
}
    





  export {PluginList, ModificationPlugin, SearchPlugin} //, SearchPlugin, PluginList