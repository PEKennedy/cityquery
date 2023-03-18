export const strings = {
	cityQuery: "CityQuery",
	startApplication: 'Start Application',
  userManual: "User Manual",
  visualization: "Visualization Page",
  modificationPlugins: "Modification Plugins:",
  searchPlugins: "Search Plugins:",
  uploadList: "CityJSON Upload List:",
  fileMenu: "File Menu",
  pluginMenu: "Plugin Menu",
  searchMenu: "Search Menu",
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