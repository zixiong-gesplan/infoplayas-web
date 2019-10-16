import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Municipality} from '../../models/municipality';
import {GradesProtectionService} from '../../services/grades-protection.service';
import {AuthGuardService} from '../../services/auth-guard.service';
import {environment} from '../../../environments/environment.prod';
import {EsriRequestService} from '../../services/esri-request.service';

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
    beachObjectId: string;
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
    lastChangeOnselectedBeach: Date;
    colsGrade: any;
    visible: string;
    beachs: any[];
    viewResults: boolean;

    constructor(private gradeService: GradesProtectionService, private authService: AuthGuardService, private service: EsriRequestService) {
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

        this.colsGrade = [
            {field: 'fecha_inicio', header: 'Inicio', width: '20%', orderBy: 'fecha_inicio'},
            {field: 'fecha_fin', header: 'Fin', width: '20%', orderBy: 'fecha_fin'},
            {field: 'afluencia', header: 'Afluencia', width: '20%', type: 'text', orderBy: 'afluencia'},
            {field: 'grado', header: 'Grado', width: '20%', type: 'text', orderBy: 'grado'},
            {field: 'grado_valor', header: 'Nivel', width: '20%', type: 'text', orderBy: 'grado_valor'}
        ];
        // cargamos los ids de las playas para usarlo posteriormente al mostrar los resultados
        this.loadBeachsIds();
    }

    // readFeatures() {
    //     this.service.features$.subscribe(
    //         (results: any) => {
    //             if (results[0]) {
    //                 // console.log(results);
    //                 const beachs = results;
    //                 if (beachs[0]) {
    //                     beachs[0].periods = this.gradeService.calculateGradeForPeriods(beachs[0].relatedRecords1, beachs[0].relatedRecords2,
    //                         beachs[0].relatedRecords3.relatedRecords);
    //                     beachs[0].grado_maximo = this.gradeService.getMaximunGrade(beachs[0].periods);
    //                     beachs[0].grados = this.gradeService.getDistinctGrades(beachs[0].periods);
    //                     console.log(beachs[0]);
    //                 }
    //             }
    //         },
    //         error => {
    //             console.log(error.toString());
    //         });
    // }

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

    loadBeachsIds() {
        const filtermunicipio = 'municipio = \'' + aytos[this.authService.getCurrentUser().username].municipio_minus + '\'';
        this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_url + '/query', filtermunicipio,
            'objectid_12', false, this.authService.getCurrentUser().token, 'objectid_12', true).subscribe(
            (result: any) => {
                if (result.features.length > 0) {
                    this.beachs = result.features;
                    console.log(this.beachs);
                }
            },
            error => {
                console.log(error.toString());
            });
    }

    receiveBeachId($event: string) {
        this.beachObjectId = $event;
        // if ($event !== 'noid') {
        //     this.gradeService.calculate($event, this.authService.getCurrentUser().token);
        // } else {
        //     this.gradeService.Publicrecords = [];
        // }
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

    receiveLastChangeTracking($event: Date) {
        this.lastChangeOnselectedBeach = $event;
        if ($event || this.localClasification === 'USO PROHIBIDO') {
            $('#resultsFilterMenu').show();
        } else {
            $('#resultsFilterMenu').hide();
        }
    }

    selectFormProtection(item, i) {
        this.actualForm = this.listOfLayersProtection[i];
        this.selectedLayerProtection = i;
    }

    setForm(opFilter: string) {
        this.viewResults = false;
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

    calculateGradesProtection() {
        this.service.getMultipleRelatedData(this.beachs, ['1', '2', '3'], this.authService.getCurrentUser().token);
        this.viewResults = true;
    }
}
