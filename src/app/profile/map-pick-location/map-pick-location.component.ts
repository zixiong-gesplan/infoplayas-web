import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/api';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {AppSettingsService} from '../../services/app-settings.service';
import {AppSetting} from '../../models/app-setting';
import {Auth} from '../../models/auth';
import {AuthGuardService} from '../../services/auth-guard.service';
import {loadModules} from 'esri-loader';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import {Municipality} from '../../models/municipality';
import {EsriRequestService} from '../../services/esri-request.service';
import {PopulationService} from '../../services/population.service';

declare var $: any;
declare var jquery: any;


// variables javascript esri maps
declare let pickMapView: any;
declare const createScaleBar: any;
declare const createBaseMapToggle: any;
declare const createLegend: any;
declare const createExpand: any;
declare const playasLayerPickId: any;
declare const municipiosLayerId: any;
declare let filterPlayas: any;
declare let filterMunicipios: any;
declare const createHomeButton: any;
declare let listNodePick: any;
declare const loadList: any;
declare let featuresPick: any;

@Component({
    selector: 'app-map-pick-location',
    templateUrl: './map-pick-location.component.html',
    styleUrls: ['./map-pick-location.component.css']
})
export class MapPickLocationComponent implements OnInit {
    private aytos: AppSetting[];
    private currentUser: Auth;
    private subscripcionMunicipality;
    private lastGraphicLayerId: number;

    constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private spinnerService: Ng4LoadingSpinnerService,
                private authService: AuthGuardService, private appSettingsService: AppSettingsService,
                private popService: PopulationService) {
    }

    ngOnInit() {
        // this.spinnerService.show();
        this.appSettingsService.getJSON().subscribe(data => {
            this.aytos = data;
            this.currentUser = this.authService.getCurrentUser();
            this.setMap();
        });
    }

    close() {
        // TODO cierra ventana y traslada los datos de la playa y la geometria al componente que invoca al servicio
    }

    private setMap() {
        const options = {css: true, version: '4.13'};

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
                    userId: this.currentUser.username
                });
                // then we load a web map from an id
                const webmap = new WebMap({
                    portalItem: {
                        // TODO cambiar por uno con los incidentes de la playa
                        id: environment.idportalView
                    }
                });
                // and we show that map in a container w/ id #viewDiv
                pickMapView = new MapView({
                    container: 'viewDivPick', // Reference to the scene div created in step 5
                    map: webmap, // Reference to the map object created before the scene
                    zoom: this.config.data.zoom
                });
                // cambiamos la capa grafica en funcion de los cambios de las entidades desde los formularios de clasificacion
                const layer = new GraphicsLayer({
                    graphics: []
                });
                layer.minScale = 20000;
                webmap.add(layer);
                this.lastGraphicLayerId = layer.id;

                const t = this;
                let playasLayer, municipiosLayer, home;
                // Create widgets
                const scaleBar = createScaleBar(ScaleBar, pickMapView);
                const basemapToggle = createBaseMapToggle(BasemapToggle, pickMapView, 'streets-vector');
                const legend = createLegend(Legend, pickMapView, 'legendDivPick');
                const expandList = createExpand(Expand, pickMapView, document.getElementById('listPlayasPick')
                    , 'esri-icon-layer-list', 'Listado de playas');

                pickMapView.when(function () {
                console.log('aqui');
                    // configuro el popup
                    pickMapView.popup.autoOpenEnabled = false;
                    // Get layer objects from the web map
                    playasLayer = webmap.findLayerById(playasLayerPickId);
                    municipiosLayer = webmap.findLayerById(municipiosLayerId);
                    const ayto = t.popService.getMunicipality().user;

                    // Filter by changing runtime params
                    filterPlayas = 'municipio = \'' + t.aytos.find(i => i.ayto === ayto).municipio_minus + '\'';
                    filterPlayas = filterPlayas + ' AND clasificacion IS NOT NULL';
                    filterMunicipios = 'municipio = \'' + t.aytos.find(i => i.ayto === ayto).municipio_mayus + '\'';
                    playasLayer.definitionExpression = filterPlayas;
                    municipiosLayer.definitionExpression = filterMunicipios;

                    municipiosLayer.queryFeatures({
                        outFields: ['*'],
                        where: filterMunicipios,
                        geometry: pickMapView.initialExtent,
                        returnGeometry: true
                    }).then(function (results) {
                        // if (!t.config.data.id) {
                            const latitude = results.features[0].geometry.centroid.latitude;
                            const longitude = results.features[0].geometry.centroid.longitude;
                            pickMapView.center = [longitude, latitude];
                        // }
                        // Default Home value is current extent
                        home = createHomeButton(Home, pickMapView);
                        home.viewpoint = {
                            targetGeometry: results.features[0].geometry.extent
                        };

                        // Add widgets to the view
                        pickMapView.ui.add([home, expandList], 'top-left');
                        pickMapView.ui.add(scaleBar, 'bottom-left');
                        pickMapView.ui.add(['infoPick', legend], 'top-right');

                        // Some elements are hidden by default. We show them when the view is loaded
                        $('#listPlayasPick')[0].classList.remove('esri-hidden');
                    });
                    pickMapView.on('click', function (event) {
                        // Listen for when the user clicks on the view
                        pickMapView.hitTest(event).then(function (response) {
                            const result = response.results.find(item => item.graphic.layer.id === t.lastGraphicLayerId);
                            const resultBeach = response.results.find(item => item.graphic.layer.id === playasLayerPickId);
                            // if (result) {
                            //     t.selectedPeriodos = result.graphic.attributes;
                            //     t.selectedPeriodos.sort((a, b) => (a.fecha_inicio > b.fecha_inicio) ? 1 :
                            //         (a.fecha_inicio === b.fecha_inicio) ? ((a.fecha_fin > b.fecha_fin) ? 1 : -1) : -1);
                            // }
                            // if (resultBeach && t.resultBeachs.find(b => b.objectId === resultBeach.graphic.attributes.objectid)) {
                            //     t.selectedBeachId = resultBeach.graphic.attributes.objectid;
                            // } else {
                            //     t.selectedBeachId = null;
                            // }
                        });
                    });
                    const listID = 'ulPlayaPick';
                    listNodePick = $('#ulPlayaPick')[0];
                    listNodePick.addEventListener('click', onListClickHandler);

                    loadList(pickMapView, playasLayer, ['nombre_municipio', 'objectid'], filterPlayas).then(function (Beachs) {
                        featuresPick = Beachs;
                        // movemos la vista a la playa que se haya seleccionado en el mapa editor
                        if (t.config.data.id) {
                            const fe = featuresPick.find(b => b.attributes.objectid === t.config.data.id);
                            pickMapView.goTo(fe.geometry.extent.expand(2));
                        }
                    });

                    function onListClickHandler(event) {
                        const target = event.target;
                        const resultId = target.getAttribute('data-result-id');
                        const resultBeachId = Number(target.getAttribute('oid'));
                        // if (t.resultBeachs.find(b => b.objectId === resultBeachId)) {
                        //     t.selectedBeachId = resultBeachId;
                        // } else {
                        //     t.selectedBeachId = null;
                        // }
                        expandList.collapse();

                        const result = resultId && featuresPick && featuresPick[parseInt(resultId, 10)];

                        try {
                            pickMapView.goTo(result.geometry.extent.expand(2));

                        } catch (error) {
                        }
                    }
                });

                // recargamos el filtro de municipio y de playas cuando se selecciona un nuevo municipio desde un superusuario
                this.subscripcionMunicipality = this.popService.sMunicipality$.subscribe(
                    (result: Municipality) => {
                        if (result.user && municipiosLayer) {
                            pickMapView.zoom = this.config.data.zoom;

                            filterMunicipios = 'municipio = \'' + t.aytos.find(i => i.ayto === result.user).municipio_mayus + '\'';
                            municipiosLayer.definitionExpression = filterMunicipios;
                            const filter = 'municipio = \'' + t.aytos.find(i => i.ayto === result.user).municipio_minus + '\''
                                + ' AND clasificacion IS NOT NULL';
                            playasLayer.definitionExpression = filter;
                            loadList(pickMapView, playasLayer, ['nombre_municipio', 'objectid'], filter).then(function (Beachs) {
                                featuresPick = Beachs;
                            });
                            municipiosLayer.queryFeatures({
                                outFields: ['*'],
                                where: filterMunicipios,
                                geometry: pickMapView.initialExtent,
                                returnGeometry: true
                            }).then(function (results) {
                                const latitude = results.features[0].geometry.centroid.latitude;
                                const longitude = results.features[0].geometry.centroid.longitude;
                                pickMapView.center = [longitude, latitude];
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
