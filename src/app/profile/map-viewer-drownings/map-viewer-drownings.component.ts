import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {loadModules} from 'esri-loader';
import {Auth} from '../../models/auth';
import {AuthGuardService} from '../../services/auth-guard.service';
import {EsriRequestService} from '../../services/esri-request.service';
import {environment} from '../../../environments/environment';
import {PopulationService} from '../../services/population.service';
import {Municipality} from '../../models/municipality';
import {AppSettingsService} from '../../services/app-settings.service';
import {AppSetting} from '../../models/app-setting';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import Swal from 'sweetalert2';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {Observable, Subscription} from 'rxjs';

declare var $: any;
declare var jquery: any;

// variables javascript esri maps
declare let viewer: any;
declare let highlightIncident: any;
declare const createScaleBar: any;
declare const createLegend: any;
declare const createExpand: any;
declare const playasLayerViewerId: any;
declare const municipiosLayerId: any;
declare const incidentesLayerId: any;
declare let filterPlayas: any;
declare let filterMunicipios: any;
declare let filterIncidentes: any;
declare const createHomeButton: any;
declare let listNodeDrowningsViewer: any;
declare const loadList: any;
declare let featuresViewer: any;

@Component({
    selector: 'app-map-viewer-drownings',
    templateUrl: './map-viewer-drownings.component.html',
    styleUrls: ['./map-viewer-drownings.component.css']
})
export class MapViewerDrowningsComponent implements OnInit, OnDestroy {
    @Input() mapHeight: string;
    @Input() zoom: number;
    @Input() events: Observable<void>;
    @Output() selectedIncidentId = new EventEmitter<number>();
    private currentUser: Auth;
    private subscripcionMunicipality;
    private eventsSubscription: Subscription;
    private aytos: AppSetting[];

    constructor(private authService: AuthGuardService, public service: EsriRequestService, private popService: PopulationService,
                private appSettingsService: AppSettingsService, private spinnerService: Ng4LoadingSpinnerService) {
    }

    ngOnInit() {
        // this.spinnerService.show();
        this.appSettingsService.getJSON().subscribe(data => {
            this.aytos = data;
            this.currentUser = this.authService.getCurrentUser();
            this.setMap();
        });
    }

