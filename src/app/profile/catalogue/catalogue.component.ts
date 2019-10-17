import { Component, OnInit } from '@angular/core';
declare function init_plugins();

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    init_plugins();
  }

}
