import {DialogService} from 'primeng/api';
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
        const d = new Date();
        const n = d.getFullYear();
        this.yearRange = '1920:' + n.toString();
        // establecemos valores en espanol para el calendario
        this.es = AppSettings.CALENDAR_LOCALE_SP;
        this.formPrincipal = this.fb.group({
            incidente: new FormControl(''),
            expte: new FormControl(0, Validators.min(0)),
            socorristas: new FormControl(0),
            fuen_datos: new FormControl(0),
            municipio: new FormControl(''),
            playa: new FormControl(''),
            hora_derivacion: new FormControl(''),
            isla: new FormControl(''),
            fecha: new FormControl(''),
            hora_conocimiento: new FormControl(''),
            hora_toma: new FormControl(''),
            hora_derivacion1: new FormControl(''),
            alerta: new FormControl(''),

            ultimo_editor: new FormControl(''),
            ultimo_cambio: new FormControl('')
        });
        this.formPersonas = this.fb.group({
            genero: new FormControl(''),
            fecha_nacimiento: new FormControl(''),
            lnacimiento: new FormControl(''),
            pnacimiento: new FormControl(''),
            lresidencia: new FormControl(''),
            presidencia: new FormControl(''),
            remergencia: new FormControl(''),
            robservaciones: new FormControl(''),
            dobservaciones1: new FormControl(''),
            dobservaciones2: new FormControl(''),
        });
        this.mapHeightContainer = '78vh';
        this.mapZoomLevel = 12;
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
        this.formPersonas.reset();
        UtilityService.showSuccessMessage('La persona se ha añadido correctamente');
        // reseteamos el estado del acordeon
        $('.collapse').collapse('hide');
        $('#collapseOne').collapse('show');
    }

    enviar() {
        // TODO enviar al modelo esri
        this.formPrincipal.patchValue({
            ultimo_cambio: moment().format('YYYY-MM-DD HH:mm:ss'),
            ultimo_editor: this.authService.getCurrentUser().username
        });

        UtilityService.showSuccessMessage('La incidencia se ha añadido correctamente');
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
