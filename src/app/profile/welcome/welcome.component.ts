import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';

declare var Swiper: any;
declare var $: any;
declare var jquery: any;
declare const aytos: any;

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, AfterViewInit {

    municipalityName: string;

    constructor(private authService: AuthGuardService) {
    }

    ngAfterViewInit() {
        this.initSwiper();
    }

    ngOnInit() {
        this.municipalityName = this.authService.getCurrentUser().selectedusername ? this.authService.getCurrentUser().username :
            aytos[this.authService.getCurrentUser().username].municipio_minus;
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
}
