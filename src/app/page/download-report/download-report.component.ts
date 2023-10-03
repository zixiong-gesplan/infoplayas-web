import { Component, OnInit } from '@angular/core';
import { PdfProvider } from '../../provider/pdf';


@Component({
  selector: 'app-download-report',
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.css']
})
export class DownloadReportComponent implements OnInit {

  files: any = [];
  
  constructor(private pdfProvider: PdfProvider,) { }
  year  = new Date(Date.now()).getFullYear();
  range = [this.year , this.year -1, this.year -2, this.year -3, this.year -4]
  async ngOnInit() {
    await this.pdfProvider.getReports()
    console.log(this.pdfProvider.pdfs)
    this.files =  this.pdfProvider.pdfs.sort( ( a,b )=>{
      if(a.ayto < b.ayto){
        return 1;
      }else {
        return -1
      }
    })
    this.files = this.pdfProvider.pdfs.filter( report => report.year == this.year)
  }

  setYear(year){
    this.year = year;
    this.files = this.pdfProvider.pdfs.filter( report => report.year == this.year);
  }

  async getFile(pdfName){
    console.log(pdfName)

    await this.pdfProvider.download(pdfName);

    // if(url != null){
    //   this.reportService.download(url)
    // }
  }
}
