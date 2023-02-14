import { useState } from "react"

/**
 * Presents a file upload button which can always accept more files, and a clear button.
 * Keeps track of a list of uploaded files, and their metadata.
 * Upon a file being uploaded and read, the passed in setFile will be called to add the 
 * read file to the parent's file list (FileList only keeps track of the metadata)
 * 
 * @param {*} props 
 * @returns JSX for a file input and the resulting fileList
 */
function FileControl(props){

    const [fileMetaData, setFileMetaData] = useState([]);

    const clearFiles = (e) =>{
        props.clearFiles();
        setFileMetaData([]);
        clearFileInput();
    }
  
    const clearFileInput = () =>{
      document.getElementById(props.upId).value = '';
    }

    const handleFileChange = (e) =>{
        if (e.target.files) {
            const file = e.target.files[0]
            setFileMetaData([...fileMetaData,file])
            const fr = new FileReader();
        
            //add an event listener for when the filereader has finished
            fr.addEventListener("load",e=>{ 
                props.addFile(fr.result, file.name)
                clearFileInput(); //reset the file upload html component, once we are done
            })
            //After having set the event listener, we can now use this to parse the file
            fr.readAsText(file); 
        }
    
    }

    let filesList = []
    if(fileMetaData && fileMetaData.length > 0){
        fileMetaData.map((file,index) => 
            <li key={file.name}>{file.name}</li>
        );
    } 

    return <div>
        <input type="file" id={props.upId} name={props.upId} accept={props.fileType} onChange={handleFileChange}></input>
        <input type="button" id={props.clearId} name={props.clearId} onClick={clearFiles}
            value={props.clearText}/>
        <ul>
            {filesList}
        </ul>
    </div>
}

export default FileControl;

/* changing the file input to "multiple" led to trouble getting the eventlistener to fire on every file selected
        <input type="file" id={props.upId} name={props.upId} accept={props.fileType}
         onChange={handleFileChange} multiple/>

const handleFileChange = (e) =>{
        const files = e.target.files
        if (files[0]) {
            //console.log(files)
            //let x = Object.values(files)
            //console.log(Object.values(files))
            Object.values(files).forEach((file)=>{
                console.log(file)
                const fr = new FileReader();
        
                //add an event listener for when the filereader has finished
                fr.addEventListener("load",e=>{ 
                    //console.log(fr.result)
                    props.addFile(fr.result)
                    clearFileInput(); //reset the file upload html component, once we are done so more files can be uploaded
                })
                //After having set the event listener, we can now use this to parse the file
                fr.readAsText(file); 
            })
        }
    
    }
*/