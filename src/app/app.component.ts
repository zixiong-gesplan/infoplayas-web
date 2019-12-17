import {Component, OnInit} from '@angular/core';

declare var $: any;
declare var jQuery: any;

declare function init_plugins();

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
        init_plugins();
    }
}
