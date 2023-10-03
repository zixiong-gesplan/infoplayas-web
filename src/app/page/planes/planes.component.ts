import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent implements OnInit {
  urlMap: SafeResourceUrl;
  dashboardUrl ="https://gesplangis.es/arcgis/apps/dashboards/ce89c3a6cb6a4f87b47b94a9b74b2162"
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if(environment.production){
      this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl('https://www3-pre.gobiernodecanarias.org/aplicaciones/infoplayas/planos')
    }else{
      this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.infoplayascanarias.es/planos/')
    }
  }
  copyClipBoard(){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = `
    <iframe width="100%" height="650" title="Accesos, riesgos, instalaciones y equipamientos"
      src="${this.dashboardUrl}">
    </iframe>
    `
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
