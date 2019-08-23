import { Component, OnInit } from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Auth} from '../../models/auth';
import {EsriRequestService} from '../../services/esri-request.service';
import {environment} from '../../../environments/environment';
import {Danger} from '../../models/danger';
declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css'],
  styles: [`
        /* Column Priorities */
        @media only all {
            th.ui-p-6,
            td.ui-p-6,
            th.ui-p-5,
            td.ui-p-5,
            th.ui-p-4,
            td.ui-p-4,
            th.ui-p-3,
            td.ui-p-3,
            th.ui-p-2,
            td.ui-p-2,
            th.ui-p-1,
            td.ui-p-1 {
                display: none;
            }
        }

        /* Show priority 1 at 320px (20em x 16px) */
        @media screen and (min-width: 20em) {
            th.ui-p-1,
            td.ui-p-1 {
                display: table-cell;
            }
        }

        /* Show priority 2 at 480px (30em x 16px) */
        @media screen and (min-width: 30em) {
            th.ui-p-2,
            td.ui-p-2 {
                display: table-cell;
            }
        }

        /* Show priority 3 at 640px (40em x 16px) */
        @media screen and (min-width: 40em) {
            th.ui-p-3,
            td.ui-p-3 {
                display: table-cell;
            }
        }

        /* Show priority 4 at 800px (50em x 16px) */
        @media screen and (min-width: 50em) {
            th.ui-p-4,
            td.ui-p-4 {
                display: table-cell;
            }
        }

        /* Show priority 5 at 960px (60em x 16px) */
        @media screen and (min-width: 60em) {
            th.ui-p-5,
            td.ui-p-5 {
                display: table-cell;
            }
        }

        /* Show priority 6 at 1,120px (70em x 16px) */
        @media screen and (min-width: 70em) {
            th.ui-p-6,
            td.ui-p-6 {
                display: table-cell;
            }
        }
    `]
    })
export class SecurityComponent implements OnInit {

  currentUser: Auth;
  selectedBeachRisk: Danger;
  filtermunicipio;
  datosPlaya:any = [];
  nomMunicipio;
  altoini: Date;
  prohibida:boolean = true;

  constructor(private authService: AuthGuardService, private service: EsriRequestService) { }

  ngOnInit() {

    this.loadRelatedRecords();
  }

  private horario(id_dgse,mc){
    this.altoini = mc.inputFieldValue;
    console.log(this.altoini);

  }

  private contenido(){
   $('#myModal').modal('show');
  }
  loadRelatedRecords() {
    this.currentUser = this.authService.getCurrentUser();
    this.filtermunicipio = "LOWER(municipio)=LOWER('"+ this.currentUser.username.substring(5,this.currentUser.username.length) +"')";
    this.nomMunicipio = this.currentUser.username.substring(5,this.currentUser.username.length);

      this.service.getEsriDataLayer('https://utility.arcgis.com/usrsvcs/servers/070539cded6d4f5e8aa2ce1566618acd/rest/services/ag17_023_fase_2/playas_catalogo_edicion/FeatureServer/0/query',
          this.filtermunicipio, '*', false, this.currentUser.token).subscribe(
          (result: any) => {
              if (result) {
                  this.datosPlaya = result;
                  console.log(this.datosPlaya.features);
              }
          },
          error => {
              console.log(error.toString());
          }).add(() => {
          console.log('end of request');
      });
  }
}
