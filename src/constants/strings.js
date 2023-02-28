export const strings = {
	cityQuery: "City Query",
	startApplication: 'Start Application',
  home: "Home",
  visualization: "Visualization Page",
  modificationPlugins: "Modification Plugins:",
  searchPlugins: "Search Plugins:",
  uploadList: "CityJSON Upload List:",
  fileMenu: "File Menu",
  pluginMenu: "Plugin Menu",
  searchMenu: "Search Menu",
  routes: {
    landingPage: '/',
    homePage: '/home',
    visualizationPage: '/visualization'
  },
};

export const toolBarData = [
  {
    label: 'Home',
    link: strings.routes.homePage,
  },
  {
    label: 'Visualization',
    link: strings.routes.visualizationPage,
  },
  {
    label: 'Exit',
    link: strings.routes.landingPage,
  },
];