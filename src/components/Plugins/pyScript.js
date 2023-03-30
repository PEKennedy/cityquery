import { useEffect, useState } from "react"
import FileControl from "../atoms/FileControl"
import python_packages from "../../constants/python_packages";
import { Pressable, VStack } from "native-base";
import '../../styles.css';
import { strings } from "../../constants/strings";

import { asyncRun } from "./pyWorker";

import CitySpinner from "../atoms/Spinner";

const style = {
    listStyle: {
        listStylePosition: 'inside',
        listStyleType: 'none',
        padding: 0,
        margin: 0,
        fontSize: 12,
    },
    buttonStyle: {
        marginTop: 10,
    },
    paramList: {
        width: '75%',
        minWidth: 175,
    },
    runButton: {
        width: 'fit-content',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 8,
        fontSize: 12,
        padding: 1,
        hover: {
            bg: '#dfd2d2',
        },
    },
};

let loaded_packages = []

//only try to load packages if they aren't loaded yet. not working, look at js promises
//to see if its something to do with resolve
function arePackagesLoadded(pkgs){
    return new Promise((resolve,reject)=>{
        let not_found = []
        pkgs.forEach((pkg,index)=>{
            let found = loaded_packages.find((pk,index)=>{
                return pk===pkg;
            })
            if(found) return;
            else not_found.push(pkg);
        })
        console.log(loaded_packages)
        console.log(not_found)
        window.pyodide.loadPackage(not_found).then(()=>{
            loaded_packages.push(...not_found)
            resolve()
        })
    })
}

/**
 * Checks for if the python library pyodide is loaded
 * Then asynchronously calls pyodide to run the supplied python code string
 * @param {Python String} code Stringified Python code 
 * @returns {Promise} Promise which resolves to the return value of the python script ran
 */
function runPy(code){
    return new Promise((resolve,reject)=>{
      window.languagePluginLoader.then(() => {
        window.pyodide.loadPackage(python_packages).then(() => {
          resolve(window.pyodide.runPython(code))
        })
        
        /*arePackagesLoadded(["numpy"]).then(()=>{
            resolve(window.pyodide.runPython(code))
        })*/
      })
    })
}

async function runPyAsync(code){
    try{
        const {results, err} = await asyncRun(code,)
    } catch(e){

    }
}


/**
 * Creates a FileControl for python plugins, and for each uploaded plugin creates a <ModificationPlugin> element
 * @param {*} props Methods getSelected and onResult for <ModificationPlugin> to call
 * getSelected should return an object containing the selected city objects as seen in VisualizationRoot
 * onResult will be called when a plugin is finished with each file. It will be passed fileName,pluginOutput
 * @returns {JSX} A <div> containing a FileControl and list of <ModificationPlugin>
 */
function ModificationPluginList(props){
    //props should have pass an object list?

    const [files, setFiles] = useState([]);

    const addFile = (file) =>{
        setFiles([...files, file])
    }
    const clearFiles = () =>{
        setFiles([])
    }

    let objList = files.map((file,index) =>
        <ModificationPlugin script={file} key={index}  getSelected={props.getSelected} onResult={props.onResult} />
    );

    return(
        <div>
            <FileControl upId={"pyUpload"} clearId={"pyClear"} fileType={".py"}
                clearText={"Clear Plugins"} addFile={addFile} clearFiles={clearFiles} isPluginMenu />
            <ul style={style.listStyle}>
                {objList}
            </ul>
        </div>
    );
}

/**
 * Creates a FileControl for python plugins, and for each uploaded plugin creates a <SearchPlugin> element
 * @param {*} props Methods getSelected and onResult for <SearchPlugin> to call
 * getSelected should return an object containing the selected city objects as seen in VisualizationRoot
 * onResult will be called when a plugin is finished with each file. It will be passed fileName,pluginOutput
 * @returns {JSX} A <div> containing a FileControl and list of <SearchPlugin>
 */
