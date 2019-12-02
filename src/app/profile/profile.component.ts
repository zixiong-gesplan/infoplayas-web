import {Component, OnInit} from '@angular/core';
import {AuthGuardService} from '../services/auth-guard.service';
import {Router} from '@angular/router';
import {Auth} from '../models/auth';
import {RequestService} from '../services/request.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {SelectItem} from 'primeng/api';
import {PopulationService} from '../services/population.service';
import {AppSettingsService} from '../services/app-settings.service';
import {AppSetting} from '../models/app-setting';
declare var $: any;
declare var jQuery: any;

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    municipalities: SelectItem[];
    current_user: Auth;

    constructor(private service: RequestService, private authService: AuthGuardService, private spinnerService: Ng4LoadingSpinnerService,
                public router: Router, private popService: PopulationService, private appSettingsService: AppSettingsService) {
        this.municipalities = [];
        this.appSettingsService.getJSON().subscribe(data => {
            const aytos: AppSetting[] = data;
            aytos.map(v => {
                if (!v.isSuperUser) {
                    this.municipalities.push({label: v.municipio_minus, value: v.username});
                }
            });
        });
    }

    ngOnInit() {
        this.current_user = this.authService.getCurrentUser();
        if (!this.popService.isMunicipalityStore(this.current_user)) {
            this.popService.updateMunicipality(this.current_user.selectedusername
                ? this.current_user.selectedusername : this.current_user.username);
        }
    }

    updateFilterUser($event) {
        this.current_user.selectedusername = $event.value;
        this.authService.setUser(this.current_user);
        this.popService.updateMunicipality($event.value);
    }

    userLogOut() {
        this.authService.logOut();
        // window.location.href = '/';
    }
}
