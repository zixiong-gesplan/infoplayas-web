import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-cecoes',
  templateUrl: './cecoes.component.html',
  styleUrls: ['./cecoes.component.css']
})
export class CecoesComponent  implements OnInit {

  dashboardUrl ="https://gesplangis.es/arcgis/apps/dashboards/b06ef20fb97648eab647d6b9638c45d4"

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
