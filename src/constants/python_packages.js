//https://pyodide.org/en/stable/usage/loading-packages.html
//We load packages with pyodide.loadPackage
//define here a list of packages that are wanted
//TODO: A better way to do this is probably to get a list of wanted packages from the plugin file
//then load all files from there when we make a "searchPlugin" or "modificationPlugin" component
//similar to running the getParams(). unfortunately, its late in development, so that doesn't make
//it for this first release (and this file can be deleted once this TODO is done)

const python_packages = [
    "numpy"
];

export default python_packages;

