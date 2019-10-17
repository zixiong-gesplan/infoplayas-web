import {Component, ElementRef, OnInit, OnDestroy} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Auth} from '../../models/auth';
import {EsriRequestService} from '../../services/esri-request.service';
import {RequestService} from '../../services/request.service';
import {GradesProtectionService} from '../../services/grades-protection.service';
import {environment} from '../../../environments/environment';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';

declare var $: any;
declare var jQuery: any;
declare const aytos: any;
declare var UTMXYToLatLon: any;
declare var RadToDeg: any;

@Component({
    selector: 'app-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.css'],
})
export class SecurityComponent implements OnInit, OnDestroy {

    currentUser: Auth;
    filtermunicipio;
    datosPlaya: any = [];
    datosPlayaRelacionada: any = [];
    nomMunicipio;
    altoini: Date;
    nombre_playa;
    grado_proteccion;
    clasificacion;
    medio;
    pasiva: boolean;
    iddgse;
    peligrosa: boolean;
    activarGP: boolean = true;
    formUnitarios: FormGroup;
    formMediosHumanos: FormGroup;
    codMun;
    datasend: string[] = [];
    objeto_attributes: {};
    mode: string = 'adds';
    index: number;
    latitud: number = 0;
    longitud: number = 0;
    datosclima = {
        main: {
            temp: '',
            humidity: '',
            pressure: '',
            temp_max: '',
            temp_min: ' '

        },
        weather: [{
            icon: '02d',
            description: '',
        }],
        wind: {
            deg: '',
            speed: ''
        }
    };
    private selectObjectId: number;
    private options: string;
    private grados: [] = [];
    private periodos: [] = [];
    private subscripcionFeatures;

    constructor(private authService: AuthGuardService,
                private service: EsriRequestService,
                private spinnerService: Ng4LoadingSpinnerService,
                private elementRef: ElementRef,
                private fb: FormBuilder,
                private serviceMeteo: RequestService,
                private gradeService: GradesProtectionService,) {
    }

    ngOnInit() {
        //this.service.clearfeaturesSource();
        this.loadRecords();
        this.default();
        this.formUnitarios = this.fb.group({
            objectid: new FormControl(''),
            jefe_turno_pvp: new FormControl(0, Validators.min(0)),
            socorrista_pvp: new FormControl(0),
            socorrista_embarcacion_pvp: new FormControl(0),
            socorrista_embarcacion_per_pvp: new FormControl(0),
            bandera_pvp: new FormControl(0),
            mastil_pvp: new FormControl(0),
            cartel_pvp: new FormControl(0),
            bandera_comp_pvp: new FormControl(0),
            carrete_pvp: new FormControl(0),
            m_cuerda_pvp: new FormControl(0),
            boya_pvp: new FormControl(0),
            torre_pvp: new FormControl(0),
            desfibrilador_pvp: new FormControl(0),
            botiquin_pvp: new FormControl(0),
            sistemas_izado_pvp: new FormControl(0),
            salvavidas_pvp: new FormControl(0),
            senales_prohibicion: new FormControl(0),
            id_ayuntamiento: new FormControl(0),
            ultimo_editor: new FormControl(''),
            ultimo_cambio: new FormControl('')
        });
        this.formMediosHumanos = this.fb.group({
            ndias: new FormControl(0),
            jefes_turno: new FormControl(0),
            socorristas_torre: new FormControl(0),
            socorristas_polivalentes: new FormControl(0),
            socorristas_acuatico: new FormControl(0),
            socorristas_embarcacion: new FormControl(0),
            socorristas_apie: new FormControl(0),
            socorristas_embarcacion_per: new FormControl(0),


        });
    }

    readFeatures() {
      this.datos =   this.service.features$.subscribe(
            (results: any) => {
                const beach = (results[0] as any);
                console.log(results);
                if (results.length > 0) {

                    if (beach && beach.relatedRecords1.length > 0 && beach.relatedRecords2.length > 0
                        && beach.relatedRecords3.length > 0) {
                        beach.periodos = this.gradeService.calculateGradeForPeriods(beach.relatedRecords1, beach.relatedRecords2,
                            beach.relatedRecords3);
                        beach.grado_maximo = this.gradeService.getMaximunGrade(beach.periodos);
                        beach.grados = this.gradeService.getDistinctGrades(beach.periodos);
                        console.log(beach);
                        this.grados = beach.grados;
                        this.periodos = beach.periodos;
                        this.datosPlayaRelacionada = beach;
                        // inicializamos desactivado el esc y el click fuera de la modal
                        $('#' + this.options).modal({backdrop: 'static', keyboard: false});
                        $('#' + this.options).modal('show');

                    } else {
                        Swal.fire({
                            type: 'error',
                            title: '',
                            text: 'No existen grados de proteccion para esta playa     debe determinar el grado de protección en la fase 2',
                            footer: ''
                        });
                    }
                }
                this.spinnerService.hide();
            },
            error => {
                console.log(error.toString());
            });
    }

