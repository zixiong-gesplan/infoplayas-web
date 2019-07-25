import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Auth} from '../../models/auth';
import {loadModules} from 'esri-loader';

// variables javascript esri maps
declare const selectFeature: any;
declare const createScaleBar: any;
declare const createBaseMapToggle: any;
declare const createLegend: any;
declare const createExpand: any;
declare const createHomeButton: any;
declare const unselectFeature: any;
declare const createForm: any;
declare const loadList: any;
declare const submitForm: any;

declare let filterPlayas: any;
declare let filterMunicipios: any;
declare const playasLayerId: any;
declare const municipiosLayerId: any;
declare const aytos: any;
declare const forms: any;
declare let editFeature: any;
declare let listNode: any;
declare let view: any;
declare let features: any;
declare let unselectedMessage: any;


@Component({
    selector: 'app-map-editor',
    templateUrl: './map-editor.component.html',
    styleUrls: ['./map-editor.component.css']
})
export class MapEditorComponent implements OnInit {
    @Output() beachId = new EventEmitter<string>();
    private _zoom = 5;
    private _mapHeight = '600px';

    constructor(private authService: AuthGuardService) {
    }

    ngOnInit() {
        this.setMap();
    }

    sendMessage(name: string) {
        this.beachId.emit(name);
    }

    @Input()
    set zoom(zoom: number) {
        this._zoom = zoom;
    }

    get zoom(): number {
        return this._zoom;
    }
    @Input()
    set mapHeight(mapHeight: string) {
        this._mapHeight = mapHeight;
    }

    get mapHeight(): string {
        return this._mapHeight;
    }

    private setMap() {
        const options = {css: true, version: '4.11'};

        // first, we use Dojo's loader to require the map class
        loadModules([
            'esri/WebMap',
            'esri/views/MapView',
            'esri/widgets/FeatureForm',
            'esri/widgets/Editor',
            'esri/identity/IdentityManager',
            'esri/widgets/ScaleBar',
            'esri/widgets/BasemapToggle',
            'esri/widgets/Expand',
            'esri/widgets/Legend',
            'esri/widgets/Home',
        ], options)
            .then(([
                       WebMap,
                       MapView,
                       FeatureForm,
                       Editor,
                       IdentityManager,
                       ScaleBar,
                       BasemapToggle,
                       Expand,
                       Legend,
                       Home
                   ]) => {

                // get session user
                const currentUser: Auth = this.authService.getCurrentUser();
                IdentityManager.registerToken({
                    expires: currentUser.expires,
                    server: 'http://www.arcgis.com/sharing/rest',
                    ssl: false,
                    token: currentUser.token,
                    userId: currentUser.username
                });
                // then we load a web map from an id
                const webmap = new WebMap({
                    portalItem: {
                        id: '4df033868833441798c532394806601c'
                    }
                });
                // and we show that map in a container w/ id #viewDiv
                view = new MapView({
                    container: 'viewDiv', // Reference to the scene div created in step 5
                    map: webmap, // Reference to the map object created before the scene
                    zoom: this._zoom
                });

                var t = this;
                let form, playasLayer, municipiosLayer;
                //Create widgets
                let scaleBar = createScaleBar(ScaleBar, view);
                let basemapToggle = createBaseMapToggle(BasemapToggle, view, 'streets-vector');
                let legend = createLegend(Legend, view, 'legendDiv');
                let expandList = createExpand(Expand, view, document.getElementById('listPlayas'), 'esri-icon-layer-list', 'Listado de playas');

                view.when(function () {
                    view.popup.autoOpenEnabled = false; //disable popups
                    // Get layer objects from the web map
                    playasLayer = webmap.findLayerById(playasLayerId);
                    municipiosLayer = webmap.findLayerById(municipiosLayerId);

                    let user = IdentityManager.credentials[0].userId;

                    filterPlayas = 'municipio = \'' + aytos[user].municipio_minus + '\'';
                    filterMunicipios = 'municipio = \'' + aytos[user].municipio_mayus + '\'';

                    //Filter by changing runtime params
                    playasLayer.definitionExpression = filterPlayas;
                    municipiosLayer.definitionExpression = filterMunicipios;

                    municipiosLayer.queryFeatures({
                        outFields: ['*'],
                        where: filterMunicipios,
                        geometry: view.initialExtent,
                        returnGeometry: true
                    }).then(function (results) {
                        let latitude = results.features[0].geometry.centroid.latitude;
                        let longitude = results.features[0].geometry.centroid.longitude;
                        view.center = [longitude, latitude];
                        //Default Home value is current extent
                        let home = createHomeButton(Home, view);
                        form = createForm(FeatureForm, 'form', playasLayer, forms[playasLayerId]);
                        //Add widgets to the view
                        view.ui.add([home, expandList], 'top-left');
                        view.ui.add(scaleBar, 'bottom-left');
                        view.ui.add(['info', legend], 'top-right');

                        //Some elements are hidden my default. We show them when the view is loaded
                        $('#info')[0].classList.remove('esri-hidden');
                        $('#listPlayas')[0].classList.remove('esri-hidden');
                    });

                    const listID = 'ulPlaya';
                    listNode = $('#ulPlaya')[0];
                    listNode.addEventListener('click', onListClickHandler);

                    loadList(view, playasLayer, ['nombre_municipio', 'objectid_12'], filterPlayas);
                    function onListClickHandler(event) {
                        const target = event.target;
                        const resultId = target.getAttribute('data-result-id');
                        const objectId = target.getAttribute('oid');

                        selectFeature(view, objectId, playasLayer, form).then(function(beachId) {
                            t.sendMessage(beachId);
                        });
                        expandList.collapse();

                        const result = resultId && features && features[parseInt(resultId, 10)];

                        try {
                            view.goTo(result.geometry.extent.expand(2));
                        } catch (error) {
                        }
                    }
                });
                view.on('click', function (event) {
                    // Listen for when the user clicks on the view
                    view.hitTest(event).then(function (response) {
                        // If user selects a feature, select it.Find function is for only taking results from desired layer
                        const result = response.results.find(item => item.graphic.layer.id === playasLayerId);
                        if (result) {
                            selectFeature(view, result.graphic.attributes[playasLayer.objectIdField], playasLayer, form, editFeature)
                                .then(function(beachId) {
                                t.sendMessage(beachId);
                            });
                        } else {
                            t.sendMessage(unselectFeature());
                        }
                    });
                });

                $('#btnSave')[0].onclick = function () {
                    t.sendMessage(submitForm(playasLayer, form, ['nombre_municipio', 'objectid_12'], filterPlayas));
                };
            })
            .catch(err => {
                // handle any errors
                console.error(err);
            });
    }

    getUnselectedMessage() {
        return unselectedMessage;
    }
}
