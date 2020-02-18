import {DialogService} from 'primeng/api';
import {MapPickLocationComponent} from '../map-pick-location/map-pick-location.component';
import { Component, OnInit } from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Auth} from '../../models/auth';
import {EsriRequestService} from '../../services/esri-request.service';
import {PopulationService} from '../../services/population.service';
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
  public archivos:any[] = [];
  public url:any[] = [];
  public mapa:boolean = false;
  public formulario:boolean = true;

  constructor(  private authService: AuthGuardService,
                private spinnerService: Ng4LoadingSpinnerService,
                private fb: FormBuilder,
                private service: EsriRequestService,
                public dialogService: DialogService,
                public populationService: PopulationService) { }

  ngOnInit() {

    console.log(this.populationService.getMunicipality());
    this.formPrincipal = this.fb.group({
      incidente: new FormControl(''),
      expte: new FormControl(0, Validators.min(0)),
      socorristas: new FormControl(0),
      fuen_datos: new FormControl(0),
      municipio: new FormControl(this.populationService.getMunicipality().ayuntamiento.toUpperCase()),
      playa: new FormControl(''),
      hora_derivación: new FormControl(''),
      isla: new FormControl(''),
      fecha: new FormControl(''),
      hora_conocimiento: new FormControl(''),
      hora_toma: new FormControl(''),
      hora_derivación1: new FormControl(''),
      alerta: new FormControl(''),

      //ultimo_editor: new FormControl(this.currentUser.username),
      //ultimo_cambio: new FormControl(this.toDateFormat(true))
    });
    this.formPersonas = this.fb.group({
      fecha_nacimiento: new FormControl(''),
      lnacimiento: new FormControl(''),
      pnacimiento: new FormControl(''),
      lresidencia: new FormControl(''),
      presidencia: new FormControl(''),
    })
  }
  fileChangeEvent(fileInput){
    let files = fileInput.target.files;
    for (var i = 0; i < files.length; i++) {
      this.readUrl(fileInput,i,files);
    }
  }

  borrarArchivo(archivo){
    let indice = this.archivos.indexOf(archivo);
    this.archivos.splice(indice,1);
    this.url.splice(indice,1);
    }

  readUrl(event:any, i,files) {
    var reader:any = new FileReader();
    reader.onload = (event: any) => {
      this.url.push(event.target.result);
      this.archivos.push(files[i]);
    }
    reader.readAsDataURL(event.target.files[i]);
  }
  nuevaIncidencia(){
    Swal.fire({
      type: 'success',
      title: 'Exito',
      text: 'La incidencia se ha creado correctamente',
      footer: ''
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
                console.log(incidentPoint.attributes);
                this.formPrincipal.get('isla').setValue(incidentPoint.attributes.isla);
                this.formPrincipal.get('playa').setValue(incidentPoint.attributes.nombre_municipio);
            // TODO hacer visible el formulario de incidentes y precargar datos de la playa y el punto
             this.formulario = false;
             this.mapa = true;
            }
        });
    }

}
