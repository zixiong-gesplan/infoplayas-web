import { Component, OnInit,ElementRef} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Auth} from '../../models/auth';
import {EsriRequestService} from '../../services/esri-request.service';
import {RequestService} from '../../services/request.service';
import {environment} from '../../../environments/environment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
declare var $:any;
declare var jQuery:any;
declare const aytos: any;
declare var UTMXYToLatLon: any;
declare var RadToDeg: any;
import Swal from 'sweetalert2'


@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css'],
  // styles: [`
  //       /* Column Priorities */
  //       @media only all {
  //           th.ui-p-6,
  //           td.ui-p-6,
  //           th.ui-p-5,
  //           td.ui-p-5,
  //           th.ui-p-4,
  //           td.ui-p-4,
  //           th.ui-p-3,
  //           td.ui-p-3,
  //           th.ui-p-2,
  //           td.ui-p-2,
  //           th.ui-p-1,
  //           td.ui-p-1 {
  //               display: none;
  //           }
  //       }
  //
  //       /* Show priority 1 at 320px (20em x 16px) */
  //       @media screen and (min-width: 20em) {
  //           th.ui-p-1,
  //           td.ui-p-1 {
  //               display: table-cell;
  //           }
  //       }
  //
  //       /* Show priority 2 at 480px (30em x 16px) */
  //       @media screen and (min-width: 30em) {
  //           th.ui-p-2,
  //           td.ui-p-2 {
  //               display: table-cell;
  //           }
  //       }
  //
  //       /* Show priority 3 at 640px (40em x 16px) */
  //       @media screen and (min-width: 40em) {
  //           th.ui-p-3,
  //           td.ui-p-3 {
  //               display: table-cell;
  //           }
  //       }
  //
  //       /* Show priority 4 at 800px (50em x 16px) */
  //       @media screen and (min-width: 50em) {
  //           th.ui-p-4,
  //           td.ui-p-4 {
  //               display: table-cell;
  //           }
  //       }
  //
  //       /* Show priority 5 at 960px (60em x 16px) */
  //       @media screen and (min-width: 60em) {
  //           th.ui-p-5,
  //           td.ui-p-5 {
  //               display: table-cell;
  //           }
  //       }
  //
  //       /* Show priority 6 at 1,120px (70em x 16px) */
  //       @media screen and (min-width: 70em) {
  //           th.ui-p-6,
  //           td.ui-p-6 {
  //               display: table-cell;
  //           }
  //       }
  //   `]
    })
export class SecurityComponent implements OnInit {

  currentUser: Auth;
  filtermunicipio;
  datosPlaya:any = [];
  datosPlayaRelacionada:any = [];
  nomMunicipio;
  altoini: Date;
  nombre_playa;
  grado_proteccion;
  clasificacion;
  medio;
  pasiva:boolean;
  iddgse;
  peligrosa:boolean;
  activarGP:boolean = true;
  formUnitarios: FormGroup;
  codMun;
  datasend: string[] = [];
  objeto_attributes:{};
  mode: string = 'adds';
  index: number;
  latitud: number=0;
  longitud: number=0;
  datosclima = {
    main: {
      temp: '',
      humidity:'',
      pressure:'',
      temp_max: '',
      temp_min:' '

    },
    weather:[{
      icon: '02d',
      description:'',
    }],
    wind:{
      deg:'',
      speed:''
    }
  };

  constructor(private authService: AuthGuardService,
              private service: EsriRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private elementRef: ElementRef,
              private fb: FormBuilder,
              private serviceMeteo: RequestService) { }

