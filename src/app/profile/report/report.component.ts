import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

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
    urlMap: SafeResourceUrl;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl(environment.urlPlanos);
        init_plugins();
        navbar_load();
    }
}
