import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {loadModules} from 'esri-loader';
import {Auth} from '../../models/auth';
import {AuthGuardService} from '../../services/auth-guard.service';
import {GradesProtectionService} from '../../services/grades-protection.service';
import {EsriRequestService} from '../../services/esri-request.service';
import {environment} from '../../../environments/environment';
import {GradeRecord} from '../../models/grade-record';
import * as moment from 'moment';
import {PopulationService} from '../../services/population.service';
import {Municipality} from '../../models/municipality';
import {AppSettingsService} from '../../services/app-settings.service';
import {AppSetting} from '../../models/app-setting';
import Swal from 'sweetalert2';

declare var $: any;
declare var jquery: any;
import jsPDF from 'jspdf';
import 'jspdf-autotable';


// variables javascript esri maps
declare let viewer: any;
declare const createScaleBar: any;
declare const createBaseMapToggle: any;
declare const createLegend: any;
declare const createExpand: any;
declare const playasLayerViewerId: any;
declare const municipiosLayerId: any;
declare let filterPlayas: any;
declare let filterMunicipios: any;
declare const createHomeButton: any;
declare let listNodeViewer: any;
declare const loadList: any;
declare let featuresViewer: any;

@Component({
    selector: 'app-map-viewer',
    templateUrl: './map-viewer.component.html',
    styleUrls: ['./map-viewer.component.css']
})
export class MapViewerComponent implements OnInit, OnDestroy {
    @ViewChild('GradesTable') gTable: ElementRef;
    @Input() zoom: number;
    @Input() mapHeight: string;
    @Input() SelectedDate: string;
    selectedPeriodos: GradeRecord[];
    private currentUser: Auth;
    private subscripcionFeatures;
    private subscripcionMunicipality;
    private lastGraphicLayerId: string;
    private aytos: AppSetting[];
    private resultBeachs: any;
    selectedBeachId: number;

    constructor(private authService: AuthGuardService, private gradeService: GradesProtectionService,
                private service: EsriRequestService, private popService: PopulationService,
                private appSettingsService: AppSettingsService) {
    }

    ngOnInit() {
        this.appSettingsService.getJSON().subscribe(data => {
            this.aytos = data;
            this.currentUser = this.authService.getCurrentUser();
            this.setMap();
        });
    }

    // preparamos una lista de features provenientes del REST API para que tenga la estructura para añadir a la capa grafica de un mapa.
    convertCentroidDataToGraphic(beach: any) {
        beach.geometry = beach.centroid;
        delete beach.centroid;
        beach.geometry.spatialReference = {
            latestWkid: 32628,
            wkid: 32628
        };
        return beach;
    }

    ngOnDestroy() {
        this.subscripcionFeatures.unsubscribe();
        this.subscripcionMunicipality.unsubscribe();
        this.service.clearfeaturesSource();
    }

