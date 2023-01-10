# cityquery

This is the project repository for cityquery, an app which lets you visualize and query geographic building data such as cityJSON files. Contact Peter if you have trouble, and the sooner the better, so we can sort through setup issues, or anything I miss here.

## To setup and run:
1. In a terminal at cityquery, run `yarn install`
2. Once the installation is finished, run `yarn start`
3. The frontend is now available at localhost:3000

## Folder Structure
- App.js is the root component containing the website routes
- Constants contains some text labels (this is useful if this tool is ever localized, please put your final strings in here and reference them)
- Components contains all the pages of the website and sub components

### Components
- 3JS contains visualization types (such as polygonmesh and pointcloud) that will be used by the 3js canvas
- Pages contains the various web pages located at the routes specified by app.js. Pages are composed of some unique content (typically under organisms) and some standard elements such as navigation (typically under atoms or molecules)
- Atoms contains 
- Molecules contains 
- Organisms contains large sub components of a page such as the file upload and canvas of the visualization page.




