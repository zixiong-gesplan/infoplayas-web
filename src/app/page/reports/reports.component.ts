import { AfterViewChecked, Component, OnChanges, OnInit } from '@angular/core';
import { Beach, BeachProvider } from 'src/app/provider/beach';
import { IncidentProvider } from 'src/app/provider/incident';
import { UserProvider } from 'src/app/provider/user';
import { ReportProvider } from 'src/app/provider/report';

import { PdfService } from 'src/app/service/pdf.service';

import * as Chart from 'chart.js';

import * as L from 'leaflet';
import leafletImage from 'leaflet-image';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit,AfterViewChecked {
  quarter:string;
  year: number;
  yearRange:number[];
  municipality:string;

  beachs:Beach[];
  conclutions: string;

  uploadFile:boolean;
  reader:FileReader;
  private fileName: string;
  private fileBlob;
  private file: File;
  cd: any;
  doc;
  fileData:{
    base64textString:string,
    year:number,
    quarter:number,
    conclutions:string,
    name:string
  } = {
    base64textString:"",
    year:0,
    quarter:0,
    conclutions:"",
    name:""
  }
  constructor(
    private userProvider:UserProvider,
    private beachProvider:BeachProvider,
    private incidentProvider:IncidentProvider,
    private reportProvider : ReportProvider,
    private pdfService: PdfService
  ) { 
  }

  async ngOnInit(): Promise<void> {
    this.municipality = this.userProvider.user.municipalities[0].name || 'Adeje'
    this.quarter = "PRIMER CUATRIMESTRE";
    this.year = new Date().getFullYear()
    this.yearRange= [this.year -4, this.year -3, this.year -2, this.year -1, this.year].reverse()
    this.uploadFile = false;
    this.conclutions="";
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

  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.beachs.map( async (beach,index)=>{
      try {
        if(beach.incidents.length <=0) return;
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
          //pointLocation => "POINT(28.977176 -13.52271)"
          let {pointLocation} = incident;
          let [longitude,latitude] = pointLocation.replace("POINT(","").replace(")","").split(" ")
          let icon = this.getIcon(incident.type)

          var mark = L.marker([
            longitude,latitude
          ],{ icon: icon})
          mark.addTo(map)         
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
            var container = document.getElementById(`image${index}`)
            container.innerHTML='';
            container.appendChild(img)
          })
        }, 1000);

      } catch (error) {
        console.log(error)
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

  onSearchChange(event){
    let conclutions = event.target.value;
    this.conclutions = conclutions;    
  }

  async getPDF(){
    if(this.conclutions==""){
      alert("Es necesario rellenar el campo de Conclusiones")
      return
    }

    if(this.uploadFile && confirm("Ya descargaste el PDF, ¿quieres descargarlo otra vez?") == false){
      return;
    }

    this.pdfService.createPDF({
      municipality:this.municipality,
      quarter: this.quarter,
      year: this.year,
      beachs: this.beachs,
      conclutions: this.conclutions
    })
    this.uploadFile = true;
  }

  onFileChange(event){
    let file = event.target.files[0];
    if(file){
      let reader = new FileReader();
      reader.onload = (event) =>{
        let binaryString = event.target.result as string;
        this.fileData.base64textString = btoa(binaryString)
        // console.log(this.fileData)
        //this.fileData.base64textString = btoa(binaryString);
      }//this._handeReaderLoaded.bind(this);
      reader.readAsBinaryString(file)
    }
   }
  sendFile(){
    let quarter = (this.quarter == "PRIMER CUATRIMESTRE") ? 1:
                 (this.quarter == "SEGUNDO CUATRIMESTRE") ? 2: 3
    this.fileData.year=this.year
    this.fileData.quarter=quarter
    this.fileData.conclutions=this.conclutions
    this.fileData.name=`${this.year}_${this.quarter.replace(" ","_")}_${this.municipality.replace(" ","_")}.pdf`
    try {
      this.reportProvider.sendFile(this.fileData)
      alert("Se ha subido con exito")
    } catch (error) {
      alert('Problema al subir el archivo, intente reducir el tamaño del PDF')
    }
  }


    // this.reportProvider.sendFile({
    //   conclutions:this.conclutions,
    //   year:this.year,
    //   quarter:quarter,
    //   fileData:this.file,
    //   reportName:this.fileName,
    //   reportBlob:this.fileBlob
    // })
}