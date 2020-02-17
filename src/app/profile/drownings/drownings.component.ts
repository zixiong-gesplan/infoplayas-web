import { Component, OnInit } from '@angular/core';
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
  public archivos:any[] = [];
  public url:any[] = [];

  constructor(  private authService: AuthGuardService,
                private spinnerService: Ng4LoadingSpinnerService,
                private fb: FormBuilder,
                private service: EsriRequestService) { }

  ngOnInit() {

    console.log(this.authService.getCurrentUser());
    this.formPrincipal = this.fb.group({
      incidente: new FormControl(''),
      expte: new FormControl(0, Validators.min(0)),
      socorristas: new FormControl(0),
      fuen_datos: new FormControl(0),
      municipio: new FormControl(this.authService.getCurrentUser().filter.toUpperCase()),
      playa: new FormControl(''),
      hora_derivación: new FormControl(''),
      isla: new FormControl('Gran Canaria'),
      fecha: new FormControl(''),
      hora_conocimiento: new FormControl(''),
      hora_toma: new FormControl(''),
      hora_derivación1: new FormControl(''),
      //ultimo_editor: new FormControl(this.currentUser.username),
      //ultimo_cambio: new FormControl(this.toDateFormat(true))
    });
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

}
