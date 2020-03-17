import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {DialogService, MenuItem} from 'primeng/api';
import {Municipality} from '../../models/municipality';
import {GradesProtectionService} from '../../services/grades-protection.service';
import {AuthGuardService} from '../../services/auth-guard.service';
import {EsriRequestService} from '../../services/esri-request.service';
import {environment} from '../../../environments/environment';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {PopulationService} from '../../services/population.service';
import {AppSettingsService} from '../../services/app-settings.service';
import {AppSetting} from '../../models/app-setting';
import * as moment from 'moment';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {FormStateService} from '../../services/form-state.service';
import {MapViewerComponent} from '../map-viewer/map-viewer.component';

declare var Swiper: any;
declare var $: any;
declare var jquery: any;

declare function init_plugins();

@Component({
    selector: 'app-classification',
    templateUrl: './classification.component.html',
    styleUrls: ['./classification.component.css']
})
export class ClassificationComponent implements OnInit, AfterViewInit, OnDestroy {
    itemsProtection: MenuItem[];
    beachObjectId: number;
    numberOfBeachs: number;
    mapZoomLevel: number;
    mapHeightContainer: string;
    listOfLayersProtection: string[];
    selectedLayerProtection: number;
    actualForm = 'inventario';
    localName: string;
    localClasification: string;
    cargaPoblacional: number;
    municipio: Municipality;
    DangerPopulationLevel: number;
    aytos: AppSetting[];
    colsGrade: any;
    visible: string;
    formVacational: FormGroup;
    vacacional: boolean;
    fillState: number;
    percentage: number;
    display;
    private subscripcionMunicipality;
    private subscripcionFormState;
    isUserEditor: boolean;

    constructor(private gradeService: GradesProtectionService, public authService: AuthGuardService, private service: EsriRequestService,
                private fb: FormBuilder, private popService: PopulationService, private appSettingsService: AppSettingsService,
                private spinnerService: Ng4LoadingSpinnerService, private formStateService: FormStateService,
                public dialogService: DialogService) {
    }

    ngAfterViewInit() {
        this.initSwiper();
        this.initCubPortfolio();
    }

    ngOnInit() {
        this.isUserEditor = environment.roles.find(i => i.id === this.authService.getCurrentUser().roleId).plan_edit;
        init_plugins();
        this.readFormsState();
        $('#resultsFilterMenu').show();
        this.listOfLayersProtection = ['afluencia', 'entorno', 'incidencias', 'valoracion'];
        this.itemsProtection = [
            {label: 'Afluencia', icon: 'fa fa-fw fa-street-view'},
            {label: 'Entorno', icon: 'fa fa-fw fa-thermometer'},
            {label: 'Incidencias & Usos', icon: 'fa fa-fw fa-medkit'},
            {label: 'Valoración final', icon: 'fa fa-fw fa-calculator '}
        ];
        this.mapHeightContainer = '78vh';
        this.mapZoomLevel = 12;
        this.localClasification = null;
        this.colsGrade = [
            {field: 'fecha_inicio', header: 'Inicio', width: '20%', orderBy: 'fecha_inicio'},
            {field: 'fecha_fin', header: 'Fin', width: '20%', orderBy: 'fecha_fin'},
            {field: 'afluencia', header: 'Afluencia', width: '20%', type: 'text', orderBy: 'afluencia'},
            {field: 'grado', header: 'Grado', width: '20%', type: 'text', orderBy: 'grado'},
            {field: 'grado_valor', header: 'Nivel', width: '20%', type: 'text', orderBy: 'grado_valor'}
        ];
        this.formVacational = this.fb.group({
            objectid: new FormControl(''),
            plazas_vacacional: new FormControl('', Validators.required),
            ocupacion_vacacional: new FormControl('',Validators.compose([Validators.required, Validators.min(0), Validators.max(100),
                Validators.pattern('^[0-9]+')])),
            id_ayuntamiento: new FormControl(''),
            on_edit: new FormControl(''),
            editor: new FormControl('', Validators.requiredTrue)
        });
        this.setPopulationByMuncipality(this.popService.getMunicipality());
        // cargamos los ids de las playas para usarlo posteriormente al mostrar los resultados
        this.appSettingsService.getJSON().subscribe(data => {
            this.aytos = data;
            this.readSmunicipality();
        });
    }

    ngOnDestroy() {
        this.subscripcionMunicipality.unsubscribe();
        this.subscripcionFormState.unsubscribe();
    }

