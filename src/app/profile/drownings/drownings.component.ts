import {DialogService} from 'primeng/api';
import {MapPickLocationComponent} from '../map-pick-location/map-pick-location.component';
import {Component, OnInit} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {EsriRequestService} from '../../services/esri-request.service';
import {PopulationService} from '../../services/population.service';
import {environment} from '../../../environments/environment';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import {delay} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AppSettings} from '../../../app-setting';

declare var $: any;
declare var jQuery: any;

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
    public mapa: boolean = true;
    public formulario: boolean = false;
    public botones: boolean = true;
    public personasArray: any[] = [];
    public mapHeightContainer: string;
    public mapZoomLevel: number;
    public viewEditor: boolean;
    public incidentId: number;
    eventsSubject: Subject<void> = new Subject<void>();
    animationProgress: boolean;
    yearRange: string;
    es: any;

    constructor(private authService: AuthGuardService,
                private spinnerService: Ng4LoadingSpinnerService,
                private fb: FormBuilder,
                private service: EsriRequestService,
                public dialogService: DialogService,
                public populationService: PopulationService) {
    }

    ngOnInit() {
        let d = new Date();
        let n = d.getFullYear();
        this.yearRange = '1920:'+ n.toString();
        // establecemos valores en espanol para el calendario
        this.es = AppSettings.CALENDAR_LOCALE_SP;
        this.formPrincipal = this.fb.group({
            incidente: new FormControl(''),
            expte: new FormControl(0, Validators.min(0)),
            socorristas: new FormControl(0),
            fuen_datos: new FormControl(0),
            municipio: new FormControl(''),
            playa: new FormControl(''),
            hora_derivación: new FormControl(''),
            isla: new FormControl(''),
            fecha: new FormControl(''),
            hora_conocimiento: new FormControl(''),
            hora_toma: new FormControl(''),
            hora_derivación1: new FormControl(''),
            alerta: new FormControl(''),

            ultimo_editor: new FormControl(this.authService.getCurrentUser().username),
            ultimo_cambio: new FormControl(this.toDateFormat(true))
        });
        this.formPersonas = this.fb.group({
            genero: new FormControl(''),
            fecha_nacimiento: new FormControl(''),
            lnacimiento: new FormControl(''),
            pnacimiento: new FormControl(''),
            lresidencia: new FormControl(''),
            presidencia: new FormControl(''),
        });
        this.mapHeightContainer = '78vh';
        this.mapZoomLevel = 12;
    }

    fileChangeEvent(fileInput) {
        let files = fileInput.target.files;
        for (var i = 0; i < files.length; i++) {
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
                    this.scrollToSmooth('#map');
                } else if (result.error) {
                    Swal.fire({
                        type: 'error',
                        title: 'Error ' + result.error.code,
                        text: result.error.message,
                        footer: ''
                    });
                }
                // this.spinnerService.hide();
            },
            error => {
                console.log(error.toString());
                this.spinnerService.hide();
            });
    }

    scrollToSmooth(velement) {
        $('html, body').animate({
            scrollTop: $(velement).offset().top
        }, 1000);
    }

    borrarArchivo(archivo) {
        let indice = this.archivos.indexOf(archivo);
        this.archivos.splice(indice, 1);
        this.url.splice(indice, 1);
    }

    borrarPersona(persona) {
        let indice = this.personasArray.indexOf(persona);
        this.personasArray.splice(indice, 1);
    }

    readUrl(event: any, i, files) {
        var reader: any = new FileReader();
        reader.onload = (event: any) => {
            this.url.push(event.target.result);
            this.archivos.push(files[i]);
        };
        reader.readAsDataURL(event.target.files[i]);
    }

    nuevaPersona() {
        this.personasArray.push(this.formPersonas.value);
        this.formPersonas.reset();
        this.showMessage('La persona se ha añadido correctamente');
    }

    enviar() {
        this.showMessage('La incidencia se ha añadido correctamente');
        this.mapa = true;
        this.botones = true;
        this.scrollToSmooth('#buttonBar');
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

    showMessage(mensaje) {
        Swal.fire({
            type: 'success',
            title: 'Exito',
            text: mensaje,
            footer: ''
        });
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
                this.formPrincipal.get('playa').setValue(incidentPoint.attributes.nombre_municipio);
                this.formPrincipal.get('municipio').setValue(this.populationService.getMunicipality().ayuntamiento.toUpperCase());
                this.formulario = true;
                this.mapa = false;
                this.botones = false;
            }
        });
    }

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
}
