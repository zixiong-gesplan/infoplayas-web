import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var jquery: any;
declare function init_plugins();
declare function navbar_load();

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {



  constructor() { }

  ngOnInit() {
    init_plugins();
    navbar_load();
  }

}
