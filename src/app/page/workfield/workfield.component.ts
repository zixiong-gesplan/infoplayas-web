import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../component/navbar/navbar.component';

@Component({
    selector: 'app-workfield',
    templateUrl: './workfield.component.html',
    styleUrls: ['./workfield.component.css'],
    standalone: true,
    imports: [NavbarComponent]
})
export class WorkfieldComponent {

  dashboardUrl ="https://gesplangis.es/arcgis/apps/webappviewer/index.html?id=c5a4a260d40c41d9bca911fc4e296c8a"

  constructor() {}

  ngOnInit(): void {}

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
