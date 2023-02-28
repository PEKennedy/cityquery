import { useEffect } from "react";
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
const FileControl = (props) => {
    const { upId, clearId, fileType, clearText, addFile, clearFiles } = props;
    const [fileMetaData, setFileMetaData] = useState([]);
    const [filesList, setFilesList] = useState([]);

    const clearFilesFunction = (e) => {
        clearFiles();
        setFileMetaData([]);
        clearFileInput();
    }

    const clearFileInput = () => {
      document.getElementById(props.upId).value = '';
    }

    const handleFileChange = (e) => {
        if (e.target.files) {
            const file = e.target.files[0]
            setFileMetaData([...fileMetaData,file])
            const fr = new FileReader();

            //add an event listener for when the filereader has finished
            fr.addEventListener("load",e=>{
                addFile(fr.result, file.name)
                clearFileInput(); //reset the file upload html component, once we are done
            })
            //After having set the event listener, we can now use this to parse the file
            fr.readAsText(file);
        }

    }

    useEffect(() => {
        if(fileMetaData && fileMetaData.length > 0){
            setFilesList(fileMetaData.map((file,index) =>
                <li key={file.name}>{file.name}</li>
            ))
        }
    }, [fileMetaData])

    return <div>
        <input type="file" id={upId} name={upId} accept={fileType} onChange={handleFileChange}></input>
        <input type="button" id={clearId} name={clearId} onClick={clearFilesFunction}
            value={clearText}/>
        <div height="500px">
            <ul>
                {filesList}
            </ul>
        </div>
    </div>
}

export default FileControl;
