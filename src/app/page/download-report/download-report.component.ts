import { Component, OnInit, inject } from '@angular/core';
import { PdfProvider } from '../../provider/pdf';
import { NavbarComponent } from '../../component/navbar/navbar.component';

import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-download-report',
    templateUrl: './download-report.component.html',
    styleUrls: ['./download-report.component.css'],
    standalone: true,
    imports: [NavbarComponent, FormsModule]
})
export class DownloadReportComponent implements OnInit {
  private pdfProvider = inject(PdfProvider);


  files: any = [];
  year  = new Date(Date.now()).getFullYear();
  range = [this.year , this.year -1, this.year -2, this.year -3, this.year -4]
  async ngOnInit() {
    await this.pdfProvider.getReports()
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

    await this.pdfProvider.download(pdfName);

    // if(url != null){
    //   this.reportService.download(url)
    // }
  }
}
