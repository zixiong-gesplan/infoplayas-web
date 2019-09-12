import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Auth} from '../../models/auth';
import {loadModules} from 'esri-loader';
import {EsriRequestService} from '../../services/esri-request.service';
import {Danger} from '../../models/danger';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {EsriBoolean} from '../../models/esri-boolean';
import {SelectItem} from 'primeng/api';
import {OverlayPanel} from 'primeng/primeng';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

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
    // decoradores entrada salida
    @Output() beachId = new EventEmitter<string>();
    @Output() localName = new EventEmitter<string>();
    @Output() nZones = new EventEmitter<number>();
    @Output() clasification = new EventEmitter<string>();
    @Input() mapHeight: string;
    @Input() zoom: number;
    @Input() selectForm: string;
    @Input() urlInfoMap: string;

    private currentUser: Auth;
    formDanger: FormGroup;
    formIncidents: FormGroup;
    noDangerOptions: SelectItem[];
    viewNoDanger: boolean;
    selectedId: string;
    selectLongitude: number;
    selectLatitude: number;
    coordX: number;
    coordY: number;
    wkid: number;
    centroidOption: boolean;
    selectedBeachDanger: Danger;

    constructor(private authService: AuthGuardService, private service: EsriRequestService, private fb: FormBuilder,
                private spinnerService: Ng4LoadingSpinnerService) {
        this.noDangerOptions = [
            {label: 'Selecciona nivel de peligrosidad', value: null},
            {label: 'Playas libres para el baño', value: 'LIBRE'},
            {label: 'Peligrosa o susceptible de producir daño', value: 'PELIGROSA'},
        ];
    }

    ngOnInit() {
        // get session or local storage user
        this.spinnerService.show();
        this.currentUser = this.authService.getCurrentUser();
        this.setMap();
        this.formDanger = this.fb.group({
            objectid: new FormControl(''),
            corrientes_mareas: new FormControl(''),
            rompientes_olas: new FormControl(''),
            contaminacion: new FormControl(''),
            fauna_marina: new FormControl(''),
            desprendimientos: new FormControl(''),
            id_dgse: new FormControl(''),
            on_edit: new FormControl('')
        });
        this.formIncidents = this.fb.group({
            objectid: new FormControl(''),
            incidentes_graves: new FormControl(''),
            incidentes_mgraves: new FormControl(''),
            actividades_deportivas: new FormControl(''),
            balizamiento: new FormControl(''),
            actividades_acotadas: new FormControl(''),
            incidentes_observaciones: new FormControl(''),
            deportes_observaciones: new FormControl(''),
            id_dgse: new FormControl(''),
            // campos auxiliares o calculados que no pertenecen al modelo
            val_peligrosidad: new FormControl({value: '', disabled: true}),
            on_edit: new FormControl('')
        });
        this.onChanges(this.formDanger);
    }

    loadRelatedRecords() {
        this.service.getEsriRelatedData(environment.infoplayas_catalogo_edicion_url + '/queryRelatedRecords',
            '237', '0', '*', true, this.currentUser.token).subscribe(
            (result: any) => {
                if (result) {
                    this.selectedBeachDanger = result.relatedRecordGroups[0].relatedRecords[0].attributes;
                    console.log(this.selectedBeachDanger);
                }
            },
            error => {
                console.log(error.toString());
            }).add(() => {
            console.log('end of request');
        });
    }

    sendMessage(id: string, name: string, clasification: string) {
        this.beachId.emit(id);
        this.localName.emit(name);
        this.clasification.emit(clasification);
    }

    getUnselectedMessage() {
        this.centroidOption = false;
        return unselectedMessage;
    }

    onSubmit(fg: FormGroup, relid: string) {
        const updateObj = new Array();
        updateObj.push({attributes: fg.value});
        const mode = fg.get('on_edit').value ? 'updates' : 'adds';
        const postExecuteTask = fg.contains('desprendimientos') && this.viewNoDanger ? 'no_prohibido' : fg.contains('desprendimientos')
            ? 'prohibido' : 'none';
        this.editRelatedData(updateObj, this.currentUser, mode, environment.infoplayas_catalogo_edicion_tablas_url + '/' + relid
            + '/applyEdits', postExecuteTask);
    }

    calculateDangerLever() {
        let dangerLevel = this.formIncidents.get('actividades_deportivas').value ? 5 : 0;
        dangerLevel -= this.formIncidents.get('balizamiento').value ? 4 : 0;
        dangerLevel -= this.formIncidents.get('actividades_acotadas').value ? 2 : 0;
        return dangerLevel > 0 ? dangerLevel : 0;
    }

