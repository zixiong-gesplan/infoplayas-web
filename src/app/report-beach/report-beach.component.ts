import { Component, ElementRef, OnInit,ViewChild } from '@angular/core';
import {AuthGuardService} from '../services/auth-guard.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {AppSettingsService} from '../services/app-settings.service';
import {PopulationService} from '../services/population.service';
import {Auth} from '../models/auth';
import {AppSetting} from '../models/app-setting';
import {Municipality} from '../models/municipality';
import {EsriRequestService} from '../services/esri-request.service';
import {environment} from '../../environments/environment';
import { DomSanitizer,SafeResourceUrl } from "@angular/platform-browser";
import {Incidentactions} from './data/mock-incidentaction';
import {Affecteds} from './data/mock-affected';
import {Chart} from 'chart.js'
import {AppSettings} from '../../app-settings';
import {UtilityService} from '../services/utility.service';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { from } from 'rxjs';
import html2canvas from 'html2canvas';
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';


declare var $: any;
declare var jQuery: any;
declare const aytos: any;
declare var UTMXYToLatLon: any;
declare var RadToDeg: any;
declare function navbar_load();

@Component({
  selector: 'app-report-beach',
  templateUrl: './report-beach.component.html',
  styleUrls: ['./report-beach.component.css']
})

export class ReportBeachComponent implements OnInit {
  doc:any 
  currentUser: Auth;
  filterClasificacion: string;
  filtermunicipio;
  private aytos: AppSetting[];
  nomMunicipio;
  datosPlaya: any = [];
  srcPDF:SafeResourceUrl;
  quater:string = "PRIMER CUATRIMESTRE";
  subscripcionSmunicipality;
  url;

