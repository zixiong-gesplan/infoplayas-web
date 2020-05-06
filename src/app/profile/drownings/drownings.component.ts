import {DialogService, SelectItem} from 'primeng/api';
import {MapPickLocationComponent} from '../map-pick-location/map-pick-location.component';
import {Component, OnInit} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {EsriRequestService} from '../../services/esri-request.service';
import {PopulationService} from '../../services/population.service';
import {environment} from '../../../environments/environment';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {AppSettings} from '../../../app-settings';
import * as moment from 'moment';
import {UtilityService} from '../../services/utility.service';
import Swal from 'sweetalert2';

declare let $: any;
declare let jQuery: any;

@Component({
    selector: 'app-drownings',
    templateUrl: './drownings.component.html',
    styleUrls: ['./drownings.component.css']
})
export class DrowningsComponent implements OnInit {
    public formPrincipal: FormGroup;
    public formPersonas: FormGroup;
    public archivos: any[] = [];
    public url: any[] = [];
    public mapa = true;
    public formulario = false;
    public botones = true;
    public personasArray: any[] = [];
    public mapHeightContainer: string;
    public mapZoomLevel: number;
    public viewEditor: boolean;
    public incidentId: number;
    eventsSubject: Subject<void> = new Subject<void>();
    animationProgress: boolean;
    yearRange: string;
    es: any;
    dDate: Date;
    expand: number;
    private aytosEsriDomain: SelectItem[];

    constructor(private authService: AuthGuardService,
                private spinnerService: Ng4LoadingSpinnerService,
                private fb: FormBuilder,
                private service: EsriRequestService,
                public dialogService: DialogService,
                public populationService: PopulationService) {
    }

    static scrollToSmooth(velement) {
        $('html, body').animate({
            scrollTop: $(velement).offset().top
        }, 1000);
    }

    ngOnInit() {
        this.getDomains();

        this.dDate = new Date();
        this.dDate.setHours(9, 0, 0);
        this.dDate.setMonth(1);
        const n = this.dDate.getFullYear();
        this.yearRange = '1920:' + n.toString();
        // establecemos valores en espanol para el calendario
        this.es = AppSettings.CALENDAR_LOCALE_SP;
        this.formPrincipal = this.fb.group({
            // TODO hay que arreglar en la capa el nombre del campo nº_incidente por incidente
            incidente: new FormControl(''),
            expte: new FormControl(0, Validators.min(0)),
            socorristas: new FormControl(0),
            fuen_datos: new FormControl(0),
            municipio: new FormControl(''),
            complemento_directo: new FormControl(''),
            playa_zbm: new FormControl(''),
            codigo_dgse: new FormControl(''),
            bandera: new FormControl(''),
            fecha: new FormControl('', Validators.required),
            hora_conocimiento: new FormControl('', Validators.required),
            hora_toma: new FormControl('', Validators.required),
            hora_derivacion: new FormControl('', Validators.required),
            isla: new FormControl(''),
            alerta: new FormControl(''),

            ultimo_editor: new FormControl(''),
            ultimo_cambio: new FormControl('')
        });
        this.formPersonas = this.fb.group({
            genero: new FormControl(''),
            fecha_nacimiento: new FormControl(''),
            lnacimiento: new FormControl(''),
            pnacimiento: new FormControl(''),
            municipio_estancia: new FormControl(''),
            presidencia: new FormControl(''),
            remergencia: new FormControl(''),
            robservaciones: new FormControl(''),
            dobservaciones1: new FormControl(''),
            dobservaciones2: new FormControl(''),
        });
        this.mapHeightContainer = '78vh';
        this.mapZoomLevel = 12;
    }

    getDomains() {
        // buscamos los dominios de ESRI que se van a usar en formularios e hijos de este componente
        const endpoint = environment.infoplayas_incidentes.substring(0, environment.infoplayas_incidentes.length - 1) + 'queryDomains';
        this.service.getValueDomains(endpoint, this.authService.getCurrentUser().token, [0]).subscribe(
            (result: any) => {
                if (result) {
                    if (result.domains.length > 0) {
                        let allDomains = [];
                        allDomains = result.domains;
                        console.log(allDomains);
                        this.aytosEsriDomain = allDomains.filter(d => d.name === 'Municipios')[0].codedValues.map(domain => {
                            return {label: domain.name, value: domain.code};
                        });
                        /* TODO forma parte de una posible batería de test a implementar: comprueba si los valores de los dominios en
                        la capa de incidentes de ESRIcoinciden con nuestro fichero de aytos.json
                        this.aytos.forEach(ay => {
                            if ( !this.aytosEsriDomain.find(i => i.name === ay.municipio_minus))console.log(ay.municipio_minus);
                        }); */
                    }
                } else if (result.error) {
                    UtilityService.showErrorMessage('Error ' + result.error.code, result.error.message);
                }
            },
            error => {
                console.log(error.toString());
            });
    }

    fileChangeEvent(fileInput) {
        const files = fileInput.target.files;
        for (let i = 0; i < files.length; i++) {
            this.readUrl(fileInput, i, files);
        }
    }

    unselectOnMap() {
        this.eventsSubject.next();
    }

    getIncident() {
        // this.spinnerService.show();
        const filterIncident = 'objectid = \'' + this.incidentId + '\'';
        this.service.getEsriDataLayer(environment.infoplayas_incidentes + '/query', filterIncident,
            '*', false, this.authService.getCurrentUser().token, 'objectid', false).subscribe(
            (result: any) => {
                if (result && result.features.length > 0) {
                    setTimeout(() => {
                        this.animationProgress = false;
                    }, 1000);
                    console.log(result.features);
                    // TODO patch en el formulario de incidente
                    DrowningsComponent.scrollToSmooth('#map');
                } else if (result.error) {
                    UtilityService.showErrorMessage('Error ' + result.error.code, result.error.message);
                }
                // this.spinnerService.hide();
            },
            error => {
                console.log(error.toString());
                this.spinnerService.hide();
            });
    }