    private setMap() {
        const options = {css: true, version: '4.11'};

        // first, we use Dojo's loader to require the map class
        loadModules([
            'esri/WebMap',
            'esri/views/MapView',
            'esri/identity/IdentityManager',
            'esri/widgets/ScaleBar',
            'esri/widgets/BasemapToggle',
            'esri/widgets/Expand',
            'esri/widgets/Legend',
            'esri/widgets/Home',
            'esri/Graphic',
            'esri/layers/GraphicsLayer'
        ], options)
            .then(([
                       WebMap,
                       MapView,
                       IdentityManager,
                       ScaleBar,
                       BasemapToggle,
                       Expand,
                       Legend,
                       Home,
                       Graphic,
                       GraphicsLayer
                   ]) => {

                IdentityManager.registerToken({
                    expires: this.currentUser.expires,
                    server: environment.urlServerRest,
                    ssl: true,
                    token: this.currentUser.token,
                    userId: this.currentUser.selectedusername ? this.currentUser.selectedusername : this.currentUser.username
                });
                // then we load a web map from an id
                const webmap = new WebMap({
                    portalItem: {
                        id: environment.idportalView
                    }
                });
                // and we show that map in a container w/ id #viewDiv
                viewer = new MapView({
                    container: 'viewDivViewer', // Reference to the scene div created in step 5
                    map: webmap, // Reference to the map object created before the scene
                    zoom: this.zoom
                });

                // Se crean los simbolos para los marcadores
                const symbolHigh = {
                    type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
                    url: environment.dataSvgGradeHigh,
                    width: '32px',
                    height: '32px',
                    yoffset: '-18px'
                };
                const symbolMedium = {
                    type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
                    url: environment.dataSvgGradeMedium,
                    width: '32px',
                    height: '32px',
                    yoffset: '-18px'
                };
                const symbolLow = {
                    type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
                    url: environment.dataSvgGradeLow,
                    width: '32px',
                    height: '32px',
                    yoffset: '-18px'
                };
                // cambiamos la capa grafica en funcion de los cambios de las entidades desde los formularios de clasificacion
                this.subscripcionFeatures = this.service.features$.subscribe(
                    (results: any) => {
                        let beachs = (results as any[]);
                        if (results.length > 0) {
                            webmap.remove((webmap.findLayerById(this.lastGraphicLayerId)));
                            const layer = new GraphicsLayer({
                                graphics: []
                            });
                            // TODO el filtro !==UP no parece funcionar porque muestra grado en una clasificacion Prohibida
                            this.resultBeachs = [...beachs].filter(x => x.relatedAfluencia.length > 0 && x.relatedEntorno.length > 0
                                && x.relatedIncidencias.length > 0 || x.clasificacion === 'UP');
                            beachs = [...beachs].filter(x => x.relatedAfluencia.length > 0 && x.relatedEntorno.length > 0
                                && x.relatedIncidencias.length > 0 && x.clasificacion !== 'UP');
                            beachs.forEach(beach => {
                                // si se ha seleccionado una fecha entonces los periodos se filtraran por esa fecha para mostrar el grado
                                const sDate = moment(this.SelectedDate, 'YYYY-MM-DD').startOf('day');
                                const incDias = sDate.format('ddd') !== 'Sat' && sDate.format('ddd') !== 'Sun' ? 'LB' : 'FS';
                                beach.periodos = this.gradeService.calculateGradeForPeriods(beach.relatedIncidencias, beach.relatedEntorno,
                                    this.SelectedDate ? beach.relatedAfluencia
                                            .filter(b => b.attributes.fecha_inicio <= new Date(this.SelectedDate).setHours(23)
                                                && b.attributes.fecha_fin >= new Date(this.SelectedDate).setHours(0) &&
                                                (b.attributes.incluir_dias === incDias || b.attributes.incluir_dias === 'TD'))
                                        : beach.relatedAfluencia);
                                if (beach.periodos.length > 0) {
                                    beach.grado_maximo = this.SelectedDate ? beach.periodos[0].grado :
                                        this.gradeService.getMaximunGrade(beach.periodos);
                                    beach = this.convertCentroidDataToGraphic(beach);
                                    const grap = Graphic.fromJSON(beach);
                                    if (!this.SelectedDate) {
                                        grap.attributes = beach.periodos;
                                        grap.popupTemplate = {
                                            title: 'Tabla de grados',
                                            content: this.gTable.nativeElement ? this.gTable.nativeElement : ''
                                        };
                                        grap.popupTemplate.overwriteActions = true;
                                    }
                                    grap.symbol = beach.grado_maximo === 'A' ? symbolHigh : beach.grado_maximo === 'M' ?
                                        symbolMedium : symbolLow;
                                    beach.grado_maximo ? layer.graphics.add(grap) : layer.graphics.add(null);
                                }
                            });
                            layer.minScale = 20000;
                            webmap.add(layer);
                            this.lastGraphicLayerId = layer.id;
                        }
                    },
                    error => {
                        console.log(error.toString());
                    });

                const t = this;
                let playasLayer, municipiosLayer, home;
                // Create widgets
                const scaleBar = createScaleBar(ScaleBar, viewer);
                const basemapToggle = createBaseMapToggle(BasemapToggle, viewer, 'streets-vector');
                const legend = createLegend(Legend, viewer, 'legendDivViewer');
                const expandList = createExpand(Expand, viewer, document.getElementById('listPlayasViewer')
                    , 'esri-icon-layer-list', 'Listado de playas');

                viewer.when(function () {
                    // configuro el popup
                    viewer.popup.autoOpenEnabled = true;
                    // Get layer objects from the web map
                    playasLayer = webmap.findLayerById(playasLayerViewerId);
                    municipiosLayer = webmap.findLayerById(municipiosLayerId);
                    const user = IdentityManager.credentials[0].userId;

                    // Filter by changing runtime params
                    filterPlayas = 'municipio = \'' + t.aytos.find(i => i.username === user).municipio_minus + '\'';
                    filterPlayas = filterPlayas + ' AND clasificacion IS NOT NULL';
                    filterMunicipios = 'municipio = \'' + t.aytos.find(i => i.username === user).municipio_mayus + '\'';
                    playasLayer.definitionExpression = filterPlayas;
                    municipiosLayer.definitionExpression = filterMunicipios;

                    municipiosLayer.queryFeatures({
                        outFields: ['*'],
                        where: filterMunicipios,
                        geometry: viewer.initialExtent,
                        returnGeometry: true
                    }).then(function (results) {
                        const latitude = results.features[0].geometry.centroid.latitude;
                        const longitude = results.features[0].geometry.centroid.longitude;
                        viewer.center = [longitude, latitude];
                        // Default Home value is current extent
                        home = createHomeButton(Home, viewer);
                        // Add widgets to the view
                        viewer.ui.add([home, expandList], 'top-left');
                        viewer.ui.add(scaleBar, 'bottom-left');
                        viewer.ui.add(['infoViewer', legend], 'top-right');
                        viewer.ui.add(['pdfbutton'], 'bottom-right');

                        // Some elements are hidden by default. We show them when the view is loaded
                        $('#infoViewer')[0].classList.remove('esri-hidden');
                        $('#listPlayasViewer')[0].classList.remove('esri-hidden');
                    });
                    viewer.on('click', function (event) {
                        // Listen for when the user clicks on the view
                        viewer.hitTest(event).then(function (response) {
                            const result = response.results.find(item => item.graphic.layer.id === t.lastGraphicLayerId);
                            const resultBeach = response.results.find(item => item.graphic.layer.id === playasLayerViewerId);
                            if (result) {
                                t.selectedPeriodos = result.graphic.attributes;
                                t.selectedPeriodos.sort((a, b) => (a.fecha_inicio > b.fecha_inicio) ? 1 :
                                    (a.fecha_inicio === b.fecha_inicio) ? ((a.fecha_fin > b.fecha_fin) ? 1 : -1) : -1);
                            }
                            if (resultBeach && t.resultBeachs.find(b => b.objectId === resultBeach.graphic.attributes.objectid)) {
                                t.selectedBeachId = resultBeach.graphic.attributes.objectid;
                            } else {
                                t.selectedBeachId = null;
                            }
                        });
                    });
                    const listID = 'ulPlayaViewer';
                    listNodeViewer = $('#ulPlayaViewer')[0];
                    listNodeViewer.addEventListener('click', onListClickHandler);

                    loadList(viewer, playasLayer, ['nombre_municipio', 'objectid'], filterPlayas).then(function (Beachs) {
                        featuresViewer = Beachs;
                    });

                    function onListClickHandler(event) {
                        const target = event.target;
                        const resultId = target.getAttribute('data-result-id');
                        const resultBeachId = Number(target.getAttribute('oid'));
                        if (t.resultBeachs.find(b => b.objectId === resultBeachId)) {
                            t.selectedBeachId = resultBeachId;
                        } else {
                            t.selectedBeachId = null;
                        }
                        expandList.collapse();

                        const result = resultId && featuresViewer && featuresViewer[parseInt(resultId, 10)];

                        try {
                            viewer.goTo(result.geometry.extent.expand(2));

                        } catch (error) {
                        }
                    }
                });

                // recargamos el filtro de municipio y de playas cuando se selecciona un nuevo municipio desde un superusuario
                this.subscripcionMunicipality = this.popService.sMunicipality$.subscribe(
                    (result: Municipality) => {
                        if (result.user && municipiosLayer) {
                            viewer.zoom = this.zoom;

                            this.currentUser = this.authService.getCurrentUser();
                            IdentityManager.credentials[0].userId = result.user;
                            filterMunicipios = 'municipio = \'' + t.aytos.find(i => i.username === result.user).municipio_mayus + '\'';
                            municipiosLayer.definitionExpression = filterMunicipios;
                            const filter = 'municipio = \'' + t.aytos.find(i => i.username === result.user).municipio_minus + '\''
                                + ' AND clasificacion IS NOT NULL';
                            playasLayer.definitionExpression = filter;
                            loadList(viewer, playasLayer, ['nombre_municipio', 'objectid'], filter).then(function (Beachs) {
                                featuresViewer = Beachs;
                            });
                            municipiosLayer.queryFeatures({
                                outFields: ['*'],
                                where: filterMunicipios,
                                geometry: viewer.initialExtent,
                                returnGeometry: true
                            }).then(function (results) {
                                const latitude = results.features[0].geometry.centroid.latitude;
                                const longitude = results.features[0].geometry.centroid.longitude;
                                viewer.center = [longitude, latitude];
                                // cambiamos el valor al nuevo municipio para el boton de home
                                home.viewpoint.targetGeometry.latitude = latitude;
                                home.viewpoint.targetGeometry.longitude = longitude;
                            });
                        }
                    },
                    error => {
                        console.log(error.toString());
                    });
            })
            .catch(err => {
                // handle any errors
                console.error(err);
            });
    }