  @ViewChild('chart1') Canvas: ElementRef;
  @ViewChild('chart2') Canvas2: ElementRef;
  constructor(
    private authService: AuthGuardService,
    private spinnerService: Ng4LoadingSpinnerService,
    private appSettingsService: AppSettingsService,
    private popService: PopulationService,
    private service: EsriRequestService,
    public sanitizer:DomSanitizer
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.appSettingsService.getJSON().subscribe(data => {
      this.aytos = data;
      this.loadRecords();
      this.readSmuncipality();
      this.createChart();
    });

   
  }
  loadRecords() {
    this.spinnerService.show();
    const name = this.currentUser.filter ? this.currentUser.filter : this.popService.getMunicipality().user;
    if(this.filterClasificacion){
      this.filtermunicipio = 'municipio = \'' + this.aytos.find(i => i.ayto === name).municipio_minus + '\'' + this.filterClasificacion;
    }else{
        this.filtermunicipio = 'municipio = \'' + this.aytos.find(i => i.ayto === name).municipio_minus + '\'';
    }
    this.nomMunicipio = this.aytos.find(i => i.ayto === name).municipio_minus;
    this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_url + '/query',
        this.filtermunicipio, '*', false, this.currentUser.token, 'clasificacion', true).subscribe(
        (result: any) => {
            if (result) {
                this.datosPlaya = result.features.map( playa => {
                      return {id_dgse: playa.attributes.id_dgse, 
                              nombre_municipio:playa.attributes.nombre_municipio
                            }
                    });
                this.spinnerService.hide();
                this.srcPDF = this.sanitizer.bypassSecurityTrustResourceUrl(this.generatePDF());
            }
        },
        error => {
            console.log(error.toString());
            this.spinnerService.hide();

        }).add(() => {
        console.log('end of request');
    });
  } 
  readSmuncipality() {
    this.subscripcionSmunicipality = this.popService.sMunicipality$.subscribe(
        (result: Municipality) => {
            if (result.user) {
                this.currentUser = this.authService.getCurrentUser();
                // recargamos datos y formularios
                //this.loadDataForms();
                this.loadRecords();
            }
        },
        error => {
            console.log(error.toString());
        });
  }
  private createChart(){
    var affectedByGenre = [];
    Affecteds.forEach( report =>{
      var gender = report['gender']
      affectedByGenre[gender] = (affectedByGenre[gender] || 0) +1;
    })
    var context = this.Canvas.nativeElement.getContext('2d');
    new Chart(context,
      {
        type:'pie',
        data: {
          labels: ['Mujeres','Hombres'],
          datasets: [{
            backgroundColor: ["#8e5ea2", "#3e95cd"],
            data:[affectedByGenre['female'],affectedByGenre['male']]
          }]
        }
      })
    var labelsAge = ["0-10","10-20","20-35","35-50","50-60","+65"]
    var affectedByAge = [0,0,0,0,0,0]
    Affecteds.forEach(report =>{
      var age = report['age'];
      switch (true){
        case age<10:
          affectedByAge[0]++;
          break;
        case age<20:
          affectedByAge[1]++;
          break;
        case age<35:
          affectedByAge[2]++;
          break;
        case age<50:
          affectedByAge[3]++;
          break;
        case age<65:
          affectedByAge[4]++;
          break;
        default:
          affectedByAge[5]++;
      }

    })
    var context = this.Canvas2.nativeElement.getContext('2d');
    context.save();
    new Chart(context,
      {
        type:'bar',
        data: {
          labels: labelsAge,
          datasets: [{
            label:"Reportes por Edades",
            backgroundColor: ["red", "blue", "green", "blue", "red", "blue"], 
            data:affectedByAge
          }]
        }
      })
  }
  private portrail(){
    //var centerPageHeight = this.doc.internal.pageSize.height/2
    //var centerPageWidth = this.doc.internal.pageSize.width/2
    var heigth = 12
    var textWitdh = this.doc.getTextWidth("INFORME CUATRIMESTRAL DE INCIDENCIAS EN PLAYAS Y ZBM" + name);
    var margenWitdh = (this.doc.internal.pageSize.width - textWitdh)/2;

    var title =  this.doc.splitTextToSize( "INFORME CUATRIMESTRAL DE INCIDENCIAS EN PLAYAS Y ZBM" ,180);
    this.doc.setFillColor(40, 102, 224);
    this.doc.rect(margenWitdh +8, 5, textWitdh -15, 10, 'F')
    this.doc.setTextColor(255, 255, 255);
    var img = new Image();
    img.src = "../../assets/images/logos/logo.png";
    this.doc.addImage(img, 'png', this.doc.internal.pageSize.width - margenWitdh, 5, 10, 10);
    this.doc.text(title,margenWitdh +10,heigth);

    heigth +=15;
    this.doc.setFontSize(12);

    this.doc.setTextColor(0, 0, 0);
    var name = this.currentUser.filter ? this.currentUser.filter : this.popService.getMunicipality().user;
    name = name.toUpperCase();
    textWitdh = this.doc.getTextWidth("MUNICIPIO: " + name);
    margenWitdh = (this.doc.internal.pageSize.width - textWitdh)/2;
    this.doc.text("MUNICIPIO: " + name,20,heigth);

    //heigth +=10;
    textWitdh = this.doc.getTextWidth(this.quater);
    margenWitdh = (this.doc.internal.pageSize.width - textWitdh)/2;
    this.doc.text(this.quater,100,heigth);


    //heigth +=10;
    var today = new Date();
    var fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth( fourMonthsAgo.getMonth() -4);
    var text = "FECHA: " +fourMonthsAgo.getDay() +"/"+ fourMonthsAgo.getMonth() +"/"+fourMonthsAgo.getFullYear() +" AL "+ today.getDay() +"/"+ today.getMonth()+"/"+today.getFullYear()
    textWitdh = this.doc.getTextWidth(text);
    margenWitdh = (this.doc.internal.pageSize.width - textWitdh)/2;
    this.doc.text(text,200,heigth);

    this.doc.addPage()
  }

  private beachList() {
    this.doc.text("LISTADO DE PLAYAS Y ZONAS DE BAÑO MARITIMAS:", 10, 10)
    this.doc.autoTable({
      head:[['ID_DGSE','NOMBRE','HORARIO SOCORRISTAS','EMPRESA SOCORRISMO', 'AFLUENCIA','RIESGO','PROTECCIÓN']],
      body:this.datosPlaya.map( playa =>[playa.id_dgse, playa.nombre_municipio]),
      startY: 15,
    })
    this.doc.addPage()
  }

  private reportList(){
    this.doc.text("Incidencias del cuatrimestre", 10, 10)
    this.doc.autoTable({
      head:[['Nº REGISTRO','BANDERA','SITUACIÓN','FECHA', 'ALARMA','MÉTODOS EMPLEADOS','Nº SOCORRISTAS','PERSONAS AFECTADAS', 'HORA \nNOTIFICACIÓN \nCECOES','Nº INCIDENCIA\nCECOES','TIEM\nPO DE LLEGADA (mins)', 'MEDIOS \nMOVILIZADOS','CUERPOS MOVILIZADOS','EVACUACIÓN']],
      body:Incidentactions.map( report =>{
        return [report["ID"],null,null,report["Fecha emision"],report["Emisor de Alarma"],"--",report["Numero de Socorristas"],report['N. Personas Afect.'],"--",report['CECOES'],report['T. llegada medios Ext.'],"--","--",report['Evacuacion']]
        
      }),
      columnStyles:{ 
        StyleDef:{fontStyle:8}
      },
      startY: 15,
    })
    this.doc.addPage()
  }

  private affectedList(){
    this.doc.text("Personas afectadas del cuatrimestre", 10, 10)
    this.doc.autoTable({
      head:[['ID','GENERO','EDAD','PAIS ORIGEN', 'MUNICIPIO','PERFIL','TIPO DE INTERVENCIÓN','GRADO DE EMERGENCIA', 'CENTRO DE TRASLADO','PRIMEROS AUXILIOS','ALTA VOLUNTARIA','DESFIBRILADOR']],
      body:Affecteds.map( report =>{
        var genero = (report['gender'] =='male') ? "Hombre": "Mujer";
        var primeroAux = (report['requireFirstAid']) ? "Sí":"No";
        var alta = (report['highVolunteer']) ? "Sí": "No";
        var desfibrilador = report['usedDesa'] ? "Sí" : "No";
        return [report["ID"],genero,report['age'],report['country'],report['Municipio'],report['profile'],report['typeIntervention'],report['emergencyGrade'],report['translationCenter'],primeroAux,alta,desfibrilador]
      }),
      startY: 15,
    })
    this.doc.addPage()
  }
  private charts(){
    this.doc.text("Análisis de los Informes", 10, 10)
    //var data = this.Canvas.nativeElement.toDataURL();
    //var img = new Image();
    //img.src = data;
    this.doc.addImage(this.Canvas.nativeElement,'png',0,15,130,80)
    this.doc.addImage(this.Canvas2.nativeElement,'png',135,15,130,80)
  }

  private generatePDF(){
    //var height=20;
    this.doc = new jsPDF('landscape')
    this.doc.page=1;

    this.portrail();
    this.beachList();
    this.reportList();
    this.affectedList();

    this.charts();

    return this.doc.output('datauristring');
  }

  setQuater(quater){
    this.quater=quater;
    this.srcPDF = this.sanitizer.bypassSecurityTrustResourceUrl(this.generatePDF());

  }
}