    initCubPortfolio() {
        $('#js-grid-mosaic-flat').cubeportfolio({
            filters: '#js-filters-mosaic-flat',
            layoutMode: 'mosaic',
            defaultFilter: 'none',
            animationType: 'fadeOutTop',
            gapHorizontal: 0,
            gapVertical: 0,
            gridAdjustment: 'responsive',
            caption: 'zoom',
            displayType: 'fadeIn',
            displayTypeSpeed: 100,
            sortByDimension: true,
            mediaQueries: [{
                width: 1500,
                cols: 1
            }, {
                width: 1100,
                cols: 1
            }, {
                width: 768,
                cols: 1
            }, {
                width: 480,
                cols: 2
            }, {
                width: 320,
                cols: 2
            }],

            // lightbox
            lightboxDelegate: '.cbp-lightbox',
            lightboxGallery: true,
            lightboxTitleSrc: 'data-title',
            lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',

            plugins: {
                loadMore: {
                    element: '#js-loadMore-mosaic-flat',
                    action: 'click',
                    loadItems: 3
                }
            }
        });
    }

    initSwiper() {
        const swiperThreeSlides = new Swiper('.swiper-three-slides', {
            centeredSlides: true,
            allowTouchMove: true,
            slidesPerView: 3,
            preventClicks: false,
            loop: true,
            pagination: {
                el: '.swiper-pagination-bullets',
                clickable: true
            },
        });
    }

    setPopulationByMuncipality(mun: Municipality) {
        if (!mun) {
            Swal.fire({
                type: 'error',
                title: 'NO se ha podido contactar con el ISTAC',
                text: 'Los cálculos no serán correctos, trate de recargar la página, si persiste inténtelo más tarde.',
                footer: ''
            });
        } else {
            this.loadVacational(mun);
        }
    }

