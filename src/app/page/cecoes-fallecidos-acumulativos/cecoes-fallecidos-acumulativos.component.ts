import { Component } from '@angular/core';
import { NavbarComponent } from '../../component/navbar/navbar.component';

@Component({
    selector: 'app-cecoes-fallecidos-acumulativos',
    templateUrl: './cecoes-fallecidos-acumulativos.component.html',
    styleUrls: ['./cecoes-fallecidos-acumulativos.component.css'],
    standalone: true,
    imports: [NavbarComponent]
})
export class CecoesFallecidosAcumulativosComponent {
  dashboardUrl ="https://gesplangis.es/arcgis/apps/dashboards/5d209f5c8e8d49388c5b08a073975740"

  constructor() { }

  ngOnInit(): void {
    
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
