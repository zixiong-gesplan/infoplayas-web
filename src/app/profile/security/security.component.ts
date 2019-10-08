import { Component, OnInit,ElementRef} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Auth} from '../../models/auth';
import {EsriRequestService} from '../../services/esri-request.service';
import {environment} from '../../../environments/environment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
declare var $:any;
declare var jQuery:any;
declare const aytos: any;
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
  datasend:[] =[];


  constructor(private authService: AuthGuardService,
              private service: EsriRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private elementRef: ElementRef,
              private fb: FormBuilder) { }

  ngOnInit() {
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


  private horario(id_dgse,mc){
    this.altoini = mc.inputFieldValue;
  }

  private update(){

    Swal.fire({
  type: 'success',
  title: 'Exito',
  text: 'la actualización ha sido correcta',
  footer: ''
})
      console.log(this.formUnitarios);

  //show toast in top screen if result
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

  default(){
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

  loadRecords() {
    this.spinnerService.show();
    this.currentUser = this.authService.getCurrentUser();
    this.filtermunicipio = 'municipio = \'' + aytos[this.currentUser.username].municipio_minus + '\'';
    this.nomMunicipio = aytos[this.currentUser.username].municipio_minus;
      this.service.getEsriDataLayer('https://utility.arcgis.com/usrsvcs/servers/070539cded6d4f5e8aa2ce1566618acd/rest/services/ag17_023_fase_2/playas_catalogo_edicion/FeatureServer/0/query',
          this.filtermunicipio, '*', true, this.currentUser.token,'clasificacion', true).subscribe(
          (result: any) => {
              if (result) {
                   this.datosPlaya =  result;
                   console.log(this.datosPlaya);
                   this.codMunicipio(this.datosPlaya);
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
    this.service.getEsriRelatedData(environment.infoplayas_catalogo_edicion_url + '/queryRelatedRecords',
        object_id, '4', '*', false, this.currentUser.token).subscribe(
        (result: any) => {
          if (result) {
            // this.selectedBeachDanger = result.relatedRecordGroups[0].relatedRecords[0].attributes;
            this.datosPlayaRelacionada = result;

            // console.log('tabla relacionada');
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
      console.log('end of request');
    });
  }


configuracion(){
    this.loadUnitPrice();
    $('#configuracion' ).modal({backdrop: 'static', keyboard: false});// inicializamos desactivado el esc y el click fuera de la modal
    $('#configuracion' ).modal('show');
  }

  codMunicipio(datosPlaya){
    this.codMun = this.datosPlaya.features[0].attributes.id_dgse.substring(0,3);
    return this.codMun;
  }

loadUnitPrice(){
  this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_tablas_url+ '/10/query',
    'id_ayuntamiento =\'' + this.codMun + '\'', '*', false, this.currentUser.token,'id_ayuntamiento',false).subscribe(
      (result: any) => {
        console.log('unitprice '+result);
          if (result.features.length!=0) {
            console.log(result.features[0].attributes);
            this.formUnitarios.patchValue(result.features[0].attributes);
            this.formUnitarios.patchValue({on_edit: true});
          }else{
              this.formUnitarios.patchValue({on_edit: false});
          }
      },
      error => {
          console.log(error.toString());
      }).add(() => {
      console.log('end of request');
  });
  }
}
