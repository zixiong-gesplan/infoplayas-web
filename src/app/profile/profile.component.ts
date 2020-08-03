import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthGuardService} from '../services/auth-guard.service';
import {Router} from '@angular/router';
import {Auth} from '../models/auth';
import {RequestService} from '../services/request.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {SelectItem} from 'primeng/api';
import {PopulationService} from '../services/population.service';
import {AppSettingsService} from '../services/app-settings.service';
import {AppSetting} from '../models/app-setting';
import {AppSettings} from '../../app-settings';

declare function init_plugins();

declare var $: any;

declare function navbar_load();

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    municipalities: SelectItem[];
    current_user: Auth;
    isPlanUser: boolean;
    isIncidentsUser: boolean;
    @ViewChild('munSelect') munDropDown;
    @ViewChild('munDialogselect') munDialogDropDown;
    private aytos: AppSetting[];

    constructor(private service: RequestService, private authService: AuthGuardService, private spinnerService: Ng4LoadingSpinnerService,
                public router: Router, private popService: PopulationService, private appSettingsService: AppSettingsService) {
    }

    ngOnInit() {
        init_plugins();
        navbar_load();
        this.current_user = this.authService.getCurrentUser();
        const rol = AppSettings.roles.find(i => i.id === this.current_user.roleId);
        this.isPlanUser = rol.plan_visual;
        this.isIncidentsUser = rol.inc_visual;
        this.municipalities = [];
        this.appSettingsService.getJSON().subscribe(data => {
            this.aytos = data;
            this.aytos.map(v => {
                if (v.istac_code) {
                    this.municipalities.push({label: v.municipio_minus, value: v.ayto});
                }
            });
            const filter = this.current_user.filter ? this.current_user.filter : 'adeje';
            // En caso de ser un usuario de seleccion multiple preguntamos por cual municipio quiere empezar
            if (filter === 'adeje') {
                $('#munConfirmation').modal({backdrop: 'static', keyboard: false});
                $('#munConfirmation').modal('show');
            }
            this.popService.updateMunicipality(filter, this.aytos);
        });
    }

    updateFilterUser($event) {
        this.popService.updateMunicipality($event.value, this.aytos);
    }

    userLogOut() {
        this.authService.logOut();
        this.router.navigate(['/home']);
    }

    setMunBackgroundOption() {
        this.munDropDown.selectedOption = this.munDialogDropDown.selectedOption;
    }
}