    loadRecords() {
        this.spinnerService.show();
        this.currentUser = this.authService.getCurrentUser();
        this.filtermunicipio = 'municipio = \'' + aytos[this.currentUser.username].municipio_minus + '\'';
        this.nomMunicipio = aytos[this.currentUser.username].municipio_minus;
        this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_url + '/query',
            this.filtermunicipio, '*',false, this.currentUser.token, 'clasificacion', true).subscribe(
            (result: any) => {
                if (result) {
                    this.readFeatures();
                    this.datosPlaya = result;
                    this.codMunicipio(this.datosPlaya);
                    this.spinnerService.hide();
                }
            },
            error => {
                console.log(error.toString());
                  this.spinnerService.hide();

            }).add(() => {
            console.log('end of request');


        });
    }

    loadUnitPrice() {
        this.spinnerService.hide();
        // inicializamos desactivado el esc y el click fuera de la modal
        $('#configuracion').modal({backdrop: 'static', keyboard: false});
        $('#configuracion').modal('show');
        this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_tablas_url + '/10/query',
            'id_ayuntamiento =\'' + this.codMun + '\'', '*', false, this.currentUser.token, 'id_ayuntamiento', false).subscribe(
            (result: any) => {
                if (result.features.length !== 0) {;
                    this.mode = 'updates';
                    this.spinnerService.hide();
                }
            },
            error => {
                this.spinnerService.hide();
            }).add(() => {
            //console.log('end of request');
        });
    }

    public default() {
        this.pasiva = false;
        this.peligrosa = false;
    }

    public calculadora(medio) {
        this.spinnerService.show();
        $('#calculadora' + medio).modal('show');
        // inicializamos desactivado el esc y el click fuera de la modal
        $('#calculadora' + medio).modal({backdrop: 'static', keyboard: false});
        this.spinnerService.hide();
        this.medio = medio;
    }

    public codMunicipio(datosPlaya) {
        this.codMun = this.datosPlaya.features[0].attributes.id_dgse.substring(0, 3);
        return this.codMun;
    }

    // 2016-06-22 19:10:25 postgres format Date type
    public toDateFormat(timePart: boolean): string {
        const date = new Date();
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        const hh = date.getHours();
        const i = date.getMinutes();
        const ss = date.getSeconds();
        return timePart ? yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + i + ':' + ss : yyyy + '-' + mm + '-' + dd;
    }

    public utmToLatLong(x, y) {
        const latlon = new Array(2);
        let zone, southhemi;
        x = parseFloat(x);
        y = parseFloat(y);
        zone = parseInt('28');
        southhemi = false;
        UTMXYToLatLon(x, y, zone, southhemi, latlon);
        this.latitud = RadToDeg(latlon[0]);
        this.longitud = RadToDeg(latlon[1]);

    }

    public meteo(playa) {
        this.spinnerService.show();
        this.nombre_playa = playa.attributes.nombre_municipio;
        this.utmToLatLong(playa.centroid.x, playa.centroid.y);
        this.serviceMeteo.meteoData(this.latitud, this.longitud).subscribe(
            (result: any) => {
                if (result.length !== 0) {
                    this.datosclima = result;
                    $('#tiempo').modal('show');
                    this.spinnerService.hide();
                }
            },
            error => {
                this.spinnerService.hide();
                Swal.fire({
                    type: 'error',
                    title: '',
                    text: 'Se ha producido un error inesperado',
                    footer: ''
                });
            });
    }

    public updateMediosHumanos() {
        console.log(this.formMediosHumanos.value);
    }

    private update() {
        this.spinnerService.show();
        const preciosUnitariosSend = [];
        const preciosUnitarios = {
            attributes: {
                ultimo_cambio: '',
                id_ayuntamiento: '',
                ultimo_editor: ''
            },
        };
        preciosUnitarios.attributes = this.formUnitarios.value;
        preciosUnitarios.attributes.ultimo_cambio = this.toDateFormat(true);
        preciosUnitarios.attributes.ultimo_editor = this.currentUser.username;
        preciosUnitarios.attributes.id_ayuntamiento = this.codMun;
        preciosUnitariosSend.push(preciosUnitarios);

        this.service.updateEsriData(environment.infoplayas_catalogo_edicion_tablas_url + '/10/applyEdits',
            preciosUnitariosSend, this.mode, this.currentUser.token).subscribe(
            (result: any) => {
                if (result.length !== 0) {
                    this.spinnerService.hide();
                    Swal.fire({
                        type: 'success',
                        title: 'Exito',
                        text: 'la actualización ha sido correcta',
                        footer: ''
                    });

                    $('#configuracion').modal('hide');
                } else {
                    this.spinnerService.hide();
                    Swal.fire({
                        type: 'error',
                        title: '',
                        text: 'Se ha producido un error inesperado',
                        footer: ''
                    });
                }
            },
            error => {
                this.spinnerService.hide();
                Swal.fire({
                    type: 'error',
                    title: '',
                    text: 'Se ha producido un error inesperado',
                    footer: ''
                });
            }).add(() => {
            console.log('end of request');

        });
    }

    private horario(id_dgse, mc) {
        this.altoini = mc.inputFieldValue;
    }

    private anhadir_medios(playa, option) {
        this.spinnerService.show();
        let relationIds;
        switch (option) {
            case 'humanos': {
                relationIds = ['1', '2', '3', '4'];
                break;
            }
            case 'materiales': {
                relationIds = ['1', '2', '3', '5', '6', '7'];
                break;
            }
            default: {
                relationIds = ['1', '2', '3'];
                break;
            }
        }
        this.service.getMultipleRelatedData([playa], relationIds, this.currentUser.token,'security');

        this.options = option;
        this.nombre_playa = playa.attributes.nombre_municipio;
        this.iddgse = playa.attributes.id_dgse;
        this.clasificacion = playa.attributes.clasificacion;
        if (playa.attributes.clasificacion === 'USO PROHIBIDO') {
            this.peligrosa = true;
        }
    }

    private mostrar_pasiva_grado_bajo(grado) {
        if (grado === 'bajo') {
            this.pasiva = true;
        }
    }
    ngOnDestroy(){
    this.datos.unsubscribe();

    }

}
