import {Component, OnDestroy, OnInit} from '@angular/core';
import {loadModules} from 'esri-loader';
import {Auth} from '../../models/auth';
import {AuthGuardService} from '../../services/auth-guard.service';
import {EsriRequestService} from '../../services/esri-request.service';
import {environment} from '../../../environments/environment';
import {PopulationService} from '../../services/population.service';
import {Municipality} from '../../models/municipality';
import {AppSettingsService} from '../../services/app-settings.service';
import {AppSetting} from '../../models/app-setting';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/api';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import Swal from 'sweetalert2';
import {AppSettings} from '../../../app-settings';

declare var $: any;
declare var jquery: any;


// variables javascript esri maps
declare let viewer: any;
declare let highlight: any;
declare const createScaleBar: any;
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
    selector: 'app-map-pick-location',
    templateUrl: './map-pick-location.component.html',
    styleUrls: ['./map-pick-location.component.css']
})
export class MapPickLocationComponent implements OnInit, OnDestroy {
    selectedBeachId: number;
    private currentUser: Auth;
    private subscripcionMunicipality;
    private lastGraphicLayerId: string;
    selectedMpPoint: any;
    private aytos: AppSetting[];
    private dataMun: [String, String];

    constructor(private authService: AuthGuardService, public service: EsriRequestService, private popService: PopulationService,
                private appSettingsService: AppSettingsService, public ref: DynamicDialogRef, public config: DynamicDialogConfig,
                private spinnerService: Ng4LoadingSpinnerService) {
    }

    ngOnInit() {
        // this.spinnerService.show();
        this.appSettingsService.getJSON().subscribe(data => {
            this.aytos = data;
            this.currentUser = this.authService.getCurrentUser();
            this.setMap();
        });
    }

    // preparamos una lista de features provenientes del REST API para que tenga la estructura para añadir a la capa grafica de un mapa.
    convertCentroidDataToGraphic(beach: any) {
        beach.geometry = beach.centroid;
        beach.geometry.spatialReference = {
            latestWkid: 32628,
            wkid: 32628
        };
        return beach;
    }

    ngOnDestroy() {
        this.subscripcionMunicipality.unsubscribe();
    }

    close() {
        if (this.selectedBeachId) {
            this.loadCatalogueInfoByid();
        } else {
            Swal.fire({
                title: 'No ha seleccionado ninguna playa para el incidente',
                text: '¿Desea continuar?',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Sí, no ha sucedido en una playa',
                footer: '',
                type: 'warning'
            }).then((result) => {
                if (result.value) {
                    this.selectedMpPoint.attributes = {isla: this.dataMun[0], municipio: this.dataMun[1]};
                    this.ref.close(this.selectedMpPoint);
                }
            });
        }
    }

