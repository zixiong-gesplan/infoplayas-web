import {Component, OnInit, AfterViewInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
declare var Swiper: any;
declare var $:any;
declare var jQuery:any;

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
    mySwiper: any;

    constructor() {

    }

    ngAfterViewInit(){
      this.initSwiper();
      this.initCubPortfolio();

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

    initCubPortfolio(){
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
        })
    }

    initSwiper(){
      var swiperThreeSlides = new Swiper('.swiper-three-slides', {
        centeredSlides:true,
        allowTouchMove: true,

        slidesPerView: 3,
        preventClicks: false,
        loop:true,
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