function SearchPluginList(props){
    //props should have pass an object list?

    const [files, setFiles] = useState([]);

    const addFile = (file) =>{
        setFiles([...files, file])
    }
    const clearFiles = () =>{
        setFiles([])
    }

    let objList = files.map((file,index) =>
        <SearchPlugin script={file} key={index} getSelected={props.getSelected} onResult={props.onResult} />
    );

    return(
        <div>
            <FileControl upId={"searchUpload"} clearId={"searchClear"} fileType={".py"}
                clearText={"Clear Plugins"} addFile={addFile} clearFiles={clearFiles} isPluginMenu />
            <ul style={style.listStyle}>
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

    const [running, setRunning] = useState(false);

    const runPlugin = (parameters) =>{
        let selected = props.getSelected()
        let fileNames = Object.keys(selected)
        //console.log(parameters)
        //console.log(selected)
        if(fileNames.length == 0) return;
        setRunning(true)

        fileNames.forEach((fileName)=>{
            let selection = selected[fileName];
            asyncRun(props.script+
                "\nmodifyCityJSON("+
                JSON.stringify(selection.file)+
                "," +
                JSON.stringify(selection.objects) +
                ","+
                JSON.stringify(parameters)+
                ")"
            ,{}).then((output)=>{
                props.onResult(fileName,JSON.parse(output.results)) //file_name
                setRunning(false)
            });
        })
    }
  
    return( 
        <div>
            {running? <CitySpinner label={"Running Modification"} aLabel={"Running Modification"}/> : <></>}
            <PluginParameters script={props.script} onRun={runPlugin} runText={"Run Modification"}/>
            <br/>
        </div>
    );
  
}

function SearchPlugin(props){
    const [running, setRunning] = useState(false);


    const runPlugin = (parameters) =>{
        let files = props.getSelected()
        let fileNames = Object.keys(files)
        //console.log(parameters)
        //console.log(files)

        if(fileNames.length == 0) return;
        setRunning(true)

        fileNames.forEach((fileName)=>{
            let file = files[fileName];
            //runPy(props.script+
            asyncRun(props.script+
                "\nsearchCityJSON("+
                JSON.stringify(file)+
                "," +
                JSON.stringify(parameters)+
                ")"
            ,{}).then((output)=>{
                props.onResult(fileName,JSON.parse(output.results)) //file_name
                setRunning(false)
            });
            //setParams(JSON.parse(params.results))
        })
    }
  
    return( 
        <div>
            {running? <CitySpinner label={"Running Search"} aLabel={"Running Search"}/> : <></>}
            <PluginParameters script={props.script} onRun={runPlugin} runText={"Run Search"}/>
            <br/>
        </div>
    );
}

//TODO: The ids for the "run" button might need to be made unique

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
        /*runPy(script+"\ngetParams()").then((params) =>{
            console.log(params);
            setParams(JSON.parse(params))
        })*/
        asyncRun(script+"\ngetParams()",{}).then((params) =>{
            //console.log(params)
            //console.log(JSON.parse(params.results));
            setParams(JSON.parse(params.results))
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

    //TODO: we could end up with different plugins using the same parameter names, these ids should be
    //made unique
    keys.forEach((paramName,index)=>{
        let type = params[paramName]

        if(type == "float"){
            tabList.push(<VStack style={style.paramList} key={paramName}>
                <label htmlFor={paramName}>{paramName} </label>
                <input className="pluginInput" type={"number"} name={paramName} id={paramName} onChange={handleChange}/>
                <br/>
            </VStack>)  
        }
        else if(type == "int"){
            tabList.push(<VStack style={style.paramList} key={paramName}>
                <label htmlFor={paramName}>{paramName} </label>
                <input className="pluginInput" type={"number"} name={paramName} id={paramName} onChange={handleChange} step={"1"}/>
                <br/>
            </VStack>)
        }
        else if(type == "string"){
            tabList.push(<VStack style={style.paramList} key={paramName}>
                <label htmlFor={paramName}>{paramName} </label>
                <input className="pluginInput" type={"text"} name={paramName} id={paramName} onChange={handleChange}/>
                <br/>
            </VStack>)
        }
    })
    tabList.push(<></>);


    return(
        <form paddingLeft={0} width="100%">
            <ul style={style.listStyle}>
                {tabList}
            </ul>
            <Pressable
                width={style.runButton.width}
                borderRadius={style.runButton.borderRadius}
                borderWidth={style.runButton.borderWidth}
                borderColor={style.runButton.borderColor}
                fontSize={style.runButton.fontSize}
                padding={style.runButton.padding}
                backgroundColor={style.runButton.backgroundColor}
                marginTop={2}
                _hover={style.runButton.hover}
            >
                <label>
                    {strings.runPlugin}
                    <input className="input" style={style.buttonStyle} onClick={onRun} key={"submit"} type="button" id="runPy" name="runPy" value={props.runText || "Run"}/>
                </label>
            </Pressable>
        </form>
    );
}


  export { ModificationPluginList, SearchPluginList }