var view, viewer, highlight, editFeature, listNode, features;

//mensaje playa no seleccionada
var unselectedMessage = "seleccione playa";

//Layer IDs
var playasLayerId = "playas_catalogo_edicion_5477";
var playasLayerViewerId = "playas_catalogo_9609";
var municipiosLayerId = "enp_y_municipios_islas_canarias_4946";

//Layer filters
var filterPlayas, filterMunicipios;

//Forms definitions
var forms = {
    "playas_catalogo_edicion_5477": [
        {
            name: "nombre_municipio",
            label: "Nombre Catálogo General de Canarias",
            description: "Nombre de la Playa o de la Zona de Baño Marítima, a definir por el Ayuntamiento."
        },
        {
            name: "id_dgse",
            label: "ID Catálago General de Canarias",
            editable: false,
            hint: "Identificador de la Dirección General de Emergencias - Identificador prioritario"
        },
        {
            name: "nombre_pilotaje_litoral",
            label: "Nombre Pilotaje Litoral Canario",
            editable: false
        },
        {
            name: "codigo_pilotaje_litoral",
            label: "ID Pilotaje Litoral Canario",
            editable: false
        },
        {
            name: "nombre_mapama",
            label: "Nombre Guía de Playas Nacional",
            editable: false
        },
        {
            name: "codigo_mapama",
            label: "ID Guía de Playas Nacional",
            editable: false
        },
        {
            name: "longitud_m",
            label: "Longitud (metros)",
            editable: true
        }
    ]
};
