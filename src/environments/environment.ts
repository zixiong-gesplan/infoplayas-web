// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    infoplayas_catalogo_edicion_url: 'https://utility.arcgis.com/usrsvcs/servers/070539cded6d4f5e8aa2ce1566618acd/rest/services/ag17_023_fase_2/playas_catalogo_edicion/FeatureServer/0',
    //infoplayas_catalogo_afluencias_url: 'https://servicios.gesplangis.es/arcgis/rest/services/ag17_023/catalogo_prueba_popup/MapServer/1',
    infoplayas_catalogo_edicion_tablas_url: 'https://utility.arcgis.com/usrsvcs/servers/070539cded6d4f5e8aa2ce1566618acd/rest/services/ag17_023_fase_2/playas_catalogo_edicion/FeatureServer',
    infoplayas_incidentes: 'https://utility.arcgis.com/usrsvcs/servers/4a5a34fad6214cf39c3e96931e65c2c8/rest/services/ag17_023/incidentes_edicion/FeatureServer/0',
    urlPlanos: 'http://127.0.0.1:5500',
    app_movil_url: "http://localhost:5000",
    //app_movil_url: "https://informes.infoplayascanarias.es",
    redirectUri: 'http://localhost:4200/login',
    SERVER_URL:'https://gestion.infoplayascanarias.es/',
    // SERVER_URL: 'http://zlinyan-virtualbox:8000/',
    // SERVER_URL: 'https://www3-pre.gobiernodecanarias.org/aplicaciones/infoplayas/gestion',
    recaptchaKey:{
        siteKey:"6LeKAmUjAAAAAJhAZkzBBEvF7vAp8_Z1RyiJGNEG"
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
