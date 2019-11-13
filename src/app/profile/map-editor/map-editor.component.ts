import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Auth} from '../../models/auth';
import {loadModules} from 'esri-loader';
import {EsriRequestService} from '../../services/esri-request.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {MessageService, SelectItem} from 'primeng/api';
import {OverlayPanel} from 'primeng/primeng';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {Attribute} from '../../models/attribute';
import * as moment from 'moment';
import Swal from 'sweetalert2';

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
    @Output() lastChangeTracking = new EventEmitter<Date>();
    @Input() mapHeight: string;
    @Input() zoom: number;
    @Input() selectForm: string;
    @Input() urlInfoMap: string;
    formDanger: FormGroup;
    formIncidents: FormGroup;
    formEnvironment: FormGroup;
    formFlow: FormGroup;
    formEvaluation: FormGroup;
    noDangerOptions: SelectItem[];
    wavesOptions: SelectItem[];
    accessOptions: SelectItem[];
    FlowOptions: SelectItem[];
    additionalDangersOptions: SelectItem[];
    viewNoDanger: boolean;
    selectedId: string;
    selectLongitude: number;
    selectLatitude: number;
    coordX: number;
    coordY: number;
    wkid: number;
    centroidOption: boolean;
    es: any;
    minDate: Date;
    maxDate: Date;
    invalidDates: Array<Date>;
    periods: Attribute[];
    deleteAddtionalDangers: number[];
    colsFlow: any;
    dateNow: Date;
    private currentUser: Auth;

    constructor(private authService: AuthGuardService, private service: EsriRequestService, private fb: FormBuilder,
                private spinnerService: Ng4LoadingSpinnerService, public messageService: MessageService) {
        this.noDangerOptions = [
            {label: 'Selecciona nivel de peligrosidad', value: null},
            {label: 'Peligrosa o susceptible de producir daño', value: 'PELIGROSA'},
            {label: 'Playa libre para el baño', value: 'LIBRE'}
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
        this.additionalDangersOptions = [
            {label: 'Selecciona el tipo de peligro', value: null},
            {label: 'Desniveles bruscos y taludes, tanto en la zona de la playa como en su acceso al agua', value: 'DES'},
            {label: 'Riesgo de accidentes por desprendimiento de rocas', value: 'ROC'},
            {label: 'La abundancia de maleza que pudieran provocar caída de ramas o lesiones por transitar', value: 'MAL'},
            {label: 'Los derivados de su situación en áreas inundables o susceptibles de riadas', value: 'INUND'},
            {label: 'Por el tipo de terreno, grandes rocas o bolos, solárium en rocas innacesibles en pleamar, etc.', value: 'TERR'},
            {
                label: 'Riesgos derivados de vertidos, fugas o accidentes, susceptibles de producir contaminación química o biológica',
                value: 'VERT'
            }
        ];
        this.FlowOptions = [
            {label: 'Alta', value: 'A', icon: 'fa fa-fw fa-level-up'},
            {label: 'Media', value: 'M', icon: 'fa fa-fw fa-arrows-h'},
            {label: 'Baja', value: 'B', icon: 'fa fa-fw fa-level-down'}
        ];
    }

    get fEnv() {
        return this.formEnvironment.controls;
    }

    get tEnv() {
        return this.fEnv.dangers as FormArray;
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
            id_dgse: new FormControl(''),
            // campos auxiliares o calculados que no pertenecen al modelo
            val_peligrosidad: new FormControl({value: '', disabled: true}),
            on_edit: new FormControl('')
        });
        this.formEnvironment = this.fb.group({
            objectid: new FormControl(''),
            peligrosidad_mar: new FormControl('', Validators.required),
            peligros_anadidos: new FormControl(''),
            dangers: new FormArray([]),
            cobertura_telefonica: new FormControl('', Validators.required),
            accesos: new FormControl('', Validators.required),
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
        this.formEvaluation = this.fb.group({
            objectid: new FormControl(''),
            dangerLevel: new FormControl('', Validators.required)
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

    onChangeAdditionalDangers(e) {
        const numberOfDangers = e.target.value || 0;
        if (this.tEnv.length < numberOfDangers) {
            for (let i = this.tEnv.length; i < numberOfDangers; i++) {
                this.tEnv.push(this.fb.group({
                    objectid: [''],
                    riesgo: ['', Validators.required],
                    id_dgse: [''],
                    ultimo_editor: [''],
                    ultimo_cambio: ['']
                }));
            }
        } else {
            for (let i = this.tEnv.length; i >= numberOfDangers; i--) {
                if (this.tEnv.value[i]) {
                    this.deleteAddtionalDangers.push(this.tEnv.value[i].objectid);
                }
                this.tEnv.removeAt(i);
            }
        }
    }

    onInitAdditionalDangers(data) {
        this.deleteAddtionalDangers = [];
        data.forEach(value => {
            this.tEnv.push(this.fb.group({
                objectid: [value.attributes.objectid],
                riesgo: [value.attributes.riesgo, Validators.required],
                id_dgse: [value.attributes.id_dgse],
                ultimo_editor: [''],
                ultimo_cambio: ['']
            }));
        });
        this.formEnvironment.get('peligros_anadidos').setValue(data.length);
    }

    // fechas maxima y minima para los calendarios de afluencias y carga lista de periodos
    initCalendarDates() {
        this.dateNow = new Date();
        this.periods = [];
        const today = new Date();
        this.minDate = new Date(today.getFullYear(), 0, 1);
        this.maxDate = new Date(today.getFullYear() + 1, 0, 0);
        this.invalidDates = [];
    }

    sendMessage(id: string, name: string, clasification: string, lastChange: Date) {
        this.beachId.emit(id);
        this.localName.emit(name);
        this.clasification.emit(clasification);
        this.lastChangeTracking.emit(lastChange);
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
        // cambiamos el on_edit a true para que el calculo de progreso getCompleteState del formulario incluya el actual que se modifica.
        fg.get('on_edit').setValue(true);
        const postExecuteTask = fg.contains('desprendimientos') && this.viewNoDanger ? 'no_prohibido' : fg.contains('desprendimientos')
            ? 'prohibido' : fg.contains('peligros_anadidos') ? 'update_dangers' : 'none';
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
    }

    openSecurityMeasures($event: MouseEvent, overlayPanel: OverlayPanel) {
        overlayPanel.toggle(event);
    }

    setUrlInfoMap() {
        return this.centroidOption ? this.urlInfoMap + '&zoom=18&center=' + this.coordX + ',' + this.coordY + ',' + this.wkid :
            this.urlInfoMap + '&zoom=' + this.zoom + '&center=' + this.selectLongitude + ',' + this.selectLatitude;
    }

    loadRelatedAdditionalDangers(parentId: string) {
        this.service.getEsriRelatedData(environment.infoplayas_catalogo_edicion_url + '/queryRelatedRecords',
            parentId, '9', '*', true, this.currentUser.token).subscribe(
            (result: any) => {
                if (result.relatedRecordGroups.length > 0) {
                    this.onInitAdditionalDangers(result.relatedRecordGroups[0].relatedRecords);
                } else {
                    this.formEnvironment.get('peligros_anadidos').setValue(0);
                }
            },
            error => {
                console.log(error.toString());
            }).add(() => {
            console.log('end of request');
        });
    }

    addPeriod() {
        // comprobamos que no se solapa el periodo introducido con alguno anterior
        const tableA = [...this.periods];
        if (this.multipleDateRangeOverlaps(tableA) && this.formFlow.get('dates').value[1]) {
            this.formFlow.get('flowLevelWeekend').setValue(null);
            Swal.fire({
                type: 'error',
                title: 'NO se ha guardado el período',
                text: 'No puede introducir un período que solape otro anterior.',
                footer: ''
            });

            return false;
        }
        // incluimos los periodos en la lista
        const datesIncludeType = this.formFlow.get('flowLevelWeekend').value && this.formFlow.get('dates').value[1] &&
        this.formFlow.get('flowLevelWeekend').value !== this.formFlow.get('flowLevelDefault').value ? ['LB', 'FS'] : ['TD'];
        datesIncludeType.forEach(value => {
            const count = this.periods.push({
                attributes: {
                    id_dgse: this.formFlow.get('id_dgse').value,
                    fecha_inicio: this.formFlow.get('dates').value[0],
                    fecha_fin: this.formFlow.get('dates').value[1] ? this.formFlow.get('dates').value[1] : this.formFlow.get('dates').value[0],
                    nivel: value === 'FS' ? this.formFlow.get('flowLevelWeekend').value : this.formFlow.get('flowLevelDefault').value,
                    incluir_dias: value
                }
            });
            // actualizamos en bbdd
            const addvalues = JSON.parse(JSON.stringify(this.periods[count - 1]));
            addvalues.attributes.fecha_fin = moment(addvalues.attributes.fecha_fin).format('YYYY-MM-DD');
            addvalues.attributes.fecha_inicio = moment(addvalues.attributes.fecha_inicio).format('YYYY-MM-DD');
            this.editRelatedData([addvalues], this.currentUser, 'adds', environment.infoplayas_catalogo_edicion_tablas_url + '/' + 4
                + '/applyEdits', 'message');
        });
        // actualizamos el periodo en las fechas invalidas del calendario para evitar ser seleccionadas denuevo
        this.invalidDates = [];
        this.loadInvalidDates();
        // seteamos los valores del calendario para que apareca al abrirlo en la ultima fecha
        const iniDate = new Date(this.formFlow.get('dates').value[0]);
        if (this.formFlow.get('dates').value[1]) {
            const lastDate = new Date(this.formFlow.get('dates').value[1]);
            lastDate.setDate(lastDate.getDate() + 1);
            this.formFlow.get('dates').setValue(lastDate);
        } else {
            this.formFlow.get('dates').setValue(iniDate);
        }
        this.formFlow.get('flowLevelWeekend').setValue(null);
    }

    multipleDateRangeOverlaps(arr: Attribute[]): boolean {
        for (let i = 0; i < arr.length; i++) {
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

    days_of_this_year() {
        return this.isLeapYear(new Date().getFullYear()) ? 366 : 365;
    }

    isLeapYear(year) {
        return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    }

    onRowDelete(rowData) {
        // eliminamos la pareja del registro si es uno de fin de semana o laborable, sino borramos solo el registro seleccionado
        const tableA = [...this.periods];
        let tableB = [...this.periods];
        this.periods = tableA.filter(s => s.attributes.fecha_inicio.getTime() !== rowData.attributes.fecha_inicio.getTime());
        tableB = tableB.filter(s => s.attributes.fecha_inicio.getTime() === rowData.attributes.fecha_inicio.getTime());
        // borramos los periodos de la bbdd si los hay
        if (tableB.length > 0) {
            this.removeRelatedData(tableB.map(a => a.attributes.objectid), this.currentUser, environment.infoplayas_catalogo_edicion_tablas_url + '/' + 4
                + '/deleteFeatures', true);
        }
        // actualizamos los dias ya seleccionados en el calendario
        this.invalidDates = [];
        this.loadInvalidDates();
    }

    onSubmitEvaluation() {
        this.updateClasification(this.formEvaluation.get('dangerLevel').value, true);
    }

    getCompleteState(): number {
        let percentage = 0;
        percentage += this.formIncidents.get('on_edit').value ? 30 : 0;
        percentage += this.formEnvironment.get('on_edit').value ? 30 : 0;
        percentage += this.periods.length > 0 ? 30 : 0;
        percentage += this.formEvaluation.valid ? 10 : 0;
        return percentage;
    }

    private updateClasification(clasification: string, updateTime: boolean) {
        const updateObj = new Array();
        updateObj.push({
            attributes: {
                objectid_12: this.selectedId,
                clasificacion: clasification,
                ultimo_cambio: updateTime ? moment().format('YYYY-MM-DD HH:mm:ss') : null,
                ultimo_editor: updateTime ? this.currentUser.username : null
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
                    server: environment.urlPortalRest,
                    ssl: true,
                    token: this.currentUser.token,
                    userId: this.currentUser.username
                });
                // then we load a web map from an id
                const webmap = new WebMap({
                    portalItem: {
                        id: environment.idportalForms
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
                            t.sendMessage(output.beachId, output.localName, output.clasificacion, output.ultimo_cambio);
                            t.selectedId = output.beachId;
                            t.formEvaluation.reset();
                            if (output.clasificacion !== 'PENDIENTE') {
                                t.formEvaluation.get('dangerLevel').setValue(output.clasificacion);
                            }
                            // consultas datos relacionados: relacionar formulario con el identificador de relacion de la tabla
                            t.execRelatedQuery(queryTask, RelationshipQuery, output, 0, t.formDanger);
                            t.execRelatedQuery(queryTask, RelationshipQuery, output, 1, t.formIncidents);
                            t.execRelatedEnvironmentQuery(queryTask, RelationshipQuery, output, 2);
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
                                    t.sendMessage(output.beachId, output.localName, output.clasificacion, output.ultimo_cambio);
                                    t.selectedId = output.beachId;
                                    t.formEvaluation.reset();
                                    if (output.clasificacion !== 'PENDIENTE') {
                                        t.formEvaluation.get('dangerLevel').setValue(output.clasificacion);
                                    }
                                    // consultas datos relacionados: relacionar formulario con el identificador de relacion de la tabla
                                    t.execRelatedQuery(queryTask, RelationshipQuery, output, 0, t.formDanger);
                                    t.execRelatedQuery(queryTask, RelationshipQuery, output, 1, t.formIncidents);
                                    t.execRelatedEnvironmentQuery(queryTask, RelationshipQuery, output, 2);
                                    t.execRelatedFlowQuery(queryTask, RelationshipQuery, output, 3);
                                    // guardamos los datos de geometria de la playa para componentes externos
                                    t.coordX = output.coordX;
                                    t.coordY = output.coordY;
                                    t.wkid = output.wkid;
                                    t.centroidOption = true;
                                });
                        } else {
                            t.sendMessage('noid', unselectFeature(), 'PENDIENTE', new Date());
                            t.centroidOption = false;
                        }
                    });
                });

                $('#btnSave')[0].onclick = function () {
                    if (submitForm(playasLayer, form, ['nombre_municipio', 'objectid_12'], filterPlayas)) {
                        Swal.fire({
                            type: 'success',
                            title: 'Éxito',
                            text: 'La actualización ha sido correcta.',
                            footer: ''
                        });
                    } else {
                        Swal.fire({
                            type: 'error',
                            title: 'Error',
                            text: 'No se ha guardado el cambio.',
                            footer: ''
                        });
                    }
                };

                // aplicamos distintos filtros al mapa en funcion de lo que se quiera mostrar en cada apartado
                $('#js-filters-mosaic-flat')[0].onclick = function (event) {
                    let filter = 'municipio = \'' + aytos[IdentityManager.credentials[0].userId].municipio_minus + '\'';
                    const cadMunicipioSinNombre = ' AND nombre_municipio <> \'\' AND nombre_municipio IS NOT NULL';
                    filter = event.target.dataset.filter === '.protection' ? filter +
                        ' AND clasificacion <> \'USO PROHIBIDO\'' + cadMunicipioSinNombre
                        : event.target.dataset.filter === '.clasification' ? filter + cadMunicipioSinNombre
                            : event.target.dataset.filter === '.result' ? filter
                                + ' AND ultimo_cambio IS NOT NULL AND clasificacion IS NOT NULL AND clasificacion <> \'PENDIENTE\''
                                + cadMunicipioSinNombre + ' OR (clasificacion = \'USO PROHIBIDO\'' + cadMunicipioSinNombre + ' AND ' + filter + ')'
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

    // cargamo el formulario de la tabla relacionada para el formulario formEnvironment
    private execRelatedEnvironmentQuery(queryTask, RelationshipQuery, output, relationshipId) {
        const query = new RelationshipQuery();
        query.returnGeometry = false;
        query.outFields = ['*'];
        query.relationshipId = relationshipId;
        query.objectIds = [output.beachId];
        queryTask.executeRelationshipQuery(query).then((results: any) => {
            this.formEnvironment.reset();
            this.tEnv.controls = [];
            if (Object.entries(results).length === 0 && results.constructor === Object) {
                this.formEnvironment.patchValue({id_dgse: output.id_dgse});
                this.formEnvironment.patchValue({on_edit: false});
                this.formEnvironment.get('peligros_anadidos').setValue(0);
            } else {
                this.loadRelatedAdditionalDangers(output.beachId);
                this.formEnvironment.patchValue(results[query.objectIds[0]].features[0].attributes);
                this.formEnvironment.patchValue({on_edit: true});
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
                // voy a la ultima fecha del calendario en los periodos introducidos
                const lastDate = new Date(this.periods[this.periods.length - 1].attributes.fecha_fin);
                lastDate.setDate(lastDate.getDate() + 1);
                this.formFlow.get('dates').setValue(lastDate);

                this.periods.sort((a, b) => (a.attributes.fecha_inicio > b.attributes.fecha_inicio) ? 1 : -1);
                this.periods.forEach(value => {
                    value.attributes.fecha_fin = new Date(value.attributes.fecha_fin);
                    value.attributes.fecha_inicio = new Date(value.attributes.fecha_inicio);
                });
                this.loadInvalidDates();
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
                            this.updateClasification('PENDIENTE', false);
                            break;
                        case 'prohibido':
                            this.updateClasification('PROHIBIDO', true);
                            break;
                        case 'update_dangers':
                            this.updateAdditionalDangers();
                            break;
                        case 'message':
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Se ha guardado el período introducido',
                                detail: 'La base de datos se ha actualizado, continúe con el resto del año en curso.'
                            });
                            break;
                        case 'none':
                            Swal.fire({
                                type: 'success',
                                title: 'Éxito',
                                text: 'La actualización ha sido correcta.',
                                footer: ''
                            });
                            break;
                    }
                }
            },
            error => {
                console.log(error.toString());
            });
    }

    private removeRelatedData(objectIds, currentUser, endpoint, message: boolean) {
        this.service.deleteEsriData(endpoint, currentUser.token, objectIds).subscribe(
            (result: any) => {
                if (result && message) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Eliminado el período indicado',
                        detail: 'La base de datos se ha actualizado, continúe con el resto del año en curso.'
                    });
                }
            },
            error => {
                console.log(error.toString());
            }).add(() => {
            console.log('end of request');
        });
    }

    private editDataLayer(updateObj, currentUser, mode, endpoint) {
        this.service.updateEsriData(endpoint,
            updateObj, mode, currentUser.token).subscribe(
            (result: any) => {
                if (result) {
                    Swal.fire({
                        type: 'success',
                        title: 'Éxito',
                        text: 'La actualización ha sido correcta.',
                        footer: ''
                    });
                }
            },
            error => {
                console.log(error.toString());
            }).add(() => {
            console.log('end of request');
        });
    }

    // ponemos el periodo en las fechas invalidas del calendario para evitar ser seleccionadas denuevo
    private loadInvalidDates() {
        const table = [...this.periods].filter(s => s.attributes.incluir_dias !== 'FS');
        table.forEach(value => {
            const currDate = moment(value.attributes.fecha_inicio).startOf('day');
            if (value.attributes.fecha_fin) {
                const lastDate = moment(value.attributes.fecha_fin).startOf('day').add(1, 'days');
                for (const day = moment(currDate); day.isBefore(lastDate); day.add(1, 'days')) {
                    this.invalidDates.push(moment(day).toDate());
                }
            } else {
                this.invalidDates.push(currDate.clone().toDate());
            }
        });
    }

    private updateAdditionalDangers() {
        // borramos los registros que han sido eliminados por el usuario
        if (this.deleteAddtionalDangers.length > 0) {
            this.removeRelatedData(this.deleteAddtionalDangers, this.currentUser, environment.infoplayas_catalogo_edicion_tablas_url + '/' + 11
                + '/deleteFeatures', false);
        }
        const addvalues = [...this.tEnv.value].filter(s => !s.objectid).map(value => {
            return {attributes: value};
        });
        const updatesvalues = [...this.tEnv.value].filter(s => s.objectid).map(value => {
            return {attributes: value};
        });
        updatesvalues.forEach(value => {
            value.attributes.ultimo_cambio = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
            value.attributes.ultimo_editor = this.currentUser.username;
        });
        if (updatesvalues.length > 0) {
            this.editRelatedData(updatesvalues, this.currentUser, 'updates', environment.infoplayas_catalogo_edicion_tablas_url + '/' + 11
                + '/applyEdits', 'none');
        }
        addvalues.forEach(value => {
            value.attributes.id_dgse = this.formEnvironment.get('id_dgse').value;
            value.attributes.ultimo_cambio = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
            value.attributes.ultimo_editor = this.currentUser.username;
        });
        if (addvalues.length > 0) {
            this.editRelatedData(addvalues, this.currentUser, 'adds', environment.infoplayas_catalogo_edicion_tablas_url + '/' + 11
                + '/applyEdits', 'none');
        }
    }
}
