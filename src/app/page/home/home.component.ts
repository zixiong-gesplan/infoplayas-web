import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import {Router} from '@angular/router';
declare var jQuery: any;

declare function init_plugins();

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true
})
export class HomeComponent implements OnInit, AfterViewInit {
  router = inject(Router);

  title = 'infoplayascanarias';

  ngOnInit(): void {
    init_plugins();
  }
  ngAfterViewInit() {
    // try {
    //   setTimeout( () =>{
    //     (document.querySelector('#loader-fade')as HTMLElement).style.display='none';
    //   }, 8000);
    // } catch (error) {
      
    // }

}

}
