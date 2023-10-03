import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  copyText(){
    var val =`<iframe width="1200" height="850" title="Playas por Municipio"
    src="https://gesplangis.es/arcgis/apps/webappviewer/index.html?id=1de5084df09c4dffb8f5f260503cea60&amp;zoom=true&amp;scale=true&amp;disable_scroll=true&amp;theme=light"></iframe>`
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    }

}
