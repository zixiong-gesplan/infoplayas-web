import { Component, OnInit } from '@angular/core';
declare function init_plugins();

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.css']
})
export class DashboardsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    init_plugins();
  }
  copyText(val:number){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    if(val == 1){
      selBox.value = `<iframe width="100%" height="650" title="Accesos, riesgos, instalaciones y equipamientos"
      src="https://gesplangis.es/arcgis/apps/dashboards/ce89c3a6cb6a4f87b47b94a9b74b2162">
    </iframe>`
    }else{
      selBox.value = `<iframe width="1200" height="1200" title="Incidencias graves y fallecidos en medio acuático en Canarias"
      src="https://gesplangis.es/arcgis/apps/opsdashboard/index.html#/483b5ad30ce247b698f1dd4e97e60192"></iframe>`
    }
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
