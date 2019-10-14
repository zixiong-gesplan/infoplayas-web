var view, viewer, highlight, editFeature, listNode, features;

//mensaje playa no seleccionada
var unselectedMessage = "seleccione playa";

//Layer IDs
var playasLayerId = "playas_catalogo_edicion_5477";
var municipiosLayerId = "enp_y_municipios_islas_canarias_4946";

//Layer filters
var filterPlayas, filterMunicipios;

//Forms definitions
var forms = {
    "playas_catalogo_edicion_5477": [
        {
            name: "nombre_municipio",
            label: "Nombre según el municipio",
            description: "Nombre de la Playa o de la Zona de Baño Marítima, a definir por el Ayuntamiento."
        },
        {
            name: "observaciones_infoplayas",
            label: "Observaciones",
            editorType: "text-area",
            maxLength: 255
        },
        {
            name: "id_dgse",
            label: "ID D.Seguridad y Emergencias",
            editable: false,
            hint: "Identificador de la Dirección General de Emergencias - Identificador prioritario"
        },
        {
            name: "codigo_pilotaje_litoral",
            label: "ID Gobierno de Canarias",
            editable: false
        },
        {
            name: "codigo_mapama",
            label: "ID MAPAMA",
            editable: false
        },
        {
            name: "nombre_pilotaje_litoral",
            label: "Nombre según Gobierno de Canarias",
            editable: false
        },
        {
            name: "nombre_mapama",
            label: "Nombre según MAPAMA",
            editable: false
        }
    ]
};
