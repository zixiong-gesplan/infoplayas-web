import {Component, OnInit} from '@angular/core';
import {MapViewerComponent} from '../map-viewer/map-viewer.component';
import {DialogService} from 'primeng/api';
import {MapPickLocationComponent} from '../map-pick-location/map-pick-location.component';

@Component({
    selector: 'app-drownings',
    templateUrl: './drownings.component.html',
    styleUrls: ['./drownings.component.css']
})
export class DrowningsComponent implements OnInit {

    constructor(public dialogService: DialogService) {
    }

    ngOnInit() {
    }

    test() {
        const ref = this.dialogService.open(MapPickLocationComponent, {
            data: {
                id: null,
                zoom: 12,
                mapHeight: '69vh'
            },
            header: 'titulo cabecera ventana',
            width: '65%',
            contentStyle: {'max-height': '78vh', 'overflow': 'auto'}
        });

        ref.onClose.subscribe((mensaje: string) => {
            if (mensaje) {
                console.log(mensaje);
            }
        });
        // this.loadAllData();
        // this.vacacional = false;
    }

}