    borrarArchivo(archivo) {
        const indice = this.archivos.indexOf(archivo);
        this.archivos.splice(indice, 1);
        this.url.splice(indice, 1);
    }

    borrarPersona(persona) {
        const indice = this.personasArray.indexOf(persona);
        this.personasArray.splice(indice, 1);
    }

    readUrl(event: any, i, files) {
        const reader: any = new FileReader();
        reader.onload = (eventLoad: any) => {
            this.url.push(eventLoad.target.result);
            this.archivos.push(files[i]);
        };
        reader.readAsDataURL(event.target.files[i]);
    }

    nuevaPersona() {
        this.personasArray.push(this.formPersonas.value);
        console.log(this.personasArray);
        this.formPersonas.reset();
        UtilityService.showSuccessMessage('La persona se ha añadido correctamente');
        // reseteamos el estado del acordeon
        $('.collapse').collapse('hide');
        setTimeout(() => {
            $('#collapseOne').collapse('show');
        }, 300);
    }

    enviar() {
        // TODO enviar al modelo esri
        alert('EN PRUEBAS: sin modelo enganchado, los cambios en la base de datos no surtirán efectos');

        const refDate = moment(this.formPrincipal.get('fecha').value);
        this.formPrincipal.patchValue({
            ultimo_cambio: moment().format('YYYY-MM-DD HH:mm:ss'),
            ultimo_editor: this.authService.getCurrentUser().username
        });

        const addvalues = [{attributes: this.formPrincipal.value}];

        addvalues[0].attributes.fecha.toJSON = function () {
            return moment(this).format('YYYY-MM-DD HH:mm:ss');
        };
        const timeFields = ['hora_derivacion', 'hora_conocimiento', 'hora_toma'];
        timeFields.forEach(f => {
            if (!addvalues[0].attributes[f] || addvalues[0].attributes[f] === '') {
                return;
            }
            addvalues[0].attributes[f].toJSON = function () {
                const refField = moment(this);
                return refDate.set({h: refField.hours(), m: refField.minutes()}).format('YYYY-MM-DD HH:mm:ss');
            };
        });

        // const addvalues = {attributes: []};
        console.log(JSON.parse(JSON.stringify(addvalues)));
        // console.log(addvalues);

        // TODO revisar el personasArray para preparar para la relatedQuery ojo con la fecha de nacimiento formatear como arriba

        UtilityService.showSuccessMessage('La incidencia se ha añadido correctamente');
        this.setCleanState();
    }

    setCleanState() {
        this.mapa = true;
        this.botones = true;
        console.log(this.formPrincipal.value);
        DrowningsComponent.scrollToSmooth('#buttonBar');
        setTimeout(() => {
            this.incidentId = null;
            this.resetForms();
            this.formulario = false;
        }, 2000);
    }

    resetForms() {
        this.personasArray = [];
        this.formPersonas.reset();
        this.formPrincipal.reset();
        this.archivos = [];
    }

    close() {
        this.mapa = true;
        this.botones = true;
        this.formulario = false;
        this.incidentId = null;
        this.resetForms();
        $('html, body').animate({
            scrollTop: $('#buttonBar').offset().top
        }, 100);
    }

    pickAlocation() {
        this.viewEditor = false;
        const ref = this.dialogService.open(MapPickLocationComponent, {
            data: {
                // TODO id codigo muerto
                id: null,
                zoom: 12,
                mapHeight: '69vh'
            },
            header: 'Seleccione una playa del municipio de ' + this.populationService.getMunicipality().ayuntamiento.toUpperCase(),
            width: '65%',
            contentStyle: {'max-height': '78vh', 'overflow': 'auto'}
        });

        ref.onClose.subscribe((incidentPoint) => {
            if (incidentPoint) {
                this.resetForms();
                this.formPrincipal.get('isla').setValue(incidentPoint.attributes.isla);
                this.formPrincipal.get('complemento_directo').setValue(incidentPoint.attributes.nombre_municipio);
                this.formPrincipal.get('codigo_dgse').setValue(incidentPoint.attributes.id_dgse);
                this.formPrincipal.get('playa_zbm').setValue(incidentPoint.attributes.playa_zbm);
                // TODO establecer los valores del dominio para mostrar al usuario y para el valor del campo
                this.formPrincipal.get('municipio').setValue(this.populationService.getMunicipality().ayuntamiento.toUpperCase());
                this.formulario = true;
                this.mapa = false;
                this.botones = false;
            }
        });
    }

    receiveIncidentId($event: number) {
        this.incidentId = $event;
        if ($event) {
            this.animationProgress = true;
            this.getIncident();
            this.formulario = true;
        } else {
            this.formulario = false;
            this.animationProgress = false;
        }
    }

    delete() {
        // TODO implementar para borrar el incidente
        alert('EN PRUEBAS: sin modelo enganchado, los cambios en la base de datos no surtirán efectos');
        Swal.fire({
            title: 'Eliminar el incidente',
            text: '¿Está segur@ de eliminar el registro de la base de datos?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí',
            footer: '',
            type: 'warning'
        }).then((result) => {
            if (result.value) {
                UtilityService.showSuccessMessage('El registro ' + this.incidentId + ' se ha eliminnado satisfactoriamente');
                this.setCleanState();
            }
        });
    }

}