// comprueba si se ha seleccionado algun elemento de peligro, que significara que la playa es de USO PROHIBIDO
    onChanges(form: FormGroup): void {
        form.valueChanges.subscribe(val => {
            this.viewNoDanger = true;
            for (let [key, value] of Object.entries(val)) {
                if (typeof value === 'boolean' && value && key !== 'on_edit' || value === -1) {
                    this.viewNoDanger = false;
                    break;
                }
            }
        });
    }

    private executePostData(prohibido: boolean) {
        const updateObj = new Array();
        updateObj.push({
            attributes: {
                objectid_12: this.selectedId,
                clasificacion: prohibido ? 'USO PROHIBIDO' : '-'
            }
        });
        this.editDataLayer(updateObj, this.currentUser, 'updates', environment.infoplayas_catalogo_edicion_url + '/applyEdits');
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

                IdentityManager.registerToken({
                    expires: this.currentUser.expires,
                    server: environment.urlserver,
                    ssl: false,
                    token: this.currentUser.token,
                    userId: this.currentUser.username
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
                    zoom: this.zoom
                });

                const t = this;
                let form, playasLayer, municipiosLayer, queryTask;
                // Create widgets
                const scaleBar = createScaleBar(ScaleBar, view);
                const basemapToggle = createBaseMapToggle(BasemapToggle, view, 'streets-vector');
                const legend = createLegend(Legend, view, 'legendDiv');
                const expandList = createExpand(Expand, view, document.getElementById('listPlayas')
                    , 'esri-icon-layer-list', 'Listado de playas');

                view.when(function () {
                    view.popup.autoOpenEnabled = false; // disable popups
                    // Get layer objects from the web map
                    playasLayer = webmap.findLayerById(playasLayerId);
                    municipiosLayer = webmap.findLayerById(municipiosLayerId);

                    queryTask = new QueryTask({
                        url: playasLayer.url + '/' + playasLayer.layerId + '/' + 'queryRelatedRecords'
                    });

                    const user = IdentityManager.credentials[0].userId;

                    // Filter by changing runtime params
                    filterPlayas = 'municipio = \'' + aytos[user].municipio_minus + '\'';
                    filterMunicipios = 'municipio = \'' + aytos[user].municipio_mayus + '\'';
                    playasLayer.definitionExpression = filterPlayas;
                    municipiosLayer.definitionExpression = filterMunicipios;

                    municipiosLayer.queryFeatures({
                        outFields: ['*'],
                        where: filterMunicipios,
                        geometry: view.initialExtent,
                        returnGeometry: true
                    }).then(function (results) {
                        const latitude = results.features[0].geometry.centroid.latitude;
                        const longitude = results.features[0].geometry.centroid.longitude;
                        // guardamos los datos de geometria del municipio para componentes externos
                        t.selectLatitude = latitude;
                        t.selectLongitude = longitude;
                        t.centroidOption = false;
                        view.center = [longitude, latitude];
                        // Default Home value is current extent
                        const home = createHomeButton(Home, view);
                        form = createForm(FeatureForm, 'form', playasLayer, forms[playasLayerId]);
                        // Add widgets to the view
                        view.ui.add([home, expandList], 'top-left');
                        view.ui.add(scaleBar, 'bottom-left');
                        view.ui.add(['info', legend], 'top-right');
                        view.ui.add(['infobutton'], 'bottom-right');

                        // Some elements are hidden my default. We show them when the view is loaded
                        $('#info')[0].classList.remove('esri-hidden');
                        $('#listPlayas')[0].classList.remove('esri-hidden');
                    });

                    const listID = 'ulPlaya';
                    listNode = $('#ulPlaya')[0];
                    listNode.addEventListener('click', onListClickHandler);

                    loadList(view, playasLayer, ['nombre_municipio', 'objectid_12'], filterPlayas).then(function (nBeachs) {
                        t.nZones.emit(nBeachs);
                        t.spinnerService.hide();
                    });

                    function onListClickHandler(event) {
                        const target = event.target;
                        const resultId = target.getAttribute('data-result-id');
                        const objectId = target.getAttribute('oid');

                        selectFeature(view, objectId, playasLayer, form).then(function (output) {
                            t.sendMessage(output.beachId, output.localName, output.clasificacion);
                            t.selectedId = output.beachId;
                            // consultas datos relacionados: relacionar formulario con el identificador de relacion de la tabla
                            t.execRelatedQuery(queryTask, RelationshipQuery, output, 0, t.formDanger);
                            t.execRelatedQuery(queryTask, RelationshipQuery, output, 1, t.formIncidents);
                            // guardamos los datos de geometria de la playa para componentes externos
                            t.coordX = output.coordX;
                            t.coordY = output.coordY;
                            t.wkid = output.wkid;
                            t.centroidOption = true;
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
                                .then(function (output) {
                                    t.sendMessage(output.beachId, output.localName, output.clasificacion);
                                    t.selectedId = output.beachId;
                                    // consultas datos relacionados: relacionar formulario con el identificador de relacion de la tabla
                                    t.execRelatedQuery(queryTask, RelationshipQuery, output, 0, t.formDanger);
                                    t.execRelatedQuery(queryTask, RelationshipQuery, output, 1, t.formIncidents);
                                    // guardamos los datos de geometria de la playa para componentes externos
                                    t.coordX = output.coordX;
                                    t.coordY = output.coordY;
                                    t.wkid = output.wkid;
                                    t.centroidOption = true;
                                });
                        } else {
                            t.sendMessage('noid', unselectFeature(), '-');
                            t.centroidOption = false;
                        }
                    });
                });

                $('#btnSave')[0].onclick = function () {
                    t.sendMessage('noid', submitForm(playasLayer, form, ['nombre_municipio', 'objectid_12'], filterPlayas), '-');
                };

                $('#js-filters-mosaic-flat')[0].onclick = function (event) {
                    let filter = 'municipio = \'' + aytos[IdentityManager.credentials[0].userId].municipio_minus + '\'';
                    filter = event.target.dataset.filter === '.protection' ? filter +
                        ' AND clasificacion IS NOT NULL AND clasificacion <> \'USO PROHIBIDO\'' : filter;
                    playasLayer.definitionExpression = filter;
                    t.spinnerService.show();
                    loadList(view, playasLayer, ['nombre_municipio', 'objectid_12'], filter).then(function (nBeachs) {
                        t.nZones.emit(nBeachs);
                        t.spinnerService.hide();
                    });
                };
            })
            .catch(err => {
                // handle any errors
                console.error(err);
            });
    }

    // cargamos los formularios de la tablas relacionadas
    private execRelatedQuery(queryTask, RelationshipQuery, output, relationshipId, frm: FormGroup) {
        const query = new RelationshipQuery();
        query.returnGeometry = false;
        query.outFields = ['*'];
        query.relationshipId = relationshipId;
        query.objectIds = [output.beachId];
        queryTask.executeRelationshipQuery(query).then((results: any) => {
            frm.reset();
            if (Object.entries(results).length === 0 && results.constructor === Object) {
                frm.patchValue({id_dgse: output.id_dgse});
                frm.patchValue({on_edit: false});
            } else {
                frm.patchValue(results[query.objectIds[0]].features[0].attributes);
                frm.patchValue({on_edit: true});
            }
        });
    }

    private editRelatedData(updateObj, currentUser, mode, endpoint, postExecute) {
        // cambiamos los valores true/false de los formularios por 1/0 que acepta Esri
        for (let [key, value] of Object.entries(updateObj)) {
            if (typeof value === 'boolean') {
                updateObj[key] = value ? EsriBoolean.Yes : EsriBoolean.No;
            }
        }
        this.service.updateEsriData(endpoint,
            updateObj, mode, currentUser.token).subscribe(
            (result: any) => {
                if (result) {
                    console.log(result);
                    switch (postExecute) {
                        case 'no_prohibido':
                            this.executePostData(false);
                            break;
                        case 'prohibido':
                            this.executePostData(true);
                            break;
                    }
                }
            },
            error => {
                console.log(error.toString());
            }).add(() => {
            if (postExecute === 'none') {
                console.log('end of request');
                this.sendMessage('noid', unselectFeature(), '-');
            }
        });
    }

    private editDataLayer(updateObj, currentUser, mode, endpoint) {
        this.service.updateEsriData(endpoint,
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
            this.sendMessage('noid', unselectFeature(), '-');
        });
    }

    openSecurityMeasures($event: MouseEvent, overlayPanel: OverlayPanel) {
        overlayPanel.toggle(event);
    }

    setUrlInfoMap() {
        return this.centroidOption ? this.urlInfoMap + '&zoom=18&center=' + this.coordX + ',' + this.coordY + ',' + this.wkid :
            this.urlInfoMap + '&zoom=' + this.zoom + '&center=' + this.selectLongitude + ',' + this.selectLatitude;
    }
}
