import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Municipality} from '../../models/municipality';

declare var Swiper: any;
declare var $: any;
declare var jquery: any;
declare const aytos: any;

@Component({
    selector: 'app-classification',
    templateUrl: './classification.component.html',
    styleUrls: ['./classification.component.css']
})
export class ClassificationComponent implements OnInit, AfterViewInit {
    itemsProtection: MenuItem[];
    beachName: string;
    numberOfBeachs: number;
    mapZoomLevel: number;
    mapHeightContainer: string;
    listOfLayersProtection: string[];
    selectedLayerProtection: number;
    actualForm = 'inventario';
    localName: string;
    localClasification: string;
    cargaPoblacional: number;
    municipio: Municipality;
    DangerPopulationLevel: number;

    constructor() {
    }

    ngAfterViewInit() {
        this.initSwiper();
        this.initCubPortfolio();
    }

    ngOnInit() {
        this.municipio = JSON.parse(localStorage.getItem('municipality'));
        this.cargaPoblacional = Math.round((this.municipio.beds * this.municipio.occupation * 0.01)) + this.municipio.population;
        this.DangerPopulationLevel = this.getDangerPopulationLevel();
        this.listOfLayersProtection = ['afluencia', 'entorno', 'incidencias', 'valoracion'];
        this.itemsProtection = [
            {label: 'Afluencia', icon: 'fa fa-fw fa-street-view'},
            {label: 'Entorno', icon: 'fa fa-fw fa-thermometer'},
            {label: 'Incidencias & Usos', icon: 'fa fa-fw fa-medkit'},
            {label: 'Valoración final', icon: 'fa fa-fw fa-calculator'}
        ];
        this.mapHeightContainer = '78vh';
        this.mapZoomLevel = 12;
        this.localClasification = 'PENDIENTE';
    }

    initCubPortfolio() {
        $('#js-grid-mosaic-flat').cubeportfolio({
            filters: '#js-filters-mosaic-flat',
            layoutMode: 'mosaic',
            defaultFilter: 'none',
            animationType: 'fadeOutTop',
            gapHorizontal: 0,
            gapVertical: 0,
            gridAdjustment: 'responsive',
            caption: 'zoom',
            displayType: 'fadeIn',
            displayTypeSpeed: 100,
            sortByDimension: true,
            mediaQueries: [{
                width: 1500,
                cols: 3
            }, {
                width: 1100,
                cols: 3
            }, {
                width: 768,
                cols: 2
            }, {
                width: 480,
                cols: 1
            }, {
                width: 320,
                cols: 1
            }],

            // lightbox
            lightboxDelegate: '.cbp-lightbox',
            lightboxGallery: true,
            lightboxTitleSrc: 'data-title',
            lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',

            plugins: {
                loadMore: {
                    element: '#js-loadMore-mosaic-flat',
                    action: 'click',
                    loadItems: 3
                }
            }
        });
    }

    initSwiper() {
        const swiperThreeSlides = new Swiper('.swiper-three-slides', {
            centeredSlides: true,
            allowTouchMove: true,

            slidesPerView: 3,
            preventClicks: false,
            loop: true,
            pagination: {
                el: '.swiper-pagination-bullets',
                clickable: true
            },
            cubeEffect: {
                slideShadows: false
            },
            autoplay: {
                delay: 7500,
                disableOnInteraction: false
            },
            keyboard: {
                enabled: true
            },
            breakpoints: {
                991: {
                    slidesPerView: 2
                },
                767: {
                    slidesPerView: 1
                }
            }
        });
    }

    receiveBeachId($event: string) {
        this.beachName = $event;
    }

    receiveNzones($event: number) {
        this.numberOfBeachs = $event;
    }

    receiveLocalName($event: string) {
        this.localName = $event;
        if ($event.toUpperCase() === 'NOMBRE POR DEFINIR') {
            $('#clasificationFilterMenu').hide();
        } else {
            $('#clasificationFilterMenu').show();
        }
    }

    receiveClasification($event: string) {
        this.localClasification = $event;
        if ($event === 'USO PROHIBIDO' || this.localName.toUpperCase() === 'NOMBRE POR DEFINIR') {
            $('#protectionFilterMenu').hide();
        } else {
            $('#protectionFilterMenu').show();
        }
    }

    selectFormProtection(item, i) {
        this.actualForm = this.listOfLayersProtection[i];
        this.selectedLayerProtection = i;
    }

    setForm(opFilter: string) {
        this.actualForm = opFilter === 'protection' ? this.selectedLayerProtection > 0 ?
            this.listOfLayersProtection[this.selectedLayerProtection] : this.listOfLayersProtection[0] : opFilter;
    }

    getDangerPopulationLevel() {
        const dangerPopulationLimits: number[] = [0, 5000, 20000, 100000];
        let n = 0;
        while (this.cargaPoblacional > dangerPopulationLimits[n]) {
            n += 1;
        }
        const lisValues: number [] = [0, 1, 3, 5];
        return n > 0 ? lisValues[n - 1] : 0;
    }
}
