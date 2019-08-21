import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Auth} from '../../models/auth';
import {loadModules} from 'esri-loader';
import {EsriRequestService} from '../../services/esri-request.service';
import {Risk} from '../../models/risk';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {EsriBoolean} from '../../models/esri-boolean';
import {environment} from '../../../environments/environment';
declare var $: any;
declare var jquery: any;


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
declare const clasificationRisksLayerId: any;
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
  //decoradores entrada salida
    @Output() beachId = new EventEmitter<string>();
    @Output() localName = new EventEmitter<string>();
    @Input() set mapHeight(mapHeight: string) { this._mapHeight = mapHeight; }
    @Input() set zoom(zoom: number) { this._zoom = zoom; }
    @Input() set selectForm(selectForm: string) { this._selectForm = selectForm;}

    selectedBeachRisk: Risk;
    formRisk: FormGroup;
    private featureResponse: Risk[];
    private onEdit: boolean;
    private _zoom = 5;
    private _mapHeight = '600px';
    private _selectForm = 'default';

    constructor(private authService: AuthGuardService, private service: EsriRequestService, private fb: FormBuilder) {
    }

    get zoom(): number {
        return this._zoom;
    }
    get mapHeight(): string {
        return this._mapHeight;
    }

    get selectForm(): string {
        return this._selectForm;
    }

    ngOnInit() {
        this.setMap();
        this.formRisk = this.fb.group({
            objectid: new FormControl(''),
            corrientes_mareas: new FormControl(''),
            rompientes_olas: new FormControl(''),
            contaminacion: new FormControl(''),
            fauna_marina: new FormControl(''),
            desprendimientos: new FormControl(''),
            id_dgse: new FormControl('')
        });
    }

    loadRelatedRecords() {
        const currentUser: Auth = this.authService.getCurrentUser();
        this.service.getEsriRelatedData(environment.EsriRelatedData,
            '237', '0', '*', true, currentUser.token).subscribe(
            (result: any) => {
                if (result) {
                    this.selectedBeachRisk = result.relatedRecordGroups[0].relatedRecords[0].attributes;
                    console.log(this.selectedBeachRisk);
                }
            },
            error => {
                console.log(error.toString());
            }).add(() => {
            console.log('end of request');
        });
    }

    sendMessage(id: string, name: string) {
        this.beachId.emit(id);
        this.localName.emit(name);
    }

    getUnselectedMessage() {
        return unselectedMessage;
    }

    onSubmit() {
        const currentUser: Auth = this.authService.getCurrentUser();
        // TODO cambiar con reactive forms que el valor en vez de ser true o false sea 1 o 0 para evitar el siguiente bloque
        const risk: Risk = this.formRisk.value;
        for (let [key, value] of Object.entries(risk)) {
            if (typeof value === 'boolean' || value === null) {
                risk[key] = value ? EsriBoolean.Yes : EsriBoolean.No;
            }
        }

        const updateObj = new Array();
        updateObj.push({attributes: risk});
        if (this.onEdit) {
            this.editData(updateObj, currentUser, 'updates');
        } else {
            this.editData(updateObj, currentUser, 'adds');
        }
    }

    private editData(updateObj, currentUser, mode) {
        this.service.applyEditsRelatedData(environment.EditsRelatedData,
            updateObj, mode, currentUser.token).subscribe(
            (result: any) => {
                if (result) {
                    console.log(result);
                }
            },
            error => {
                console.log(error.toString());
            }).add(() => {
            console.log('end of request');
            this.sendMessage('noid', unselectFeature());
        });
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
            'esri/tasks/QueryTask',
            'esri/tasks/support/Query',
            'esri/tasks/support/RelationshipQuery'
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
                       Home,
                       QueryTask,
                       Query,
                       RelationshipQuery
                   ]) => {

                // get session user
                const currentUser: Auth = this.authService.getCurrentUser();

                IdentityManager.registerToken({
                    expires: currentUser.expires,
                    server: environment.urlserver,
                    ssl: false,
                    token: currentUser.token,
                    userId: currentUser.username
                });
                // then we load a web map from an id
                const webmap = new WebMap({
                    portalItem: {
                        id: environment.idportal
                    }
                });
                // and we show that map in a container w/ id #viewDiv
                view = new MapView({
                    container: 'viewDiv', // Reference to the scene div created in step 5
                    map: webmap, // Reference to the map object created before the scene
                    zoom: this._zoom
                });
                console.log(view);

                let form, playasLayer, municipiosLayer, clasificationRisksTable, queryTask;
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

                    clasificationRisksTable = webmap.tables.filter(obj => {
                        return obj.id === clasificationRisksLayerId;
                    })[0];

                    queryTask = new QueryTask({
                        url: playasLayer.url + '/' + playasLayer.layerId + '/' + 'queryRelatedRecords'
                    });

                    let user = IdentityManager.credentials[0].userId;

                    filterPlayas = 'municipio = \'' + aytos[user].municipio_minus + '\'';
                    filterMunicipios = 'municipio = \'' + aytos[user].municipio_mayus + '\'';
                    console.log(filterMunicipios);

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
                    listNode.addEventListener('click', this.onListClickHandler);

                    loadList(view, playasLayer, ['nombre_municipio', 'objectid_12'], filterPlayas);

                    this.onListClickHandler((event) => {
                        const target = event.target;
                        const resultId = target.getAttribute('data-result-id');
                        const objectId = target.getAttribute('oid');

                        selectFeature(view, objectId, playasLayer, form).then(function (output) {
                            this.sendMessage(output.beachId, output.localName);
                            // cargamos los formularios de la tablas relacionadas
                            let query = new RelationshipQuery();
                            query.returnGeometry = false;
                            query.outFields = ['*'];
                            query.relationshipId = 0;
                            query.objectIds = [output.beachId];
                            queryTask.executeRelationshipQuery(query).then(function (results) {
                                this.formRisk.reset();
                                if (Object.entries(results).length === 0 && results.constructor === Object) {
                                    this.formRisk.patchValue({id_dgse: output.id_dgse});
                                    this.onEdit = false;
                                } else {
                                    this.formRisk.patchValue(results[query.objectIds[0]].features[0].attributes);
                                    this.onEdit = true;
                                }
                            });
                        });
                        expandList.collapse();

                        const result = resultId && features && features[parseInt(resultId, 10)];

                        try {
                            view.goTo(result.geometry.extent.expand(2));
                        } catch (error) {
                        }
                    })
                });
                view.on('click', function (event) {
                    // Listen for when the user clicks on the view
                    view.hitTest(event).then(function (response) {
                        // If user selects a feature, select it.Find function is for only taking results from desired layer
                        const result = response.results.find(item => item.graphic.layer.id === playasLayerId);
                        if (result) {
                            selectFeature(view, result.graphic.attributes[playasLayer.objectIdField], playasLayer, form, editFeature)
                                .then(function (output) {
                                    this.sendMessage(output.beachId, output.localName);
                                    // cargamos los formularios de la tablas relacionadas
                                    let query = new RelationshipQuery();
                                    query.returnGeometry = false;
                                    query.outFields = ['*'];
                                    query.relationshipId = 0;
                                    query.objectIds = [output.beachId];
                                    queryTask.executeRelationshipQuery(query).then(function (results) {
                                        this.formRisk.reset();
                                        if (Object.entries(results).length === 0 && results.constructor === Object) {
                                            this.formRisk.patchValue({id_dgse: output.id_dgse});
                                            this.onEdit = false;
                                        } else {
                                            this.formRisk.patchValue(results[query.objectIds[0]].features[0].attributes);
                                            this.onEdit = true;
                                        }
                                    });
                                });
                        } else {
                            this.sendMessage('noid', unselectFeature());
                        }
                    });
                });

                $('#btnSave')[0].onclick = function () {
                    this.sendMessage('noid', submitForm(playasLayer, form, ['nombre_municipio', 'objectid_12'], filterPlayas));
                };

                $('#tabView')[0].onclick = function () {
                };
            })
            .catch(err => {
                // handle any errors
                console.error(err);
            });
    }
}