    ngOnDestroy() {
        this.subscripcionMunicipality.unsubscribe();
        this.eventsSubscription.unsubscribe();
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
                       Home
                   ]) => {

                IdentityManager.registerToken({
                    expires: this.currentUser.expires,
                    server: environment.urlServerRest,
                    ssl: true,
                    token: this.currentUser.token,
                    userId: this.currentUser.username
                });
                // then we load a web map from an id
                const webmap = new WebMap({
                    portalItem: {
                        id: environment.idportalDrownings
                    }
                });
                // and we show that map in a container w/ id #viewDiv
                viewer = new MapView({
                    container: 'viewDivDrowningsViewer', // Reference to the scene div created in step 5
                    map: webmap, // Reference to the map object created before the scene
                    zoom: this.zoom
                });

                const t = this;
                let playasLayer, municipiosLayer, incidentesLayer, home;
                // Create widgets
                const scaleBar = createScaleBar(ScaleBar, viewer);
                const legend = createLegend(Legend, viewer, 'legendDivDrowningsViewer');
                const expandList = createExpand(Expand, viewer, document.getElementById('listPlayasDrowningsViewer')
                    , 'esri-icon-layer-list', 'Listado de playas');

                viewer.when(function () {
                    // activo el popup
                    viewer.popup = {
                        dockEnabled: true,
                        dockOptions: {
                            // Disables the dock button from the popup
                            buttonEnabled: false,
                            // Ignore the default sizes that trigger responsive docking
                            breakpoint: false,
                            position: 'bottom-right'
                        }
                    };
                    // Get layer objects from the web map
                    playasLayer = webmap.findLayerById(playasLayerViewerId);
                    municipiosLayer = webmap.findLayerById(municipiosLayerId);
                    incidentesLayer = webmap.findLayerById(incidentesLayerId);
                    const ayto = t.popService.getMunicipality().user;
                    // Filter by changing runtime params
                    filterPlayas = 'municipio = \'' + t.aytos.find(i => i.ayto === ayto).municipio_minus + '\'';
                    filterPlayas = filterPlayas + ' AND clasificacion IS NOT NULL';
                    filterMunicipios = 'municipio = \'' + t.aytos.find(i => i.ayto === ayto).municipio_mayus + '\'';
                    // TODO aclarar con Jose este tema de errores en los valores de municipio
                    // filterIncidentes = 'municipio = \'' + t.aytos.find(i => i.ayto === ayto).municipio_minus + '\'';
                    filterIncidentes = 'municipio = \'47.0\'';
                    playasLayer.definitionExpression = filterPlayas;
                    municipiosLayer.definitionExpression = filterMunicipios;
                    incidentesLayer.definitionExpression = filterIncidentes;

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
                        home.viewpoint = {
                            targetGeometry: results.features[0].geometry.extent
                        };
                        // Add widgets to the view
                        viewer.ui.add([home, expandList], 'top-left');
                        viewer.ui.add(scaleBar, 'bottom-left');
                        viewer.ui.add([legend], 'top-right');
                        // Some elements are hidden by default. We show them when the view is loaded
                        $('#listPlayasDrowningsViewer')[0].classList.remove('esri-hidden');
                    });
                    viewer.on('click', function (event) {
                        // Listen for when the user clicks on the view
                        viewer.hitTest(event).then(function (response) {
                            t.removeSelection();
                            if (response.results.length > 0) {
                                const resultIncident = response.results.find(item => item.graphic.layer.id === incidentesLayerId);
                                if (resultIncident) {
                                    standOutIncident(response.results[0].graphic.layer, response.results[0].graphic.attributes.objectid);
                                    t.selectedIncidentId.emit(resultIncident.graphic.attributes.objectid);
                                }
                            } else {
                                t.selectedIncidentId.emit(null);
                            }
                        });
                    });
                    const listID = 'ulPlayaDrowningsViewer';
                    listNodeDrowningsViewer = $('#ulPlayaDrowningsViewer')[0];
                    listNodeDrowningsViewer.addEventListener('click', onListClickHandler);

                    loadList(viewer, playasLayer, ['nombre_municipio', 'objectid'], filterPlayas).then(function (Beachs) {
                        featuresViewer = Beachs;
                    });

                    function onListClickHandler(event) {
                        const target = event.target;
                        const resultId = target.getAttribute('data-result-id');
                        expandList.collapse();

                        const result = resultId && featuresViewer && featuresViewer[parseInt(resultId, 10)];
                        try {
                            viewer.goTo(result.geometry.extent.expand(2));
                        } catch (error) {
                        }
                    }

                    function standOutIncident(incidentLayer, id) {
                        viewer.whenLayerView(incidentLayer).then(function (layerView) {
                            highlightIncident = layerView.highlight(id);
                        });
                    }

                });

                this.eventsSubscription = this.events.subscribe(() => {
                    t.removeSelection();
                });

                // recargamos el filtro de municipio y de playas cuando se selecciona un nuevo municipio desde un superusuario
                this.subscripcionMunicipality = this.popService.sMunicipality$.subscribe(
                    (result: Municipality) => {
                        if (result.user && municipiosLayer) {
                            viewer.zoom = this.zoom;
                            t.removeSelection();
                            filterMunicipios = 'municipio = \'' + t.aytos.find(i => i.ayto === result.user).municipio_mayus + '\'';
                            municipiosLayer.definitionExpression = filterMunicipios;
                            const filter = 'municipio = \'' + t.aytos.find(i => i.ayto === result.user).municipio_minus + '\''
                                + ' AND clasificacion IS NOT NULL';
                            playasLayer.definitionExpression = filter;
                            // TODO arreglar los valores del campo municipio de incidentes
                            // incidentesLayer.definitionExpression = filterMunicipios;
                            incidentesLayer.definitionExpression = 'municipio = \'47.0\'';
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
                                home.viewpoint = {
                                    targetGeometry: results.features[0].geometry.extent
                                };
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

    removeSelection() {
        if (highlightIncident) {
            highlightIncident.remove();
            // TODO duplicado porque hay algo mal en la api o en la plantilla web que usamos que interfiere con el método de remove
            highlightIncident.remove();
        }
    }

}
