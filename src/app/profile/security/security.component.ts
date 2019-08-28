import { Component, OnInit,ElementRef} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Auth} from '../../models/auth';
import {EsriRequestService} from '../../services/esri-request.service';
import {environment} from '../../../environments/environment';
import {Danger} from '../../models/danger';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
declare var $:any;
declare var jQuery:any;

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
  selectedBeachRisk: Danger;
  filtermunicipio;
  datosPlaya:any = [];
  nomMunicipio;
  altoini: Date;
  nombre_playa;
  grado_proteccion;
  clasificacion;
  medio;
  pasiva:boolean;
  iddgse;
  peligrosa:boolean;


  constructor(private authService: AuthGuardService,
              private service: EsriRequestService,
              private spinnerService: Ng4LoadingSpinnerService,
              private elementRef: ElementRef) { }

  ngOnInit() {
    this.loadRelatedRecords();
    this.default();

  }

  private horario(id_dgse,mc){
    this.altoini = mc.inputFieldValue;
  }

  private anhadir_medios(playa,grado){
    $('#myModal').modal({backdrop: 'static', keyboard: false});// inicializamos desactivado el esc y el click fuera de la modal
    $('#myModal').modal('show');
    this.nombre_playa = playa.attributes.nombre_municipio;
    this.grado_proteccion = grado;
    this.iddgse = playa.attributes.id_dgse;
    this.clasificacion = playa.attributes.clasificacion;
    this.mostrar_pasiva_grado_bajo(grado);
    console.log(playa.attributes.clasificacion);
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

  private calculadora(medio){
    $('#calculadoraModal').modal({backdrop: 'static', keyboard: false});// inicializamos desactivado el esc y el click fuera de la modal
    $('#calculadoraModal').modal('show');
    this.medio = medio;
  }

  loadRelatedRecords() {
    this.spinnerService.show();
    this.currentUser = this.authService.getCurrentUser();
    this.filtermunicipio = "LOWER(municipio)=LOWER('"+ this.currentUser.username.substring(5,this.currentUser.username.length) +"')";
    this.nomMunicipio = this.currentUser.username.substring(5,this.currentUser.username.length);

      this.service.getEsriDataLayer('https://utility.arcgis.com/usrsvcs/servers/070539cded6d4f5e8aa2ce1566618acd/rest/services/ag17_023_fase_2/playas_catalogo_edicion/FeatureServer/0/query',
          this.filtermunicipio, '*', false, this.currentUser.token).subscribe(
          (result: any) => {
              if (result) {
                  this.datosPlaya = result;
                  console.log(result);
                  this.spinnerService.hide();
              }
          },
          error => {
              console.log(error.toString());
          }).add(() => {
          console.log('end of request');
      });
  }
}
