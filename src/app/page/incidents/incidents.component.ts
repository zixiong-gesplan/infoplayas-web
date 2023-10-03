import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Beach, BeachProvider } from 'src/app/provider/beach';
import { Incident, IncidentProvider } from 'src/app/provider/incident';
import { UserProvider } from 'src/app/provider/user';

import { ConfigProvider } from 'src/app/provider/config';
import * as L from 'leaflet';
import leafletImage from 'leaflet-image';
import { FormBuilder, Validators } from '@angular/forms';
import { Affected } from 'src/app/provider/affected';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.css']
})
export class IncidentsComponent implements OnInit,AfterViewChecked {
  quarter:string;
  year: number = new Date().getFullYear();
  yearRange:number[] = [this.year -4, this.year -3, this.year -2, this.year -1, this.year].reverse(); 
  municipality:string;
  beachs:Beach[];
  incident:Incident = new Incident();
  affected: Affected = new Affected();
  showPerson = false;
  indexPerson:number = 0;

  constructor(
    private userProvider:UserProvider,
    private beachProvider:BeachProvider,
    private incidentProvider:IncidentProvider,
    private configProvider: ConfigProvider
    ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.configProvider.getMotivosData();
      await this.configProvider.getPeligrosData();
      await this.configProvider.getAlarmantesData();
      await this.configProvider.getMediosData();
      await this.configProvider.getExternosData();
      await this.configProvider.getMotivosEvacuacionData();
      await this.configProvider.getCuerposData();
      await this.configProvider.getSustanciasData();
      await this.configProvider.getPerfilesData();
      await this.configProvider.getMotivosRescateData();
      await this.configProvider.getMotivosAuxilioData();
      await this.configProvider.getTrasladosData();
      await this.configProvider.getMunicipiosData();
      await this.configProvider.getPaisesData();
      await this.configProvider.getGeneralConfigData();

      this.municipality = this.userProvider.user.municipalities[0].name || 'Adeje'
      this.quarter = "PRIMER CUATRIMESTRE";
      await this.beachProvider.getAll();
      this.beachs = this.beachProvider.filter(this.municipality);

      await this.incidentProvider.getAll(this.municipality);
      
      this.beachs.forEach( beach =>{
        let incidents = this.incidentProvider.incidents.filter( item => item.beachName == beach.name )
        beach.incidents = incidents || [];
        beach.affectedPeople = [];
        incidents.forEach( inc =>{
          beach.affectedPeople =[...beach.affectedPeople, ...inc.affectedPeople]
        })
      })
      this.beachs.sort( (a,b) => a.DGSE.localeCompare(b.DGSE))
    } catch (error) {
      //console.log(error)
    }

  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if(!this.beachs){return}
    this.beachs.map( async (beach,index)=>{
      try {
        if(!beach.incidents || beach.incidents.length <=0) return;
        let map = L.map(`map${index}`,{
          center: [beach.latitude,beach.longitude],
          zoom: 16.5,
          zoomControl: false
        })
        const tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',{
          maxZoom:50,
          accessToken: 'pk.eyJ1IjoiemxpbnlhbiIsImEiOiJja2p2aWcwbXIwOWFxMm9tcnQzM3Q3MnYzIn0.cIFbv3dN52qkiVuuHW--EA',
          id: 'mapbox/streets-v11',
        })
        tiles.addTo(map)

        beach.incidents.map( incident =>{
          let {pointLocation} = incident;

          let icon = this.getIcon(incident.type)

          //var mark = L.marker(pointLocation,{ icon: icon})
          //mark.addTo(map)         
        })
        setTimeout(() => {
          leafletImage( map,(error, canvas)=>{
            if (error) return;
            beach.img = canvas.toDataURL('png');
            var img = document.createElement('img')
            var dimensions = map.getSize();
            img.width = dimensions.x;
            img.height = dimensions.y;
            img.src = beach.img
            var container = document.getElementById(`imagen${index}`)
            container.innerHTML='';
            container.appendChild(img)
          })
        }, 1000);

      } catch (error) {
        //console.log(error)
      }
    })
    
  }

  private getIcon(type:number){
    let greenIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      iconSize:     [16, 50], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
    });
    let orangeIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
      iconSize:     [16, 50], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
    });
    let blueIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      iconSize:     [16, 50], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
    });
    let redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      iconSize:     [16, 50], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
    });
    let icons = [greenIcon,blueIcon,orangeIcon,redIcon]

    return icons[type]
  }

  setYear(event:Event){
    let selectedYear = (event.target as HTMLSelectElement).value;
    this.year= parseInt(selectedYear);
  }
  
  setQuarter(quarter){
    this.quarter = quarter;
  }

  createIncident(id, latitude, longitude){
    let dateNow = new Date()
    //document.body.style.top = `-${window.scrollY}px`; 
    document.body.style.top = `-${window.scrollY}px`; 
    this.incident = new Incident();
    this.incident.beachName = id
    this.incident.pointLocation= `POINT( ${longitude} ${latitude})` ;
    this.incident.lat = latitude;
    this.incident.lng = longitude;
    this.incident.dateIni = dateNow;
    this.incident.adviser = this.userProvider.user.id;
    document.getElementsByTagName("header")[0].style.display="none"
    document.getElementsByTagName('header')[0].style.zIndex="-1";
    let modal = document.querySelector('#modal') as HTMLDivElement;
    modal.style.display ='flex'
    modal.style.zIndex="99";
  }

  close(){
    const scrollY = document.body.style.top;
    delete this.incident 
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
    document.getElementsByTagName("header")[0].style.display=""
    let modal = document.querySelector('#modal') as HTMLDivElement;
    modal.style.display ='none'
    modal.style.zIndex="-1";

  }
  
  setSituacion(value:number){
    this.incident.type = value;
  }

  active(event){
    let button = document.querySelector('.active');
    if(button){
      button.classList.remove('active')
    }
    event.target.value.classList.add('active');
  }

  async sendIncident(){
    //console.log(this.incident)
    try{
      await this.incidentProvider.sendIncident(this.incident)
      this.close();
    }catch (e){
      document.querySelector('#msgError').innerHTML="Error en el envio de datos"
      let dateInitInput = document.querySelector('#dateInit') as HTMLInputElement;
      if(!dateInitInput.value) dateInitInput.classList.add("error")
    
      if(this.incident.type != 0){
        let dateEndInput = document.querySelector('#dateEnd') as HTMLInputElement;
        if(!dateEndInput.value) dateEndInput.classList.add("error")
      }
      
      let dayInput = document.querySelector('#day') as HTMLInputElement;
      if(!dayInput.value) dayInput.classList.add("error")


      let evacuationInput = document.querySelector('#evacuation') as HTMLSelectElement;
      if(!evacuationInput.value) evacuationInput.classList.add("error")

      let alarmSenderInput = document.querySelector('#alarmSender') as HTMLSelectElement;
      if(!alarmSenderInput.value) alarmSenderInput.classList.add("error")

      let resourcesInput = document.querySelector('#resources') as HTMLSelectElement;
      if(!resourcesInput.value) resourcesInput.classList.add("error")

      if(this.incident.type == 0 || this.incident.type == 2){
        let numberLifeGuardInput = document.querySelector('#numberLifeGuard') as HTMLInputElement;
        if(!numberLifeGuardInput.value) numberLifeGuardInput.classList.add("error")
      }
      if(this.incident.type == 1 || this.incident.type == 2){
        let externalResourcesSelect = document.querySelector('#externalResources') as HTMLSelectElement;
        if(!externalResourcesSelect.value) externalResourcesSelect.classList.add("error")
      }
      if(this.incident.type == 3){
        let mobilizedAgentsSelect = document.querySelector('#mobilizedAgents') as HTMLSelectElement;
        if(!mobilizedAgentsSelect.value) mobilizedAgentsSelect.classList.add("error")
      }
    }

  }
  updateAffectedPeople(event){
    this.incident.affectedPeople = []
    if(this.incident.affectedPeopleNumber <=0){
      return
    }
    for(let i = 0; i< this.incident.affectedPeopleNumber;i++){
      this.incident.affectedPeople.push(new Affected())
    }
  }

  updateAffected(params){
    this.affected ={
      ...this.affected,
      ...params
    }
  }

  updateSubstances(id){
    if(this.affected.substance.includes(id)){
      let index = this.affected.substance.indexOf(id)
      this.affected.substance.splice(index, 1)
      return;
    }
    this.affected.substance.push(id)
    return;
  }

  editPerson(index){
    /**Actualizar el valor de la persona que se esta editando
     * Antes de cambiar de persona
     * 
     */
    this.incident.affectedPeople[this.indexPerson] = this.affected;
    /** cambio de persona en el formulario */
    this.affected = this.incident.affectedPeople[index];
    this.indexPerson = index;
    this.showPerson = true;
  }
  saveAffected(){
    this.incident.affectedPeople[this.indexPerson] = this.affected;
    /** reseteo de persona en el formulario */
    this.affected = new Affected();
    this.indexPerson = -1;
    this.showPerson = false;
  }
}
