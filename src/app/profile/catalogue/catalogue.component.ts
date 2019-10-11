import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
    mapZoomLevel: number;
    mapHeightContainer: string;

  constructor() { }

  ngOnInit() {
      this.mapHeightContainer = '78vh';
      this.mapZoomLevel = 12;
  }

}
