import React from 'react';
import { VStack , HStack, Text} from 'native-base';
import NavBar from '../organisms/NavBar';

const style = {
  pageContainer: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#d2303b',
    alignItems: 'center',
    padding: 20,
  },
  innerContainer: {
    width: '70%',
    height: '85%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginTop: 10,
    padding:10,
  },
};

const UserManualPage = () => {
  return (
    <VStack style={style.pageContainer}>
      <NavBar selected="User Manual" />
      <VStack style={style.innerContainer}>
        <Text style={{fontWeight: "bold", fontSize: 20, textAlign: "center"}}>
        Welcome to the CityQuery User Manuel.
        </Text>
        <Text style={{fontSize: 16}}>
At the top of the screen, you will see three options, User Manual, CityQuery, and exit.
These buttons allow you to navigate the pages of CityQuery, going to the user manual (which is your current location), visualization page, and back to the start screen.
        </Text>
        <Text style={{fontWeight: "bold", fontSize: 20, textAlign: "center"}}>
        {"\n"}
        Visualization
        </Text>
        <Text style={{fontSize: 16}}>
To visualize your data, make sure you are on the CityQuery page, and then under File Menu, press Upload Files. This will prompt you to select your CityJSON files that you want displayed. Once selected, these files will be automatically displayed on the visualization screen on the right side of the page.  
If the display is empty, press the Center Camera button in the top left corner to be automatically brought to where your file is located. Please note that if multiple files are loaded, the Center Camera button will bring the camera to the central location of all files.
{"\n"}{"\n"}The visualization screen’s camera can also be controlled via the mouse. Pressing the left mouse button and dragging the mouse rotates the cameras view in the direction the mouse is dragged while pressing the right mouse button and dragging the mouse pans the camera in the direction the mouse is dragged. The camera can also be zoomed in and out via the mouses scroll wheel.
{"\n"} {"\n"}
To clear the visualization screen, press the clear files button and the objects will be removed from the visualization screen and the file list on the left.
Alongside each listed file is a checkbox that will automatically select all objects that are a part of that file, highlighting the objects and selecting them for use in plugins. Individual objects in the file can also be selected by clicking on them with the left mouse button and groups of objects can be selected by holding shift and clicking objects.
        </Text>

        <Text style={{fontWeight: "bold", fontSize: 20, textAlign: "center"}}>
        {"\n"}
        Plugins
        </Text>
        <Text style={{fontSize: 16}}>
There are two types of plugins that can be inserted into CityQuery, Search plugins, and Modification plugins, both of which are written in python. Search plugins read the loaded files and select any objects that fit what you are searching for, while modification plugins are plugins that take objects that have been selected and modifies them by the values specified in the plugin. 
The menus for these plugins are equivalent to the file selection menus and, when loaded, have unique input boxes for the plugin parameters. Once your plugin has its parameters filled in, press the run plugin button to execute the plugin with your chosen parameters. The results of the plugin will be automatically displayed on the visualization screen.
        </Text>
      </VStack>
    </VStack>
    
  );
};

export default UserManualPage;
