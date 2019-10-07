import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Auth} from '../../models/auth';
import {loadModules} from 'esri-loader';
import {EsriRequestService} from '../../services/esri-request.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {ConfirmationService, MessageService, SelectItem} from 'primeng/api';
import {OverlayPanel} from 'primeng/primeng';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {Attribute} from '../../models/attribute';

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
    formDanger: FormGroup;
    formIncidents: FormGroup;
    formEnvironment: FormGroup;
    formFlow: FormGroup;
    noDangerOptions: SelectItem[];
    wavesOptions: SelectItem[];
    accessOptions: SelectItem[];
    FlowOptions: SelectItem[];
    viewNoDanger: boolean;
    selectedId: string;
    selectLongitude: number;
    selectLatitude: number;
    coordX: number;
    coordY: number;
    wkid: number;
    centroidOption: boolean;
    es: any;
    private currentUser: Auth;
    minDate: Date;
    maxDate: Date;
    invalidDates: Array<Date>;
    periods: Attribute[];
    deletePeriods: number[];
    colsFlow: any;

    constructor(private authService: AuthGuardService, private service: EsriRequestService, private fb: FormBuilder,
                private spinnerService: Ng4LoadingSpinnerService, public messageService: MessageService,
                private confirmationService: ConfirmationService) {
        this.noDangerOptions = [
            {label: 'Selecciona nivel de peligrosidad', value: null},
            {label: 'Playas libres para el baño', value: 'LIBRE'},
            {label: 'Peligrosa o susceptible de producir daño', value: 'PELIGROSA'},
        ];
        this.wavesOptions = [
            {label: 'Selecciona estado de la mar', value: null},
            {label: 'Mar en calma o cuando las condiciones de las corrientes no pueden afectar a los bañistas', value: 0},
            {label: 'Existen olas de altura de 0.5 metros que pueden afectar a los bañistas', value: 3},
            {label: 'Existen habitualmente olas de altura superior a 1 metro o corrientes fuertes', value: 5}
        ];
        this.accessOptions = [
            {label: 'Selecciona modo de acceso', value: null},
            {label: 'Sin dificultades de acceso', value: 'SDIF'},
            {label: 'Sólo accesible con vehículos todo terreno o a pie', value: 'AVHC'},
            {label: 'Sólo accesible con medios aéreos o marítimos', value: 'AVAM'}
        ];
        this.FlowOptions = [
            {label: 'Alta', value: 'A', icon: 'fa fa-fw fa-level-up'},
            {label: 'Media', value: 'M', icon: 'fa fa-fw fa-arrows-h'},
            {label: 'Baja', value: 'B', icon: 'fa fa-fw fa-level-down'}
        ];
    }

    ngOnInit() {
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
            incidentes_graves: new FormControl('', Validators.compose([Validators.required, Validators.min(0),
                Validators.pattern('^[0-9]+')])),
            incidentes_mgraves: new FormControl('', Validators.compose([Validators.required, Validators.min(0),
                Validators.pattern('^[0-9]+')])),
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
        this.formEnvironment = this.fb.group({
            objectid: new FormControl(''),
            peligrosidad_mar: new FormControl('', Validators.required),
            peligros_anadidos: new FormControl(''),
            cobertura_telefonica: new FormControl('', Validators.required),
            accesos: new FormControl(''),
            observaciones: new FormControl(''),
            id_dgse: new FormControl(''),
            // campos auxiliares o calculados que no pertenecen al modelo
            val_peligrosidad: new FormControl({value: '', disabled: true}),
            on_edit: new FormControl('')
        });
        this.formFlow = this.fb.group({
            objectid: new FormControl(''),
            dates: new FormControl(''),
            flowLevelDefault: new FormControl(''),
            flowLevelWeekend: new FormControl(''),
            id_dgse: new FormControl('')
        });
        this.onChanges();
        // establecemos valores en espanol para el calendario
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
            monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre',
                'diciembre'],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Borrar'
        };
        this.colsFlow = [
            {subfield: 'fecha_inicio', header: 'Inicio', width: '29%', orderBy: 'attributes.fecha_inicio'},
            {subfield: 'fecha_fin', header: 'Fin', width: '29%', orderBy: 'attributes.fecha_fin'},
            {subfield: 'nivel', header: 'Nivel', width: '29%', type: 'text', orderBy: 'attributes.nivel'}
        ];
        this.initCalendarDates();
    }

    // fechas maxima y minima para los calendarios de afluencias y carga lista de periodos
    initCalendarDates() {
        this.periods = [];
        this.deletePeriods = [];
        const today = new Date();
        this.minDate = new Date(today.getFullYear(), 0, 1);
        this.maxDate = new Date(today.getFullYear() + 1, 0, 0);
        this.invalidDates = [];
    }

    loadRelatedRecords() {
        this.service.getEsriRelatedData(environment.infoplayas_catalogo_edicion_url + '/queryRelatedRecords',
            '237', '0', '*', true, this.currentUser.token).subscribe(
            (result: any) => {
                if (result) {
                    // this.selectedBeachDanger = result.relatedRecordGroups[0].relatedRecords[0].attributes;
                    // console.log(this.selectedBeachDanger);
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

    onSubmit(fg: FormGroup, tableId: string) {
        // cambiamos el valor true de los formularios por 1 que tenemos como ese valor en Esri
        const convertEsriBool = new Array();
        convertEsriBool.push(fg.value);
        for (let [key, value] of Object.entries(convertEsriBool[0])) {
            if (value === true || value === -1) {
                convertEsriBool[0][key] = 1;
            }
        }
        const updateObj = new Array();
        updateObj.push({attributes: convertEsriBool[0]});
        const mode = fg.get('on_edit').value ? 'updates' : 'adds';
        const postExecuteTask = fg.contains('desprendimientos') && this.viewNoDanger ? 'no_prohibido' : fg.contains('desprendimientos')
            ? 'prohibido' : 'none';
        this.editRelatedData(updateObj, this.currentUser, mode, environment.infoplayas_catalogo_edicion_tablas_url + '/' + tableId
            + '/applyEdits', postExecuteTask);
    }

    calculateDangerLever() {
        let dangerLevel = this.formIncidents.get('actividades_deportivas').value ? 5 : 0;
        dangerLevel -= this.formIncidents.get('balizamiento').value ? 4 : 0;
        dangerLevel -= this.formIncidents.get('actividades_acotadas').value ? 2 : 0;
        return dangerLevel > 0 ? dangerLevel : 0;
    }

    onChanges(): void {
        // comprueba si se ha seleccionado algun elemento de peligro, que significara que la playa es de USO PROHIBIDO
        this.formDanger.valueChanges.subscribe(val => {
            this.viewNoDanger = true;
            const controlsArr = ['corrientes_mareas', 'rompientes_olas', 'contaminacion', 'fauna_marina', 'desprendimientos'];
            for (const entry of controlsArr) {
                if (this.formDanger.get(entry).value) {
                    this.viewNoDanger = false;
                    break;
                }
            }
        });
        // cambios en validaciones en tiempo de ejecucion
        this.formEnvironment.get('peligros_anadidos').valueChanges.subscribe(value => {
            if (value) {
                this.formEnvironment.get('accesos').setValidators([Validators.required]);
            } else {
                this.formEnvironment.get('accesos').setValidators(null);
            }
            this.formEnvironment.get('accesos').updateValueAndValidity();
        });
    }

    openSecurityMeasures($event: MouseEvent, overlayPanel: OverlayPanel) {
        overlayPanel.toggle(event);
    }

    setUrlInfoMap() {
        return this.centroidOption ? this.urlInfoMap + '&zoom=18&center=' + this.coordX + ',' + this.coordY + ',' + this.wkid :
            this.urlInfoMap + '&zoom=' + this.zoom + '&center=' + this.selectLongitude + ',' + this.selectLatitude;
    }

    private executePostData(prohibido: boolean) {
        const updateObj = new Array();
        updateObj.push({
            attributes: {
                objectid_12: this.selectedId,
                clasificacion: prohibido ? 'USO PROHIBIDO' : 'PENDIENTE'
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
                            t.execRelatedQuery(queryTask, RelationshipQuery, output, 2, t.formEnvironment);
                            t.execRelatedFlowQuery(queryTask, RelationshipQuery, output, 3);
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
                                    t.execRelatedQuery(queryTask, RelationshipQuery, output, 2, t.formEnvironment);
                                    t.execRelatedFlowQuery(queryTask, RelationshipQuery, output, 3);
                                    // guardamos los datos de geometria de la playa para componentes externos
                                    t.coordX = output.coordX;
                                    t.coordY = output.coordY;
                                    t.wkid = output.wkid;
                                    t.centroidOption = true;
                                });
                        } else {
                            t.sendMessage('noid', unselectFeature(), 'PENDIENTE');
                            t.centroidOption = false;
                        }
                    });
                });

                $('#btnSave')[0].onclick = function () {
                    t.sendMessage('noid', submitForm(playasLayer, form, ['nombre_municipio', 'objectid_12'], filterPlayas), 'PENDIENTE');
                };

                $('#js-filters-mosaic-flat')[0].onclick = function (event) {
                    let filter = 'municipio = \'' + aytos[IdentityManager.credentials[0].userId].municipio_minus + '\'';
                    filter = event.target.dataset.filter === '.protection' ? filter +
                        ' AND clasificacion <> \'USO PROHIBIDO\' AND nombre_municipio <> \'\' AND nombre_municipio IS NOT NULL'
                        : event.target.dataset.filter === '.clasification' ? filter + ' AND nombre_municipio <> \'\' AND nombre_municipio IS NOT NULL'
                            : event.target.dataset.filter === '.result' ? filter + ' AND clasificacion IS NOT NULL AND clasificacion <> \'PENDIENTE\' AND nombre_municipio <> \'\' AND nombre_municipio IS NOT NULL'
                                : filter;
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

    // cargamos el formulario de afluencia relacion 1-M
    private execRelatedFlowQuery(queryTask, RelationshipQuery, output, relationshipId) {
        // borramos las fechas auxiliares en la afluencia
        this.initCalendarDates();
        const query = new RelationshipQuery();
        query.returnGeometry = false;
        query.outFields = ['*'];
        query.relationshipId = relationshipId;
        query.objectIds = [output.beachId];
        queryTask.executeRelationshipQuery(query).then((results: any) => {
            this.formFlow.reset();
            if (Object.entries(results).length === 0 && results.constructor === Object) {
                this.formFlow.patchValue({id_dgse: output.id_dgse});
            } else {
                this.formFlow.patchValue({id_dgse: output.id_dgse});
                this.periods = results[query.objectIds[0]].features;
                this.periods.forEach(value => {
                    value.attributes.fecha_fin = new Date(value.attributes.fecha_fin);
                    value.attributes.fecha_inicio = new Date(value.attributes.fecha_inicio);
                });
                // ponemos el periodo en las fechas invalidas del calendario para evitar ser seleccionadas denuevo
                this.iterateInvalidDates();
            }
        });
    }

    private editRelatedData(updateObj, currentUser, mode, endpoint, postExecute) {
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
                this.sendMessage('noid', unselectFeature(), 'PENDIENTE');
            }
        });
    }

    private removeRelatedData(objectIds, currentUser, endpoint, unselect) {
        this.service.deleteEsriData(endpoint, currentUser.token, objectIds).subscribe(
            (result: any) => {
                if (result) {
                    console.log(result);
                }
            },
            error => {
                console.log(error.toString());
            }).add(() => {
            console.log('end of request');
            if (unselect) {
                this.sendMessage('noid', unselectFeature(), 'PENDIENTE');
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
            this.sendMessage('noid', unselectFeature(), 'PENDIENTE');
        });
    }

    addPeriod() {
        // comprobamos que no se solapa el periodo introducido con alguno anterior
        const tableA = [...this.periods];
        if (this.multipleDateRangeOverlaps(tableA) && this.formFlow.get('dates').value[1]) {
            this.formFlow.get('flowLevelWeekend').setValue(null);
            this.messageService.add({
                severity: 'error',
                summary: 'NO se ha guardado el período',
                detail: 'No puede introducir un período que solape otro anterior'
            });
            return false;
        }
        // incluimos los periodos en la lista
        const datesIncludeType = this.formFlow.get('flowLevelWeekend').value && this.formFlow.get('dates').value[1] &&
        this.formFlow.get('flowLevelWeekend').value !== this.formFlow.get('flowLevelDefault').value ? ['LB', 'FS'] : ['TD'];
        datesIncludeType.forEach(value => {
            this.periods.push({
                attributes: {
                    id_dgse: this.formFlow.get('id_dgse').value,
                    fecha_inicio: this.formFlow.get('dates').value[0],
                    fecha_fin: this.formFlow.get('dates').value[1] ? this.formFlow.get('dates').value[1] : this.formFlow.get('dates').value[0],
                    nivel: value === 'FS' ? this.formFlow.get('flowLevelWeekend').value : this.formFlow.get('flowLevelDefault').value,
                    incluir_dias: value
                }
            });
        });
        // ponemos el periodo en las fechas invalidas del calendario para evitar ser seleccionadas denuevo
        const iniDate = new Date(this.formFlow.get('dates').value[0]);
        if (this.formFlow.get('dates').value[1]) {
            const lastDate = new Date(this.formFlow.get('dates').value[1]);
            const days = (lastDate.getTime() - iniDate.getTime()) / (1000 * 3600 * 24);
            for (let i = 0; i < days + 1; i++) {
                const nextDay = new Date(iniDate);
                nextDay.setDate(iniDate.getDate() + i);
                if (nextDay > lastDate) {
                    break;
                }
                this.invalidDates.push(nextDay);
            }
            lastDate.setDate(lastDate.getDate() + 1);
            this.formFlow.get('dates').setValue(lastDate);
        } else {
            this.invalidDates.push(iniDate);
            this.formFlow.get('dates').setValue(iniDate);
        }
        this.formFlow.get('flowLevelWeekend').setValue(null);
    }

    multipleDateRangeOverlaps(arr: Attribute[]): boolean {
        for (let i = 0; i < arr.length; i ++) {
                if (
                    this.dateRangeOverlaps(
                        this.formFlow.get('dates').value[0], this.formFlow.get('dates').value[1],
                        arr[i].attributes.fecha_inicio, arr[i].attributes.fecha_fin
                    )
                ) {
                    return true;
                }
        }
        return false;
    }

    dateRangeOverlaps(a_start, a_end, b_start, b_end): boolean {
        if (a_start <= b_start && b_start <= a_end) {
            return true;
        } // b starts in a
        if (a_start <= b_end && b_end <= a_end) {
            return true;
        } // b ends in a
        if (b_start < a_start && a_end < b_end) {
            return true;
        } // a in b
        return false;
    }

    days_of_a_year(year) {
        return this.isLeapYear(year) ? 366 : 365;
    }

    isLeapYear(year) {
        return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    }

    onSubmitFlows() {
        // chequeamos y advertimos al usuario si hay alguna fecha del año en curso por rellenar.
        if (this.invalidDates.length < this.days_of_a_year(new Date().getFullYear())) {
            this.confirmNotEnoughDays();
        } else {
            this.savePeriodsOndb();
        }
    }

    savePeriodsOndb() {
        // casteamos la fecha a formato valido de bbdd postgre
        this.periods = [...this.periods.filter(s => !s.attributes.objectid)];
        const addvalues = JSON.parse(JSON.stringify(this.periods));
        addvalues.forEach(value => {
            value.attributes.fecha_fin = this.toDateFormat(value.attributes.fecha_fin);
            value.attributes.fecha_inicio = this.toDateFormat(value.attributes.fecha_inicio);
        });
        let unselect = true;
        if (this.periods.length > 0) {
            this.editRelatedData(addvalues, this.currentUser, 'adds', environment.infoplayas_catalogo_edicion_tablas_url + '/' + 4
                + '/applyEdits', 'none');
            unselect = false;
        }
        // borramos los periodos si los hay
        if (this.deletePeriods.length > 0) {
            this.removeRelatedData(this.deletePeriods, this.currentUser, environment.infoplayas_catalogo_edicion_tablas_url + '/' + 4
                + '/deleteFeatures', unselect);
        }
    }

    confirmNotEnoughDays () {
        this.confirmationService.confirm({
            message: '¿Está segur@ que quiere guardar los períodos?',
            header: 'Año en curo INCOMPLETO',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'No se completa el período anual',
                    detail: 'Tenga en cuenta que el dimensionamiento de seguridad no reflejará todo el año en curso.'
                });
                this.savePeriodsOndb();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'No se han guardado los períodos',
                    detail: 'Complete todo el año en curso y vuelva a guardar.'
                });
            }
        });
    }

    onRowDelete(rowData) {
        // eliminamos la pareja del registro si es uno de fin de semana o laborable, sino borramos solo el registro seleccionado
        if (rowData.attributes.incluir_dias !== 'TD') {
            const tableA = [...this.periods];
            const pairIndex = tableA[tableA.indexOf(rowData) + 1] &&
            tableA[tableA.indexOf(rowData) + 1].attributes.fecha_inicio === rowData.attributes.fecha_inicio ?
                tableA.indexOf(rowData) + 1 : tableA.indexOf(rowData) - 1;
            this.deletePeriods.push(this.periods[pairIndex].attributes.objectid);
            this.periods = tableA.filter(s => tableA.indexOf(s) !== pairIndex);
        }
        const tableB = [...this.periods];
        this.periods = tableB.filter(s => s !== rowData);
        this.deletePeriods.push(rowData.attributes.objectid);
        // eliminamos los dias de los periodos en invalidDates
        const tableC = [...this.invalidDates];
        const iniDate = rowData.attributes.fecha_inicio;
        if (rowData.attributes.fecha_fin) {
            const lastDate = rowData.attributes.fecha_fin;
            const days = (lastDate.getTime() - iniDate.getTime()) / (1000 * 3600 * 24);
            const index = tableC.indexOf(tableC.find(x => x.getTime() === iniDate.getTime()));
            tableC.splice(index, days + 1);
            this.invalidDates = tableC;
        } else {
            const index = tableC.indexOf(tableC.find(x => x === iniDate));
            tableC.splice(index, 1);
            this.invalidDates = tableC;
        }
    }

    toDateFormat(dateStr: string): string {
        const date = new Date(dateStr);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return yyyy + '-' + mm + '-' + dd;
    }

    private iterateInvalidDates() {
        // ponemos el periodo en las fechas invalidas del calendario para evitar ser seleccionadas denuevo
        const table = [...this.periods].filter(s => s.attributes.incluir_dias !== 'FS');
        table.forEach(value => {
            const iniDate = value.attributes.fecha_inicio;
            if (value.attributes.fecha_fin) {
                const lastDate = value.attributes.fecha_fin;
                const days = (lastDate.getTime() - iniDate.getTime()) / (1000 * 3600 * 24);
                for (let i = 0; i < days + 1; i++) {
                    const nextDay = new Date(iniDate);
                    nextDay.setDate(iniDate.getDate() + i);
                    if (nextDay > lastDate) {
                        break;
                    }
                    this.invalidDates.push(nextDay);
                }
            } else {
                this.invalidDates.push(iniDate);
            }
        });
    }
}
