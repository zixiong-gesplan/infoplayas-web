import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {AppSetting} from '../../models/app-setting';
import {AppSettingsService} from '../../services/app-settings.service';
import {Auth} from '../../models/auth';
import {Router} from '@angular/router';
import {AppSettings} from '../../../app-settings';
declare function init_plugins();

declare var Swiper: any;
declare var jQuery: any;

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, AfterViewInit {

    municipalityName: string;

    constructor(public authService: AuthGuardService, private appSettingsService: AppSettingsService, public router: Router) {
    }

    ngAfterViewInit() {
        this.initSwiper();
        setTimeout(function () {
            jQuery('#loader-fade').hide();
        }, 800);
    }

    ngOnInit() {
        init_plugins();
        this.appSettingsService.getJSON().subscribe(data => {
            const aytos: AppSetting[] = data;
            const user: Auth = this.authService.getCurrentUser();
            this.municipalityName = user.filter ? aytos.find(i => i.ayto === user.filter).municipio_minus :
                user.name;
            // enviamos al usuario que solo tiene que visualizar incidentes a la pantalla correspondiente
            const rol = AppSettings.roles.find(i => i.id === user.roleId);
            if (!rol.plan_visual && rol.inc_visual) {
                this.router.navigate(['/tecnicos/incidentes']);
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
}
