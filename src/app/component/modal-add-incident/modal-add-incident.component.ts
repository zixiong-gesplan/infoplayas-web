import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
// import 'leaflet.markercluster'
import leafletImage from 'leaflet-image';
import { Incident } from "../../provider/incident";
import { Affected } from "../../provider/affected";
import { UntypedFormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { NgStyle, NgClass, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-modal-add-incident',
    templateUrl: './modal-add-incident.component.html',
    styleUrls: ['./modal-add-incident.component.css'],
    standalone: true,
    imports: [FormsModule, NgStyle, NgClass, DecimalPipe]
})
export class ModalAddIncidentComponent implements OnInit {

  filterClasificacion: string;
  filtermunicipio;
  nomMunicipio;
  datosPlaya: any = [];
  quarter:string = "PRIMER CUATRIMESTRE";
  subscripcionSmunicipality;
  mapView: any;
  playas;
  //map;
  evacuationList:any = [];
  alarmSenderList:any;
  resourcesList:any = [];
  externalResourcesList:any =[];
  mobilizedAgentsList:any = [];
  countries:any;
  municipalities:any;
  substances:any = [];
  profiles:any;
  rescues:any =[];
  first_aid_causes:any = [];
  first_aid:any = [];
  translation_center:any;
  indexPerson:number = 0;
  isResident:boolean;
  year: number = new Date(Date.now()).getFullYear();
  range:any = [];
  //@ViewChild("map") mapViewEl: ElementRef;
  newIncident:Incident = new Incident();
  affectedPeople: Affected = new Affected();
  showPerson = false;
  dgse: number;
  requireRescue = false;

  loaded = false;
  reportForm: UntypedFormGroup;

  greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize:     [16, 50], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
  });
  orangeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    iconSize:     [16, 50], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
  });
  blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize:     [16, 50], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
  });
  redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize:     [16, 50], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
  });


  constructor(

  ) {}

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.


  }

  //Setters para el filtro de las incidencias
  setYear(year){
    this.year = year;
    // this.getIncidents({ municipio:this.nomMunicipio,
    //   year: this.year,
    //   quarter: (this.quarter == "PRIMER CUATRIMESTRE") ? 1:
    //             (this.quarter == "SEGUNDO CUATRIMESTRE") ? 2: 3
    // })
  }

  setQuarter(quarter){
    this.quarter=quarter;
    // this.getIncidents({ municipio:this.nomMunicipio,
    //   year: this.year,
    //   quarter: (this.quarter == "PRIMER CUATRIMESTRE") ? 1:
    //             (this.quarter == "SEGUNDO CUATRIMESTRE") ? 2: 3
    // })
  }

  setSituacion(situacion){
    document.querySelectorAll('.invalid').forEach(item => {
      item.classList.remove('invalid')
    });    
    var {beach} = this.newIncident;
    this.newIncident = new Incident()
    this.newIncident ={
      ...this.newIncident,
      beach,
      type : situacion
    }
    for(var i  = 0; i<this.resourcesList.length;i++){
      this.resourcesList[i].selected = false;
    }

    for(var i = 0; i< this.externalResourcesList.length;i++){
      this.externalResourcesList[i].selected = false;

    }
    for(var i = 0; i < this.mobilizedAgentsList.legnth;i++){
      this.mobilizedAgentsList[i].selected = false
    }
  }
  //Creacion de la incidencia
  createIncident(dgse,latitud,longitud){
    document.body.style.top = `-${window.scrollY}px`; 
    this.newIncident.beach = dgse
    this.newIncident.lat=latitud;
    this.newIncident.lng=longitud;
    document.body.style.position = 'fixed';
    document.getElementsByTagName("header")[0].style.display="none"

  }
  //Envío de la incidencia a la base de daos
  sendIncident(){
    // this.newIncident.adviser = this.istac_code;
    this.newIncident.affectedPeople[this.indexPerson] = this.affectedPeople;
    
    // var validator = IncidentValidator(this.newIncident);


    // validator.dateIni ? document.getElementsByName('date_init')[0].classList.add('invalid') : document.getElementsByName('date_init')[0].classList.remove('invalid')
    // validator.day ? document.getElementsByName('day')[0].classList.add('invalid'): document.getElementsByName('day')[0].classList.remove('invalid');

    // validator.alarmSender ? document.getElementsByName('alarm_sender')[0].classList.add('invalid'): document.getElementsByName('alarm_sender')[0].classList.remove('invalid')

    // validator.resourcesUsed ? document.getElementsByName('resources')[0].classList.add('invalid'): document.getElementsByName('resources')[0].classList.remove('invalid')

    
    // if(this.newIncident.type > 0){
    //   validator.dateEnd ? document.getElementsByName('date_end')[0].classList.add('invalid'): document.getElementsByName('date_end')[0].classList.remove('invalid');
    // }
    // if(this.newIncident.type == 1 || this.newIncident.type ==2){
    //   validator.externalResourcesUsed  ? document.getElementsByName('external')[0].classList.add('invalid'): document.getElementsByName('external')[0].classList.remove('invalid')

    // }

    // if(this.newIncident.type > 0){
    //   validator.isLifeGuardCall ? document.getElementsByName('isLifeGuardCall')[0].classList.add('invalid'): document.getElementsByName('isLifeGuardCall')[0].classList.remove('invalid');
    //   validator.hourCall112 ? document.getElementsByName('hourCall112')[0].classList.add('invalid'): document.getElementsByName('hourCall112')[0].classList.remove('invalid');
    //   validator.delayArriveExternalResources ?  document.getElementsByName('delay')[0].classList.add('invalid'): document.getElementsByName('delay')[0].classList.remove('invalid');
    // }
    // if(this.newIncident.type == 0 || this.newIncident.type == 2){
    //   validator.numberLifeGuard ? document.getElementsByName('numberLifeGuard')[0].classList.add('invalid') : document.getElementsByName('numberLifeGuard')[0].classList.remove('invalid');
    // }
    // if(this.newIncident.type==3){
    //   validator.mobilizedAgents ? document.getElementsByName('mobilizedAgents')[0].classList.add('invalid') : document.getElementsByName('mobilizedAgents')[0].classList.remove('invalid');
    // }
    // var all_done = true 
    // for(var index in validator){
    //   if(validator[index]){
    //     all_done = false;
    //     break;
    //   }
    // }
    if(this.newIncident.affectedPeopleNumber > 0){
      this.newIncident.affectedPeople.map( affected =>{
        //  all_done = all_done && affected.valid
      })
    }

   //  if(all_done){

      // this.reportService.sendIncident(this.newIncident)

     // this.close();
      alert(
        `La Incidencia ha sido registrada.\n
        Solo aparecerá en la lista SÍ ha habido como mínimo una víctima grave o muy grave.
        Sí solo han sido incidencias leves o poco graves, no aparecerá.
        `)
      // this.getIncidents({ municipio:this.nomMunicipio,
      //                     year: this.year,
      //                     quarter: (this.quarter == "PRIMER CUATRIMESTRE") ? 1:
      //                               (this.quarter == "SEGUNDO CUATRIMESTRE") ? 2: 3
      // })
      
    // }

    
  }
  //Método para guardar al afectaqdo de la incidencia
  saveAffected(){

    document.querySelectorAll('.invalid').forEach( item =>{
      item.classList.remove('.invalid')
    })

    // var validator = AffectedPeopleValidator(this.affectedPeople) 
    // validator.gender ?  document.getElementsByName('gender')[0].classList.add('invalid') : document.getElementsByName('gender')[0].classList.remove('invalid');
    // validator.country ? document.getElementsByName('country')[0].classList.add('invalid') : document.getElementsByName('country')[0].classList.remove('invalid');
    // validator.emergencyGrade ? document.getElementsByName('emergency_grade')[0].classList.add('invalid'): document.getElementsByName('emergency_grade')[0].classList.remove('invalid');
    // validator.substance ? document.getElementsByName('substances')[0].classList.add('invalid') : document.getElementsByName('susbtances')[0].classList.remove('invalid');
    // validator.profile ? document.getElementsByName('profile')[0].classList.add('invalid') : document.getElementsByName('profile')[0].classList.remove('invalid')
    // if(this.affectedPeople.typeIntervention != 'Primeros Auxilios'){
    //   validator.rescueReason ? document.getElementsByName('rescue')[0].classList.add('invalid') : document.getElementsByName('rescue')[0].classList.remove('invalid');
    // }
    // if(this.affectedPeople.typeIntervention == 'Primeros Auxilios' || this.affectedPeople.requireFirstAid){
    //   validator.firstAidCauses ? document.getElementsByName('causes')[0].classList.add('invalid') : document.getElementsByName('causes')[0].classList.remove('invalid');
    //   validator.firstAidReason ? document.getElementsByName('reasons')[0].classList.add('invalid') : document.getElementsByName('reasons')[0].classList.remove('invalid');
    //   validator.rescueReason= false;
    // }
    // validator.usedDesa ? document.getElementsByName('desa')[0].classList.add('invalid') : document.getElementsByName('desa')[0].classList.remove('invalid');
    // validator.translationCenter ? document.getElementsByName('translation')[0].classList.add('invalid') : document.getElementsByName('translation')[0].classList.remove('invalid');
    // validator.highVolunteer ? document.getElementsByName('high_volunteer')[0].classList.add('invalid') : document.getElementsByName('high_volunteer')[0].classList.remove('invalid');
    // var all_done = true 
    // for(var index in validator){
      
    //   if(validator[index]){
    //     alert(index)
    //     all_done = false;
    //     break;
    //   }
    // }

    // if(all_done){
    //   //this.affectedPeople.valid=true;
    //   this.newIncident.affectedPeople[this.indexPerson] = this.affectedPeople;
    //   //this.newIncident.affectedPeople[this.indexPerson].valid = true;

    // }
    if(this.indexPerson+1  < this.newIncident.affectedPeopleNumber){
      
      this.indexPerson = this.indexPerson +1;
      this.affectedPeople = new Affected();
    }
  }
  
  editPerson(index_person){
    document.querySelectorAll('.invalid').forEach( item =>{
      item.classList.remove('invalid')
    })

    this.newIncident.affectedPeople[this.indexPerson] = this.affectedPeople;
    this.affectedPeople = this.newIncident.affectedPeople[index_person];
    this.indexPerson = index_person;
    this.showPerson = true;

    this.substances.forEach(element => {
      element.selected = false
    });
    this.rescues.forEach(element => {
      element.selected = false
    });
    
    this.first_aid_causes.forEach(element => {
      element.selected = false
    });
    
    this.first_aid.forEach(element => {
      element.selected = false
    });


  }

  close(){
    const scrollY = document.body.style.top;
    this.newIncident = new Incident()
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
    document.getElementsByTagName("header")[0].style.display=""
    this.affectedPeople = new Affected()

  }


}
