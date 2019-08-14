import { Component, OnInit } from '@angular/core';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  cols: any[];
  constructor() { }

  ngOnInit() {

    this.cols = [
           { field: 'vin', header: 'Vin' },
           { field: 'year', header: 'Year' },
           { field: 'brand', header: 'Brand' },
           { field: 'color', header: 'Color' }
       ];
  }

}
