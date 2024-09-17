import { HttpClient } from "@angular/common/http";

import { Injectable, inject } from "@angular/core";
import { Affected } from "./affected";

import { environment } from "../../environments/environment";
import { UserProvider } from "./user";

const reportUrl = `${environment.SERVER_URL}api/core/quarterlyreports`;
const pdfDownloadUrl = `${environment.SERVER_URL}api/core/pdf`;
export class Pdf {
  year:number;
  quarter:number;
  report:string;
  ayto:string
}


@Injectable({
  providedIn: 'root',
})
export class PdfProvider{
  private http = inject(HttpClient);
  private userProvider = inject(UserProvider);

  pdfs: Pdf[];

  async getReports(){
    let response = await this.http.get(`${reportUrl}?access_token=${this.userProvider.user.access_token}`).toPromise()
    this.save(response)
  }

  async download(pdfName){
    let response = await this.http.get(
          `${pdfDownloadUrl}?access_token=${this.userProvider.user.access_token}&name=${pdfName}`,{
            headers:{
              'Accept':'application/pdf'
            },
            responseType:'blob'
          }).toPromise()
    console.log(response)
    const file = new Blob([response], {type: 'application/pdf'});
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank', 'width=1000, height=800');
  }

  save(json){
    this.pdfs = json.map(item =>{
      let ayto = item.report.split("_").pop();
      ayto = ayto.slice(0, -4)

      return {
        ...item,
        ayto: ayto
      }
    });

    // this.pdfs = json.reduce((acc, item) =>{
    //   let index = item.quarter-1
    //   let ayto = item.report.split("_").pop()
    //   ayto = ayto.slice(0, -4)
    //   if(acc[ayto]){
    //     acc[ayto][index] = item.report
    //     return acc
    //   }
    //   acc[ayto] = []
    //   acc[ayto][index] = item.report
    //   return acc

    // })
  }
}