    getDifference(p: GradeRecord) {
        return p.incluir_dias === 'TD' ? moment.duration(moment(p.fecha_fin).diff(p.fecha_inicio)).asDays() + 1 :
            this.getNumWorkDays(p.fecha_inicio, p.fecha_fin, p.incluir_dias);
    }

    getNumWorkDays(startDate, endDate, modo) {
        let start = moment(startDate, 'YYYY-MM-DD').startOf('day'); // Pick any format
        const end = moment(endDate, 'YYYY-MM-DD').startOf('day'); // right now (or define an end date yourself)
        let weekdayCounter = 0;
        let noweekdayCounter = 0;
        while (start <= end) {
            if (start.format('ddd') !== 'Sat' && start.format('ddd') !== 'Sun') {
                weekdayCounter++; // add 1 to your counter if its not a weekend day
            } else {
                noweekdayCounter++;
            }
            start = moment(start, 'YYYY-MM-DD').add(1, 'days'); // increment by one day
        }
        return modo !== 'FS' ? weekdayCounter : noweekdayCounter;
    }

    loadCatalogueInfoByid() {
        const filterbeach = 'objectid = \'' + this.selectedBeachId + '\'';
        this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_url + '/query', filterbeach,
            '*', false, this.currentUser.token, 'objectid', false).subscribe(
            (result: any) => {
                if (result ) {
                    this.printPdf(result.features[0]);
                } else if (result.error) {
                    Swal.fire({
                        type: 'error',
                        title: 'Error ' + result.error.code,
                        text: result.error.message,
                        footer: ''
                    });
                }
            },
            error => {
                console.log(error.toString());
            });
    }

    checkReport() {
        this.loadCatalogueInfoByid();
    }

    private printPdf(beach) {
      let nombre_ficha: string;
      let clasificacion: string;
      let isla: string;
      let fecha_hoy = moment().subtract(10, 'days').calendar();
      var doc = new jsPDF();

      doc.text(beach.attributes.nombre_municipio + ' - Fecha: ' + fecha_hoy, 15, 20);

      doc.autoTable({startY: 20});
        // TODO desarrollar el metodo con js2pdf
        beach = {...beach, ...this.resultBeachs.find(b => b.objectId === this.selectedBeachId)};
        switch (beach.attributes.clasificacion) {
          case 'L':
            clasificacion = 'Libre';
            break;
          case 'P':
            clasificacion = 'Peligrosa';
            break;
          case 'UP':
              clasificacion = 'Uso Prohibido';
            break;
          default:
          clasificacion = 'Sin clasificación';
            break;
        }

        var item = {
          "Nombre zona de baño" : beach.attributes.nombre_municipio,
          "Municipio" :  beach.attributes.municipio,
          "Provincia" :  beach.attributes.provincia,
          "Isla": beach.attributes.isla,
          "Clasificación" : clasificacion,
          "Longitud (mts)": beach.attributes.longitud_metros,
          "Anchura (mts)": beach.attributes.anchura_metros,
          'IDGSE':beach.attributes.id_dgse,
        };

        var col = ["Información general",''];
        var rows = [];
        for(var key in item){
          var temp = [key, item[key]];
          rows.push(temp);
        }
        doc.autoTable(col, rows);
        //periodos
        var colperiodos = ["Periodos",'Grado de protección', 'Afluencia'];
        var rowsperiodos = [];
        var grado;
        var afluencia;

        for(var key2 in beach.periodos){

          switch (beach.periodos[key2].grado) {
            case 'A':
              grado = 'ALTO';
              break;
            case 'M':
              grado = 'MODERADO';
              break;
            case 'B':
                grado = 'BAJO';
              break;
            default:
              grado = 'Sin grado de protección';
              break;
          }
          switch (beach.periodos[key2].afluencia) {
            case 'A':
              afluencia = 'ALTA';
              break;
            case 'M':
              afluencia = 'MEDIA';
              break;
            case 'B':
              afluencia = 'BAJA';
              break;
            default:
              afluencia = 'Afluencia no informada';
              break;
          }

            var temp2 = [moment(beach.periodos[key2].fecha_inicio).format('DD/MM/YYYY'), grado, afluencia];
            rowsperiodos.push(temp2);
        }
        doc.autoTable(colperiodos, rowsperiodos);
        //Entorno
        console.log(beach);
        var colentorno = ["Entorno",''];
        var rowsentorno = [];
        var cobertura = beach.relatedEntorno[0].attributes.cobertura_telefonica!=1 ? 'No' : 'Si';
        var itemEntorno = {
          "Accesos": beach.relatedEntorno[0].attributes.accesos,
          "Cobertura telefónica": cobertura,
        }
        for(var x in itemEntorno){
          var temp3 = [x, itemEntorno[x]];
          rowsentorno.push(temp3);
        }
        doc.autoTable(colentorno, rowsentorno);

        var colactividades = ["Actividades deportivas y de recreo",''];
        var rowsactividades = [];
        var itemActividades= {
          "Actividades acotadas": beach.relatedIncidencias[0].attributes.actividades_acotadas!=='1' ? 'No' : 'Si',
          "Actividades deportivas": beach.relatedIncidencias[0].attributes.actividades_deportivas!=='1' ? 'No' : 'Si',
          "Balizamiento": beach.relatedIncidencias[0].attributes.balizamiento!=='1' ? 'No' : 'Si',
        }
        for(var y in itemActividades){
          var temp4 = [y, itemActividades[y]];
          rowsactividades.push(temp4);
        }
        doc.autoTable(colactividades, rowsactividades);

        var colextras= ["Información detallada",''];
        var rowextras = [];
        var itemExtras= {
          "Acceso para discapacitados": beach.attributes.acceso_discapacitado!=='1' ? 'No' : 'Si',
          "Afluencia": beach.attributes.afluencia,
          "Alquiler de hamacas": beach.attributes.alquiler_hamaca!=='1' ? 'No' : 'Si',
          "Alquiler nautico": beach.attributes.alquiler_nautico!=='1' ? 'No' : 'Si',
          "Alquiler sombrilla": beach.attributes.alquiler_sombrilla!=='1' ? 'No' : 'Si',
          "Anchura(mts)": beach.attributes.anchura_metros,
          "Aparcamientos": beach.attributes.aparcamientos,
          "apto": beach.attributes.alquiler_apto!=='1' ? 'No' : 'Si',
          "Area deportiva": beach.attributes.alquiler_hamaca!=='1' ? 'No' : 'Si',
          "Area infantil": beach.attributes.alquiler_hamaca!=='1' ? 'No' : 'Si',
          "Aseo": beach.attributes.alquiler_hamaca!=='1' ? 'No' : 'Si',
          "Guagua": beach.attributes.alquiler_hamaca!=='1' ? 'No' : 'Si',
          "Tipo de Guagua": beach.attributes.autobus_tipo,
          "Auxilio y salvamento": beach.attributes.aux_y_salvamento!=='1' ? 'No' : 'Si',
          "Auxilio y salvamento (descripción)": beach.attributes.auxilio_y_salvamento_desc,
          "Bandera azul": beach.attributes.bandera_azul!=='1' ? 'No' : 'Si',
          "Carretera más próxima": beach.attributes.carretera_mas_proxima,
          "Composición": beach.attributes.composicion,
          "Condiciones del baño": beach.attributes.condiciones_baño,
          "Forma de acceso": beach.attributes.forma_de_acceso,
          "Tipo de arena": beach.attributes.tipo_de_arena,
          "Corregido por ayto.": beach.attributes.corregido_ayto!=='1' ? 'No' : 'Si',
          "Ducha": beach.attributes.ducha!=='1' ? 'No' : 'Si',
          "Fachada litoral": beach.attributes.fachada_litoral,
          "Grado de urbanización": beach.attributes.grado_urbanizacion,
          "Id de mapama": beach.attributes.id_mapama,
          "Id pilotaje litoral": beach.attributes.id_pilotaje_litoral,
          "Interlocutor": beach.attributes.interlocutor,
          "Kiosko": beach.attributes.kiosko!=='1' ? 'No' : 'Si',
          "Longitud": beach.attributes.longitud,
          "Latitud": beach.attributes.latitud,
          "Lavapies": beach.attributes.lavapie!=='1' ? 'No' : 'Si',
          "Nombre en Mapama": beach.attributes.nombre_mapama,
          "Nombre pilotaje litoral": beach.attributes.nombre_pilotaje_litoral,
          "Nueva en el catálogo": beach.attributes.nueva_catalogo,
          "Papeleras": beach.attributes.papeleras!=='1' ? 'No' : 'Si',
          "Paseo marítimo": beach.attributes.paseo_maritimo,
          "Playa zbm": beach.attributes.playa_zbm,
          "Presentado por Gesplan": beach.attributes.presentado_gesplan!=='1' ? 'No' : 'Si',
          "Registro dgse": beach.attributes.registro_dgse!=='1' ? 'No' : 'Si',
          "Requiere PSS": beach.attributes.requiere_pss!=='1' ? 'No' : 'Si',
          "Revisado por Gesplan": beach.attributes.revisado_gesplan!=='1' ? 'No' : 'Si',
          "Riesgo": beach.attributes.riesgo,
          "Submarinismo": beach.attributes.submarinismo_!=='1' ? 'No' : 'Si',
          "Técnico redactor": beach.attributes.tecnico_redactor,
          "Teléfono": beach.attributes.telefono!=='1' ? 'No' : 'Si',
          "Oficina de turismo": beach.attributes.turismo_oficina!=='1' ? 'No' : 'Si',
          "Último cambio": moment(beach.attributes.ultimo_cambio).format('DD/MM/YYYY') ,
          "Último editor": beach.attributes.ultimo_editor,
          "Zona de surf": beach.attributes.zona_surf,
        }
        for(var z in itemExtras){
          var temp5 = [z, itemExtras[z]];
          rowextras.push(temp5);
        }


        doc.autoTable(colextras, rowextras);
        nombre_ficha = 'Ficha_' + fecha_hoy + '_' + beach.attributes.nombre_municipio;
        doc.save(nombre_ficha + '.pdf');
    }
}
