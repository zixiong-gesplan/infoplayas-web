import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment'
import { UserProvider } from './user';

let reportURL = environment.SERVER_URL+"api/action/report";


export class Report{
    
  //Conclusiones
  conclutions:string;
  //Año
  year:number;
  //Cuatrimestre
  quarter:number;
  //Nombre del fichero
  reportName:string; 
  //Blob del fichero
  reportBlob:string; 
}

@Injectable()
export class ReportProvider {
  private http = inject(HttpClient);
  private userProvider = inject(UserProvider);


  report:Report;
  private formData(myFormData){
    return Object.keys(myFormData).map(function(key){
        return encodeURIComponent(key) + '=' + encodeURIComponent(myFormData[key]);
    }).join('&');
}
  // async sendFile( report = {
  //   conclutions:"",
  //   year:0,
  //   quarter:0,
  //   fileData:new File([],'no_file'),
  //   reportName:"",
  //   reportBlob:"" || new ArrayBuffer(0)
  // }){
  //   if(
  //     report.conclutions== "" ||
  //     report.year==0          ||
  //     report.quarter==0       ||
  //     report.reportName == ""
  //   ){
  //     alert("Error en los datos")
  //     return;
  //   }

    async sendFile(fileData){
    
    //console.log(this.userProvider.user)
      // console.log(fileData)
    try {
      let headers = new HttpHeaders({'Content-Type': 'application/json'});
      let response = await this.http.post(
        reportURL+'?access_token='+this.userProvider.user.access_token,
        {fileData}, //body
        {headers:headers} //header
        ).toPromise()
        
    } catch (error) {
      console.log(error);

    }

  }

  async sendFormData(formData:FormData){
    let response = await this.http.post(
      reportURL+'?access_token='+this.userProvider.user.access_token,
      formData,
      {}
    )
  }
}