    loadAllData() {
        const current_user = this.authService.getCurrentUser();
        const name = current_user.filter ? current_user.filter : this.popService.getMunicipality().user;
        const filtermunicipio = 'municipio = \'' + this.aytos.find(i => i.ayto === name).municipio_minus + '\'';
        this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_url + '/query', filtermunicipio,
            'objectid, clasificacion', false, this.authService.getCurrentUser().token, 'objectid', true).subscribe(
            (result: any) => {
                if (result) {
                    if (result.features.length > 0) {
                        this.service.getMultipleRelatedData(result.features, [environment.relAfluencia, environment.relEntorno,
                            environment.relIncidencias], current_user.token);
                    }
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

    readSmunicipality() {
        this.subscripcionMunicipality = this.popService.sMunicipality$.subscribe(
            (result: Municipality) => {
                if (result.user) {
                    // actualizar las variables para el nuevo municipio y resetear el formulario vacacional
                    this.resetForm();
                    this.setPopulationByMuncipality(result);
                }
            },
            error => {
                console.log(error.toString());
            });
    }

    receiveBeachId($event: number) {
        if ($event === 0) {
            $('#resultsFilterMenu').show();
        }
        this.beachObjectId = $event;
    }

    receiveNzones($event: number) {
        this.numberOfBeachs = $event;
    }

    receiveLocalName($event: string) {
        this.localName = $event;
        if ($event.toUpperCase() === 'NOMBRE POR DEFINIR') {
            $('#clasificationFilterMenu').hide();
        } else {
            $('#clasificationFilterMenu').show();
        }
    }

    receiveClasification($event: string) {
        this.localClasification = $event;
        if ($event === 'UP' || this.localName.toUpperCase() === 'NOMBRE POR DEFINIR') {
            $('#protectionFilterMenu').hide();
        } else {
            $('#protectionFilterMenu').show();
        }
    }

    selectFormProtection(item, i) {
        this.actualForm = this.listOfLayersProtection[i];
        this.selectedLayerProtection = i;
    }

    setForm(opFilter: string) {
        this.vacacional = opFilter === 'vacacional';
        this.actualForm = opFilter === 'protection' ? this.selectedLayerProtection > 0 ?
            this.listOfLayersProtection[this.selectedLayerProtection] : this.listOfLayersProtection[0] : opFilter;
    }

    getDangerPopulationLevel() {
        const dangerPopulationLimits: number[] = [0, 5000, 20000, 100000];
        let n = 0;
        while (this.cargaPoblacional > dangerPopulationLimits[n]) {
            n += 1;
        }
        const lisValues: number [] = [0, 1, 3, 5];
        return n > 0 ? lisValues[n - 1] : 0;
    }

    calculateGradesProtection() {
        const current_user = this.authService.getCurrentUser();
        const name = current_user.filter ? current_user.filter : this.popService.getMunicipality().user;
        const ref = this.dialogService.open(MapViewerComponent, {
            data: {
                id: this.beachObjectId,
                zoom: this.mapZoomLevel,
                mapHeight: '69vh'
            },
            header: this.localName ? 'Se muestran los resultados para: ' + this.localName
                : 'Mapa de resultados de grados de protección del municipio de '
                + this.aytos.find(i => i.ayto === name).municipio_minus,
            width: '65%',
            contentStyle: {'max-height': this.mapHeightContainer, 'overflow': 'auto'}
        });

        ref.onClose.subscribe((mensaje: string) => {
            if (mensaje) {
                console.log(mensaje);
            }
        });
        this.loadAllData();
        this.vacacional = false;
    }

    resetForm() {
        this.formVacational.reset();
    }

    onSubmitVacational() {
        this.spinnerService.show();
        const mode = this.formVacational.get('on_edit').value ? 'updates' : 'adds';
        const updateObj = new Array();
        updateObj.push({
            attributes: {
                objectid: mode === 'updates' ? this.formVacational.get('objectid').value : null,
                plazas_vacacional: this.formVacational.get('plazas_vacacional').value,
                ocupacion_vacacional: this.formVacational.get('ocupacion_vacacional').value,
                id_ayuntamiento: this.formVacational.get('id_ayuntamiento').value,
                ultimo_cambio: moment().format('YYYY-MM-DD HH:mm:ss'),
                ultimo_editor: this.authService.getCurrentUser().username
            }
        });
        // cambiamos el on_edit a true para que el calculo de progreso getCompleteState del formulario incluya el actual que se modifica.
        this.formVacational.get('on_edit').setValue(true);
        this.editDataLayer(updateObj, this.authService.getCurrentUser(), mode,
            environment.infoplayas_catalogo_edicion_tablas_url + '/' + environment.tbPoblacional + '/applyEdits');
        // actualizamos el valor de la carga poblacional
        this.cargaPoblacional = Math.round((this.municipio.beds * this.municipio.occupation * 0.01 + updateObj[0].attributes.plazas_vacacional
            * updateObj[0].attributes.ocupacion_vacacional * 0.01)) + this.municipio.population;
        this.DangerPopulationLevel = this.getDangerPopulationLevel();
        // actualizamos la local storage
        const mun = this.popService.getMunicipality();
        mun.beds_vacational = updateObj[0].attributes.plazas_vacacional;
        mun.occupation_vacational = updateObj[0].attributes.ocupacion_vacacional;
        localStorage.setItem('municipality', JSON.stringify(mun));
    }

    loadVacational(mun: Municipality) {
        // this.spinnerService.show();
        this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_tablas_url + '/' + environment.tbPoblacional + '/query',
            'id_ayuntamiento = \'' + mun.istac_code + '\'', '*', false, this.authService.getCurrentUser().token,
            'id_ayuntamiento', false).subscribe(
            (result: any) => {
                if (result && result.features.length > 0) {
                    this.formVacational.patchValue(result.features[0].attributes);
                    this.formVacational.get('on_edit').setValue(true);
                    this.formVacational.get('editor').setValue(this.isUserEditor);
                } else {
                    this.formVacational.get('on_edit').setValue(false);
                    this.formVacational.get('editor').setValue(this.isUserEditor);
                    this.formVacational.get('id_ayuntamiento').setValue(mun.istac_code);
                }
                const bedsVacational = this.formVacational.get('plazas_vacacional').value ? this.formVacational.get('plazas_vacacional').value : 0;
                const ocupationVacational = this.formVacational.get('ocupacion_vacacional').value ? this.formVacational.get('ocupacion_vacacional').value : 0;
                this.municipio = mun;
                this.cargaPoblacional = Math.round((this.municipio.beds * this.municipio.occupation * 0.01 + bedsVacational
                    * ocupationVacational * 0.01)) + this.municipio.population;
                this.DangerPopulationLevel = this.getDangerPopulationLevel();
                // actualizamos la local storage
                mun.beds_vacational = bedsVacational;
                mun.occupation_vacational = ocupationVacational;
                localStorage.setItem('municipality', JSON.stringify(mun));
            },
            error => {
                this.spinnerService.hide();
            }).add(() => {
        });
    }

    readFormsState() {
        this.subscripcionFormState = this.formStateService.sFormsState$.subscribe(
            (result: number) => {
                if (result === 0) {
                    this.fillState = 0;
                } else {
                    this.fillState += result;
                }
                if (this.fillState > 99) {
                    $('#resultsFilterMenu').show();
                } else if (this.fillState) {
                    $('#resultsFilterMenu').hide();
                }
            },
            error => {
                console.log(error.toString());
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
                Swal.fire({
                    type: 'error',
                    title: 'NO se han guardado los datos',
                    text: error.toString(),
                    footer: ''
                });
                console.log(error.toString());
                this.spinnerService.hide();
            }).add(() => {
            console.log('end of request');
            this.spinnerService.hide();
        });
    }
}
