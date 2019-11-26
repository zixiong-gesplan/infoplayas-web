// poner al final de la lista a los usuarios con acceso a los datos de cualquier ayuntamiento
// adjuntar imagen del escudo del ayuntamiento en assets\images\escudos en formato png y con el nombre de la key
var aytos = {
    ayto_adeje: {
        "isSuperUser": false,
        "municipio_minus": "Adeje",
        "municipio_mayus": "ADEJE",
        "istac_code": "38001"
    },
    ayto_agaete: {
        "isSuperUser": false,
        "municipio_minus": "Agaete",
        "municipio_mayus": "AGAETE",
        "istac_code": "35001"
    },
    ayto_aguimes: {
        "isSuperUser": false,
        "municipio_minus": "Agüimes",
        "municipio_mayus": "AGÜIMES",
        "istac_code": "35002"
    },
    ayto_agulo: {
        "isSuperUser": false,
        "municipio_minus": "Agulo",
        "municipio_mayus": "AGULO",
        "istac_code": "38002"
    },
    ayto_alajero: {
        "isSuperUser": false,
        "municipio_minus": "Alajeró",
        "municipio_mayus": "ALAJERÓ",
        "istac_code": "38003"
    },
    ayto_arafo: {
        "isSuperUser": false,
        "municipio_minus": "Arafo",
        "municipio_mayus": "ARAFO",
        "istac_code": "38004"
    },
    ayto_arico: {
        "isSuperUser": false,
        "municipio_minus": "Arico",
        "municipio_mayus": "ARICO",
        "istac_code": "38005"
    },
    ayto_arona: {
        "isSuperUser": false,
        "municipio_minus": "Arona",
        "municipio_mayus": "ARONA",
        "istac_code": "38006"
    },
    ayto_artenara: {
        "isSuperUser": false,
        "municipio_minus": "Artenara",
        "municipio_mayus": "ARTENARA",
        "istac_code": "35005"
    },
    ayto_arucas: {
        "isSuperUser": false,
        "municipio_minus": "Arucas",
        "municipio_mayus": "ARUCAS",
        "istac_code": "35006"
    },
    ayto_barlovento: {
        "isSuperUser": false,
        "municipio_minus": "Barlovento",
        "municipio_mayus": "BARLOVENTO",
        "istac_code": "38007"
    },
    ayto_brenaalta: {
        "isSuperUser": false,
        "municipio_minus": "Breña Alta",
        "municipio_mayus": "Breña Baja",
        "istac_code": "38008"
    },
    ayto_brenabaja: {
        "isSuperUser": false,
        "municipio_minus": "Breña Baja",
        "municipio_mayus": "BREÑA BAJA",
        "istac_code": "38009"
    },
    ayto_buenavista: {
        "isSuperUser": false,
        "municipio_minus": "Buenavista del Norte",
        "municipio_mayus": "BUENAVISTA DEL NORTE",
        "istac_code": "38010"
    },
    ayto_candelaria: {
        "isSuperUser": false,
        "municipio_minus": "Candelaria",
        "municipio_mayus": "CANDELARIA",
        "istac_code": "38011"
    },
    ayto_elsauzal: {
        "isSuperUser": false,
        "municipio_minus": "El Sauzal",
        "municipio_mayus": "EL SAUZAL",
        "istac_code": "38041"
    },
    ayto_elpinar: {
        "isSuperUser": false,
        "municipio_minus": "El Pinar de El Hierro",
        "municipio_mayus": "EL PINAR",
        "istac_code": "38901"
    },
    ayto_fasnia: {
        "isSuperUser": false,
        "municipio_minus": "Fasnia",
        "municipio_mayus": "FASNIA",
        "istac_code": "38012"
    },
    ayto_galdar: {
        "isSuperUser": false,
        "municipio_minus": "Gáldar",
        "municipio_mayus": "GÁLDAR",
        "istac_code": "35009"
    },
    ayto_granadilla: {
        "isSuperUser": false,
        "municipio_minus": "Granadilla de Abona",
        "municipio_mayus": "GRANADILLA DE ABONA",
        "istac_code": "38017"
    },
    ayto_valverde: {
        "isSuperUser": false,
        "municipio_minus": "Valverde",
        "municipio_mayus": "VALVERDE",
        "istac_code": "38048"
    },
    ayto_frontera: {
        "isSuperUser": false,
        "municipio_minus": "Frontera",
        "municipio_mayus": "FRONTERA",
        "istac_code": "38013"
    },
    ayto_fuencaliente: {
        "isSuperUser": false,
        "municipio_minus": "Fuencaliente",
        "municipio_mayus": "FUENCALIENTE",
        "istac_code": "38014"
    },
    ayto_garachico: {
        "isSuperUser": false,
        "municipio_minus": "Garachico",
        "municipio_mayus": "GARACHICO",
        "istac_code": "38015"
    },
    ayto_garafia: {
        "isSuperUser": false,
        "municipio_minus": "Garafía",
        "municipio_mayus": "GARAFÍA",
        "istac_code": "38016"
    },
    ayto_guiadeisora: {
        "isSuperUser": false,
        "municipio_minus": "Guía de Isora",
        "municipio_mayus": "GUÍA DE ISORA",
        "istac_code": "38019"
    },
    ayto_guimar: {
        "isSuperUser": false,
        "municipio_minus": "Güimár",
        "municipio_mayus": "GÜÍMAR",
        "istac_code": "38020"
    },
    ayto_hermigua: {
        "isSuperUser": false,
        "municipio_minus": "Hermigua",
        "municipio_mayus": "HERMIGUA",
        "istac_code": "38021"
    },
    ayto_icod: {
        "isSuperUser": false,
        "municipio_minus": "Icod de los Vinos",
        "municipio_mayus": "ICOD DE LOS VINOS",
        "istac_code": "38022"
    },
    ayto_ingenio: {
        "isSuperUser": false,
        "municipio_minus": "Ingenio",
        "municipio_mayus": "INGENIO",
        "istac_code": "35011"
    },
    ayto_aldeasannicolas: {
        "isSuperUser": false,
        "municipio_minus": "La Aldea de San Nicolás",
        "municipio_mayus": "LA ALDEA DE SAN NICOLÁS",
        "istac_code": "35020"
    },
    ayto_lalaguna: {
        "isSuperUser": false,
        "municipio_minus": "San Cristóbal de La Laguna",
        "municipio_mayus": "LA LAGUNA",
        "istac_code": "38023"
    },
    ayto_laguancha: {
        "isSuperUser": false,
        "municipio_minus": "La Guancha",
        "municipio_mayus": "LA GUANCHA",
        "istac_code": "38018"
    },
    ayto_lamatanza: {
        "isSuperUser": false,
        "municipio_minus": "La Matanza de Acentejo",
        "municipio_mayus": "LA MATANZA DE ACENTEJO",
        "istac_code": "38025"
    },
    ayto_laspalmas: {
        "isSuperUser": false,
        "municipio_minus": "Las Palmas de Gran Canaria",
        "municipio_mayus": "LAS PALMAS DE GRAN CANARIA",
        "istac_code": "35016"
    },
    ayto_laorotava: {
        "isSuperUser": false,
        "municipio_minus": "La Orotava",
        "municipio_mayus": "LA OROTAVA",
        "istac_code": "38026"
    },
    ayto_lavictoria: {
        "isSuperUser": false,
        "municipio_minus": "La Victoria de Acentejo",
        "municipio_mayus": "LA VICTORIA DE ACENTEJO",
        "istac_code": "38051"
    },
    ayto_losllanos: {
        "isSuperUser": false,
        "municipio_minus": "Los Llanos de Aridane",
        "municipio_mayus": "LOS LLANOS DE ARIDANE",
        "istac_code": "38024"
    },
    ayto_lossilos: {
        "isSuperUser": false,
        "municipio_minus": "Los Silos",
        "municipio_mayus": "LOS SILOS",
        "istac_code": "38042"
    },
    ayto_losrealejos: {
        "isSuperUser": false,
        "municipio_minus": "Los Realejos",
        "municipio_mayus": "LOS REALEJOS",
        "istac_code": "38031"
    },
    ayto_mogan: {
        "isSuperUser": false,
        "municipio_minus": "Mogán",
        "municipio_mayus": "MOGÁN",
        "istac_code": "35012"
    },
    ayto_moya: {
        "isSuperUser": false,
        "municipio_minus": "Moya",
        "municipio_mayus": "MOYA",
        "istac_code": "35013"
    },
    ayto_puertodelacruz: {
        "isSuperUser": false,
        "municipio_minus": "Puerto de la Cruz",
        "municipio_mayus": "PUERTO DE LA CRUZ",
        "istac_code": "38028"
    },
    ayto_sanandresysauces: {
        "isSuperUser": false,
        "municipio_minus": "San Andrés y Sauces",
        "municipio_mayus": "SAN ANDRÉS Y SAUCES",
        "istac_code": "38033"
    },
    ayto_sanbartolomedetirajana: {
        "isSuperUser": false,
        "municipio_minus": "San Bartolomé de Tirajana",
        "municipio_mayus": "SAN BARTOLOMÉ DE TIRAJANA",
        "istac_code": "35019"
    },
    ayto_sanmiguel: {
        "isSuperUser": false,
        "municipio_minus": "San Miguel de Abona",
        "municipio_mayus": "SAN MIGUEL DE ABONA",
        "istac_code": "38035"
    },
    ayto_santacruzlp: {
        "isSuperUser": false,
        "municipio_minus": "Santa Cruz de La Palma",
        "municipio_mayus": "SANTA CRUZ DE LA PALMA",
        "istac_code": "38037"
    },
    ayto_santacruztf: {
        "isSuperUser": false,
        "municipio_minus": "Santa Cruz de Tenerife",
        "municipio_mayus": "SANTA CRUZ DE TENERIFE",
        "istac_code": "38038"
    },
    ayto_santalucia: {
        "isSuperUser": false,
        "municipio_minus": "Santa Lucía de Tirajana",
        "municipio_mayus": "SANTA LUCÍA DE TIRAJANA",
        "istac_code": "35022"
    },
    ayto_sansebastianlg: {
        "isSuperUser": false,
        "municipio_minus": "San Sebastián de la Gomera",
        "municipio_mayus": "SAN SEBASTIÁN DE LA GOMERA",
        "istac_code": "38036"
    },
    ayto_sanjuandelarambla: {
        "isSuperUser": false,
        "municipio_minus": "San Juan de la Rambla",
        "municipio_mayus": "SAN JUAN DE LA RAMBLA",
        "istac_code": "38034"
    },
    ayto_santaursula: {
        "isSuperUser": false,
        "municipio_minus": "Santa Úrsula",
        "municipio_mayus": "SANTA ÚRSULA",
        "istac_code": "38039"
    },
    ayto_santamariadeguia: {
        "isSuperUser": false,
        "municipio_minus": "Santa María de Guía de Gran Canaria",
        "municipio_mayus": "SANTA MARÍA DE GUÍA",
        "istac_code": "35023"
    },
    ayto_santiagodelteide: {
        "isSuperUser": false,
        "municipio_minus": "Santiago del Teide",
        "municipio_mayus": "SANTIAGO DEL TEIDE",
        "istac_code": "38040"
    },
    ayto_tacoronte: {
        "isSuperUser": false,
        "municipio_minus": "Tacoronte",
        "municipio_mayus": "TACORONTE",
        "istac_code": "38043"
    },
    ayto_tazacorte: {
        "isSuperUser": false,
        "municipio_minus": "Tazacorte",
        "municipio_mayus": "TAZACORTE",
        "istac_code": "38045"
    },
    ayto_telde: {
        "isSuperUser": false,
        "municipio_minus": "Telde",
        "municipio_mayus": "TELDE",
        "istac_code": "35026"
    },
    ayto_tijarafe: {
        "isSuperUser": false,
        "municipio_minus": "Tijarafe",
        "municipio_mayus": "TIJARAFE",
        "istac_code": "38047"
    },
    ayto_puntagorda: {
        "isSuperUser": false,
        "municipio_minus": "Puntagorda",
        "municipio_mayus": "Puntagorda",
        "istac_code": "38029"
    },
    ayto_puntallana: {
        "isSuperUser": false,
        "municipio_minus": "Puntallana",
        "municipio_mayus": "PUNTALLANA",
        "istac_code": "38030"
    },
    ayto_vallegranrey: {
        "isSuperUser": false,
        "municipio_minus": "Valle Gran Rey",
        "municipio_mayus": "VALLE GRAN REY",
        "istac_code": "38049"
    },
    ayto_vallehermoso: {
        "isSuperUser": false,
        "municipio_minus": "Vallehermoso",
        "municipio_mayus": "VALLEHERMOSO",
        "istac_code": "38050"
    },
    ayto_villademazo: {
        "isSuperUser": false,
        "municipio_minus": "Villa de Mazo",
        "municipio_mayus": "VILLA DE MAZO",
        "istac_code": "38053"
    },
    // superusuarios
    gesplansa: {
        "isSuperUser": true
    },
    infoplayas: {
        "isSuperUser": true
    }
}