    loadCatalogueInfoByid() {
        this.spinnerService.show();
        const filterBeach = 'objectid = \'' + this.selectedBeachId + '\'';
        this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_url + '/query', filterBeach,
            '*', false, this.currentUser.token, 'objectid', false).subscribe(
            (result: any) => {
                if (result && result.features.length > 0) {
                    this.selectedMpPoint.attributes = result.features[0].attributes;
                    this.ref.close(this.selectedMpPoint);
                } else if (result.error) {
                    Swal.fire({
                        type: 'error',
                        title: 'Error ' + result.error.code,
                        text: result.error.message,
                        footer: ''
                    });
                }
                this.spinnerService.hide();
            },
            error => {
                console.log(error.toString());
                this.spinnerService.hide();
            });
    }

    private setMap() {
        const options = {css: true, version: '4.13'};

        // first, we use Dojo's loader to require the map class
        loadModules([
            'esri/WebMap',
            'esri/views/MapView',
            'esri/identity/IdentityManager',
            'esri/widgets/ScaleBar',
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
                       Expand,
                       Legend,
                       Home,
                       Graphic,
                       GraphicsLayer
                   ]) => {

                IdentityManager.registerToken({
                    expires: this.currentUser.expires,
                    server: AppSettings.urlServerRest,
                    ssl: true,
                    token: this.currentUser.token,
                    userId: this.currentUser.username
                });
                // then we load a web map from an id
                const webmap = new WebMap({
                    portalItem: {
                        id: AppSettings.idportalView
                    }
                });
                // and we show that map in a container w/ id #viewDiv
                viewer = new MapView({
                    container: 'viewDivViewer', // Reference to the scene div created in step 5
                    map: webmap, // Reference to the map object created before the scene
                    zoom: this.config.data.zoom
                });

                const t = this;
                let playasLayer, municipiosLayer, home;
                // Create widgets
                const scaleBar = createScaleBar(ScaleBar, viewer);
                const legend = createLegend(Legend, viewer, 'legendDivViewer');
                const expandList = createExpand(Expand, viewer, document.getElementById('listPlayasViewer')
                    , 'esri-icon-layer-list', 'Listado de playas');

                viewer.when(function () {
                    // cancelo el popup
                    viewer.popup.autoOpenEnabled = false;
                    // Get layer objects from the web map
                    playasLayer = webmap.findLayerById(playasLayerViewerId);
                    municipiosLayer = webmap.findLayerById(municipiosLayerId);
                    const ayto = t.popService.getMunicipality().user;
                    highlight = null;
                    // Filter by changing runtime params
                    filterPlayas = 'municipio = \'' + t.aytos.find(i => i.ayto === ayto).municipio_minus + '\'';
                    filterPlayas = filterPlayas + ' AND clasificacion IS NOT NULL';
                    filterMunicipios = 'municipio = \'' + t.aytos.find(i => i.ayto === ayto).municipio_mayus + '\'';
                    playasLayer.definitionExpression = filterPlayas;
                    municipiosLayer.definitionExpression = filterMunicipios;

                    municipiosLayer.queryFeatures({
                        outFields: ['*'],
                        where: filterMunicipios,
                        geometry: viewer.initialExtent,
                        returnGeometry: true
                    }).then(function (results) {
                        if (!t.config.data.id) {
                            const latitude = results.features[0].geometry.centroid.latitude;
                            const longitude = results.features[0].geometry.centroid.longitude;
                            viewer.center = [longitude, latitude];
                        }
                        // Datos del municipio del incidente para el componente padre en caso de que no seleccione playa
                        t.dataMun = [results.features[0].attributes.isla, results.features[0].attributes.municipio];
                        // Default Home value is current extent
                        home = createHomeButton(Home, viewer);
                        home.viewpoint = {
                            targetGeometry: results.features[0].geometry.extent
                        };
                        // Add widgets to the view
                        viewer.ui.add([home, expandList], 'top-left');
                        viewer.ui.add(scaleBar, 'bottom-left');
                        viewer.ui.add([legend], 'top-right');

                        // Some elements are hidden by default. We show them when the view is loaded
                        $('#listPlayasViewer')[0].classList.remove('esri-hidden');
                    });
                    viewer.on('click', function (event) {
                        // Listen for when the user clicks on the view
                        viewer.hitTest(event).then(function (response) {
                            if (response.results.length > 1) {
                                standOutBeach(response.results[0].graphic.layer, response.results[0].graphic.attributes.objectid);
                                const resultBeach = response.results.find(item => item.graphic.layer.id === playasLayerViewerId);
                                t.selectedBeachId = resultBeach.graphic.attributes.objectid;
                            }
                            let layer = null;
                            layer = getLastGraphicLayerForPoint(layer);
                            const mpPoint = viewer.toMap(response.screenPoint);
                            const pointGraphic = new Graphic({
                                geometry: mpPoint,
                                symbol: {
                                    type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
                                    url: 'https://static.arcgis.com/images/Symbols/Animated/EnlargeRotatingRedMarkerSymbol.png',
                                    width: '48px',
                                    height: '48px'
                                }
                            });
                            layer.graphics.add(pointGraphic);
                            t.selectedMpPoint = pointGraphic;
                        });
                    });
                    const listID = 'ulPlayaViewer';
                    listNodeViewer = $('#ulPlayaViewer')[0];
                    listNodeViewer.addEventListener('click', onListClickHandler);

                    loadList(viewer, playasLayer, ['nombre_municipio', 'objectid'], filterPlayas).then(function (Beachs) {
                        featuresViewer = Beachs;
                        // movemos la vista a la playa que se haya seleccionado en el mapa editor
                        if (t.config.data.id) {
                            const fe = featuresViewer.find(b => b.attributes.objectid === t.config.data.id);
                            viewer.goTo(fe.geometry.extent.expand(2));
                        }
                    });

                    function onListClickHandler(event) {
                        const target = event.target;
                        const resultId = target.getAttribute('data-result-id');
                        const resultBeachId = Number(target.getAttribute('oid'));
                        if (resultBeachId) {
                            t.selectedBeachId = resultBeachId;
                        } else {
                            t.selectedBeachId = null;
                        }
                        expandList.collapse();

                        const result = resultId && featuresViewer && featuresViewer[parseInt(resultId, 10)];

                        try {
                            viewer.goTo(result.geometry.extent.expand(2));
                            standOutBeach(result.layer, resultBeachId);
                        } catch (error) {
                        }
                    }

                    function standOutBeach(beachLayer, id) {
                        viewer.whenLayerView(beachLayer).then(function (layerView) {
                            if (highlight) {
                                highlight.remove();
                                highlight = null;
                            }
                            highlight = layerView.highlight(id);
                        });
                    }

                    function getLastGraphicLayerForPoint(layer) {
                        if (!t.lastGraphicLayerId) {
                            layer = new GraphicsLayer({
                                graphics: []
                            });
                            layer.minScale = 180000;
                            webmap.add(layer);
                            t.lastGraphicLayerId = layer.id;
                        } else {
                            layer = webmap.findLayerById(t.lastGraphicLayerId);
                            layer.graphics.items.forEach(v => {
                                layer.graphics.remove(v);
                            });
                        }
                        return layer;
                    }

                });

                // recargamos el filtro de municipio y de playas cuando se selecciona un nuevo municipio desde un superusuario
                this.subscripcionMunicipality = this.popService.sMunicipality$.subscribe(
                    (result: Municipality) => {
                        if (result.user && municipiosLayer) {
                            viewer.zoom = this.config.data.zoom;
                            highlight = null;
                            filterMunicipios = 'municipio = \'' + t.aytos.find(i => i.ayto === result.user).municipio_mayus + '\'';
                            municipiosLayer.definitionExpression = filterMunicipios;
                            const filter = 'municipio = \'' + t.aytos.find(i => i.ayto === result.user).municipio_minus + '\''
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

}
