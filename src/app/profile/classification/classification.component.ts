import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
    selector: 'app-classification',
    templateUrl: './classification.component.html',
    styleUrls: ['./classification.component.css']
})
export class ClassificationComponent implements OnInit {
    itemsPeopleFlow: MenuItem[];
    itemsRisks: MenuItem[];
    beachName: string;
    mapZoomLevel: number;
    mapHeightContainer: string;
    listOfLayersRisks: string[];
    listOfLayersPeopleFlow: string[];
    actualForm = 'inventario';
    localName: string;

    constructor() {
    }

    ngOnInit() {
        this.listOfLayersPeopleFlow = ['clasificacion', 'todo'];
        this.listOfLayersRisks = ['todo', 'todo', 'todo', 'todo', 'todo'];
        this.itemsPeopleFlow = [
            {label: 'Peligrosidad', icon: 'fa fa-fw fa-life-ring'},
            {label: 'Afluencia', icon: 'fa fa-fw fa-users'},
        ];
        this.itemsRisks = [
            {label: 'Incidencias', icon: 'fa fa-fw fa-medkit'},
            {label: 'Población', icon: 'fa fa-fw fa-street-view'},
            {label: 'Condiciones', icon: 'fa fa-fw fa-thermometer'},
            {label: 'Entorno', icon: 'fa fa-fw fa-envira'},
            {label: 'Actividades', icon: 'fa fa-fw fa-futbol-o'}
        ];
        this.mapHeightContainer = '78vh';
        this.mapZoomLevel = 12;
    }

    receiveBeachId($event: string) {
        this.beachName = $event;
    }

    receiveLocalName($event: string) {
        this.localName = $event;
    }

    closeItemPeopleFlow(event, index) {
        this.itemsPeopleFlow = this.itemsPeopleFlow.filter((item, i) => i !== index);
        event.preventDefault();
    }

    selectFormRisks(item, i) {
        this.actualForm = this.listOfLayersRisks[i];
    }
    selectFormPeopleFlow(item, i) {
        this.actualForm = this.listOfLayersPeopleFlow[i];
    }

    closeItemRisks(event, index) {
        this.itemsRisks = this.itemsRisks.filter((item, i) => i !== index);
        event.preventDefault();
    }

    setForm(opFilter: string) {
        this.actualForm = opFilter;
    }
}