  ngOnInit() {
    this.utmToLatLong('327495','3109493');
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
    })
  }


  loadRecords() {
    this.spinnerService.show();
    this.currentUser = this.authService.getCurrentUser();
    this.filtermunicipio = 'municipio = \'' + aytos[this.currentUser.username].municipio_minus + '\'';
    this.nomMunicipio = aytos[this.currentUser.username].municipio_minus;
      this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_url+'/query',
          this.filtermunicipio, '*', true, this.currentUser.token,'clasificacion', true).subscribe(
          (result: any) => {
              if (result) {

                   this.datosPlaya =  result;
                   console.log(this.datosPlaya);
                   this.codMunicipio(this.datosPlaya);
                   this.spinnerService.hide();
                 }else{

                 }
          },
          error => {
              console.log(error.toString());

          }).add(() => {
          console.log('end of request');
          this.spinnerService.hide();
      });
  }

  loadRelatedRecords(object_id,option) {
    this.spinnerService.show();
    let modaloption = option;
    this.service.getEsriRelatedData(environment.infoplayas_catalogo_edicion_url+ '/queryRelatedRecords',
        object_id, '4', '*', false, this.currentUser.token).subscribe(
        (result: any) => {
          if (result) {
            this.datosPlayaRelacionada = result;
            // console.log(this.datosPlayaRelacionada);
            $('#' + modaloption).modal({backdrop: 'static', keyboard: false});// inicializamos desactivado el esc y el click fuera de la modal
            $('#' + modaloption).modal('show');
            this.spinnerService.hide();
          }else{

          }
        },
        error => {
          console.log(error.toString());

        }).add(() => {
      //console.log('end of request');
    });
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

loadUnitPrice(){
  this.spinnerService.hide();
  $('#configuracion' ).modal({backdrop: 'static', keyboard: false});// inicializamos desactivado el esc y el click fuera de la modal
  $('#configuracion' ).modal('show');
  this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_tablas_url+ '/10/query',
    'id_ayuntamiento =\'' + this.codMun + '\'', '*', false, this.currentUser.token,'id_ayuntamiento',false).subscribe(
      (result: any) => {
          if (result.features.length!=0) {
            this.formUnitarios.patchValue(result.features[0].attributes);
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

  public configuracion(){
      this.loadUnitPrice();
    }

  private horario(id_dgse,mc){
    this.altoini = mc.inputFieldValue;
  }

  private anhadir_medios(playa,option){
    this.loadRelatedRecords(playa.attributes.objectid_12,option);
    this.nombre_playa = playa.attributes.nombre_municipio;
    this.iddgse = playa.attributes.id_dgse;
    this.clasificacion = playa.attributes.clasificacion;
    if(playa.attributes.clasificacion==='USO PROHIBIDO'){
      this.peligrosa = true;
    }
  }

  private mostrar_pasiva_grado_bajo(grado){
      if(grado==='bajo'){
        this.pasiva = true;
      }
  }

  public default(){
    this.pasiva = false;
    this.peligrosa = false;
  }

  public calculadora(medio){
      this.spinnerService.show();
      $('#calculadora'+medio).modal('show');
      $('#calculadora'+medio).modal({backdrop: 'static', keyboard: false});// inicializamos desactivado el esc y el click fuera de la modal
      this.spinnerService.hide();
      this.medio = medio;
  }


  public codMunicipio(datosPlaya){
      this.codMun = this.datosPlaya.features[0].attributes.id_dgse.substring(0,3);
      return this.codMun;
    }

  // para convertir fechas de angular a formato entendido por postgres, solo fecha o fecha y horas, minutos y segundos
  // 2016-06-22 19:10:25 postgres format Date type
  public toDateFormat(timePart: boolean): string {
      const date = new Date();
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      const hh =  date.getHours();
      const i = date.getMinutes();
      const ss = date.getSeconds();
      return timePart ? yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + i + ':' + ss : yyyy + '-' + mm + '-' + dd;
  }

  public utmToLatLong(x, y){
    var latlon = new Array(2);
    var  zone, southhemi;
     x = parseFloat (x);
     y = parseFloat (y);
    zone = parseInt('28');
    southhemi = false;
    UTMXYToLatLon (x, y, zone, southhemi, latlon);
    this.latitud=RadToDeg (latlon[0]);
    this.longitud = RadToDeg (latlon[1]);

  }

  public meteo(playa){
    this.nombre_playa = playa.attributes.nombre_municipio;
    this.utmToLatLong(playa.centroid.x,playa.centroid.y);
    this.serviceMeteo.meteoData(this.latitud,this.longitud).subscribe(
      (result: any) => {
        if (result.length !== 0) {
        this.datosclima = result;
        $('#tiempo').modal('show');
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
      })
    }
}
