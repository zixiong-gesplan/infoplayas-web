import {Component, OnInit} from '@angular/core';
import {DialogService} from 'primeng/api';
import {MapPickLocationComponent} from '../map-pick-location/map-pick-location.component';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Auth} from '../../models/auth';
import {EsriRequestService} from '../../services/esri-request.service';
import {environment} from '../../../environments/environment';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import Swal from 'sweetalert2';
import * as moment from 'moment';

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

    constructor(private authService: AuthGuardService,
                private spinnerService: Ng4LoadingSpinnerService,
                private fb: FormBuilder,
                private service: EsriRequestService,
                public dialogService: DialogService) {
    }

    ngOnInit() {

        // console.log(this.authService.getCurrentUser());
        this.formPrincipal = this.fb.group({
            incidente: new FormControl(''),
            expte: new FormControl(0, Validators.min(0)),
            socorristas: new FormControl(0),
            fuen_datos: new FormControl(0),
            // ultimo_editor: new FormControl(this.currentUser.username),
            // ultimo_cambio: new FormControl(this.toDateFormat(true))
        });
    }

    pickAlocation() {
        const ref = this.dialogService.open(MapPickLocationComponent, {
            data: {
                id: null,
                zoom: 12,
                mapHeight: '69vh'
            },
            header: 'titulo cabecera ventana',
            width: '65%',
            contentStyle: {'max-height': '78vh', 'overflow': 'auto'}
        });

        ref.onClose.subscribe((incidentPoint) => {
            if (incidentPoint) {
                console.log(incidentPoint);
                // TODO hacer visible el formulario de incidentes y precargar datos de la playa y el punto
                // this.formulario = true;
            }
        });
    }

    fileChangeEvent(fileInput) {
        const files = fileInput.target.files;
        for (let i = 0; i < files.length; i++) {
            this.readUrl(fileInput, i, files);
        }
    }

    borrarArchivo(archivo) {
        const indice = this.archivos.indexOf(archivo);
        this.archivos.splice(indice, 1);
        this.url.splice(indice, 1);
    }

    readUrl(event: any, i, files) {
        const reader: any = new FileReader();
        reader.onload = (ev: any) => {
            this.url.push(ev.target.result);
            this.archivos.push(files[i]);
        };
        reader.readAsDataURL(event.target.files[i]);
    }

}
