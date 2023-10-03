import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
declare var jQuery: any;

declare function init_plugins();

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  title = 'infoplayascanarias';

  constructor( public router: Router) { }

  ngOnInit(): void {
    init_plugins();
  }
  ngAfterViewInit() {
    setTimeout( () =>{
        (document.querySelector('#loader-fade')as HTMLElement).style.display='none';
    }, 8000);
}

}
