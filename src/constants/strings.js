export const strings = {
	cityQuery: "CityQuery",
	startApplication: 'Start Application',
  userManual: "User Manual",
  visualization: "Visualization Page",
  modificationPlugins: "Modification Plugins:",
  searchPlugins: "Search Plugins:",
  uploadList: "CityJSON Upload List:",
  fileMenu: "Files",
  pluginUpload: "Upload Plugins",
  fileUpload: "Upload Files",
  clear: "Clear",
  runPlugin: "Run Plugin",
  routes: {
    landingPage: '/',
    userManualPage: '/userManual',
    cityQueryPage: '/cityQuery'
  },
};

export const navBarData = [
  {
    label: 'User Manual',
    link: strings.routes.userManualPage,
  },
  {
    label: 'CityQuery',
    link: strings.routes.cityQueryPage,
  },
  {
    label: 'Exit',
    link: strings.routes.landingPage,
  },
];