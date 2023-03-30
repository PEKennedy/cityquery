import { Checkbox, HStack, Pressable, VStack } from "native-base";
import { useContext, useEffect, useState } from "react";
import { CityFilesContext } from "../../constants/context";
import { strings } from "../../constants/strings";
import '../../styles.css';
import ObjectList from "../molecules/ObjectList";

const style = {
  buttonContainer: {
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
  checkboxItem: {
    paddingTop: 10,
    paddingLeft: 10,
    fontSize: 14,
  },
  listStyle: {
    listStylePosition: 'inside',
    padding: 0,
    margin: 0,
    fontSize: 14,
  },
  p: {
    marginTop: 10,
    marginBottom: 10,
  },
  inputsContainer: {

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
    const { upId, clearId, fileType, clearText, addFile, clearFiles, selectFile, deSelectFile, isPluginMenu, isFileMenu, checkboxValues, setCheckboxValues } = props;
    const [fileMetaData, setFileMetaData] = useState([]);
    const [filesList, setFilesList] = useState([]);
    const cityFiles = useContext(CityFilesContext);

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
            if(fileMetaData.length == 0){
                setFilesList([]);
                return;
            }
            setFilesList(fileMetaData.map((file,index) =>
                <li key={file.name}>{file.name}</li>
            ))
        }
    }, [fileMetaData])

    let cityFilesArray = [];
    for (const [key, ] of Object.entries(cityFiles)) {
      let file = cityFiles[key];
      file.key = key;
      cityFilesArray.push(file);
    }

    return <VStack marginTop={1} space={1}>
        <HStack style={style.inputsContainer}>
          <Pressable
            width={style.buttonContainer.width}
            borderRadius={style.buttonContainer.borderRadius}
            borderWidth={style.buttonContainer.borderWidth}
            borderColor={style.buttonContainer.borderColor}
            fontSize={style.buttonContainer.fontSize}
            padding={style.buttonContainer.padding}
            backgroundColor={style.buttonContainer.backgroundColor}
            marginRight={2}
            _hover={style.buttonContainer.hover}
          >
            <label>
                {isPluginMenu ? strings.pluginUpload : strings.fileUpload}
                <input type="file" id={upId} name={upId} accept={fileType} onChange={handleFileChange} />
            </label>
          </Pressable>
          <Pressable
            width={style.buttonContainer.width}
            borderRadius={style.buttonContainer.borderRadius}
            borderWidth={style.buttonContainer.borderWidth}
            borderColor={style.buttonContainer.borderColor}
            fontSize={style.buttonContainer.fontSize}
            padding={style.buttonContainer.padding}
            backgroundColor={style.buttonContainer.backgroundColor}
            _hover={style.buttonContainer.hover}
          >
            <label>
              {strings.clear}
              <input className="input" type="button" id={clearId} name={clearId} onClick={clearFilesFunction} value={clearText} />
            </label>
          </Pressable>
        </HStack>
        <VStack style={style.menuContainer}>
          {isFileMenu ? (
            <Checkbox.Group defaultValue={checkboxValues} value={checkboxValues} colorScheme="red" onChange={values => {
              setCheckboxValues(values || []);
            }}>
              {cityFilesArray.map(item => (
                <VStack width="100%">
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
                    {item.key}
                  </HStack>
                  <ObjectList file={item.CityObjects} fileName={item.key} />
                </VStack>
              ))}
            </Checkbox.Group>
          ) : (
            <div>
                <p style={style.p}>
                    <ul style={style.listStyle}>
                        {filesList}
                    </ul>
                </p>
            </div>
          )}
        </VStack>
      </VStack>
}

export default FileControl;
