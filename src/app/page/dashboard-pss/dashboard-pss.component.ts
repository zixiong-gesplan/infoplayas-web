import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-pss',
  templateUrl: './dashboard-pss.component.html',
  styleUrls: ['./dashboard-pss.component.css']
})
export class DashboardPssComponent {
  urlMap: SafeResourceUrl;
  dashboardUrl ="https://gesplangis.es/arcgis/apps/dashboards/88126077dbd64972b14e890d0afd73cd"
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if(environment.production){
      this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl('https://gesplangis.es/arcgis/apps/dashboards/88126077dbd64972b14e890d0afd73cd')
    }else{
      this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl('https://gesplangis.es/arcgis/apps/dashboards/88126077dbd64972b14e890d0afd73cd')
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
