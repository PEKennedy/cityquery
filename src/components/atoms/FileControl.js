import { useEffect } from "react";
import { useState } from "react"
import { Checkbox, HStack, VStack } from 'native-base';

const style = {
  checkboxItem: {
    paddingTop: 10,
    paddingLeft: 10,
  },
};

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
    const { upId, clearId, fileType, clearText, addFile, clearFiles, selectFile, deSelectFile, isFileMenu, checkboxValues, setCheckboxValues } = props;
    const [fileMetaData, setFileMetaData] = useState([]);
    const [filesList, setFilesList] = useState([]);

    const clearFilesFunction = (e) => {
        clearFiles();
        setFileMetaData([]);
        setFilesList([]);
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
    console.log(checkboxValues);

    return <div>
        <input type="file" id={upId} name={upId} accept={fileType} onChange={handleFileChange}></input>
        <input type="button" id={clearId} name={clearId} onClick={clearFilesFunction} value={clearText} />
        <VStack style={style.menuContainer}>
          {isFileMenu ? (
            <Checkbox.Group defaultValue={checkboxValues} value={checkboxValues} colorScheme="red" onChange={values => {
              console.log(values);
              setCheckboxValues(values || []);
            }}>
              {filesList.map(item => (
                <HStack style={style.checkboxItem}>
                  <Checkbox value={item.key} marginRight={2} onChange={() => {
                    let found = false;
                    checkboxValues.forEach((value) => {
                      if (value === item.key) {
                        found = true;
                        deSelectFile(item.key);
                      }
                    })
                    if (!found) {
                      selectFile(item.key);
                    }
                  }} />
                  {item}
                </HStack>
              ))}
            </Checkbox.Group>
          ) : (
            <div>
                <p>
                    <ul>
                        {filesList}
                    </ul>
                </p>
            </div>
          )}
        </VStack>
      </div>
}

export default FileControl;
