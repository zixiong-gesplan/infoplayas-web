import {Component, OnInit} from '@angular/core';
import {AuthGuardService} from '../services/auth-guard.service';
import {Router} from '@angular/router';
import {Auth} from '../models/auth';
import {RequestService} from '../services/request.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {SelectItem} from 'primeng/api';
import {PopulationService} from '../services/population.service';

declare const aytos: any;

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    municipalities: SelectItem[];
    current_user: Auth;

    constructor(private service: RequestService, private authService: AuthGuardService, private spinnerService: Ng4LoadingSpinnerService,
                public router: Router, private popService: PopulationService) {
        this.municipalities = [];
        Object.keys(aytos).forEach(key => {
            if (!aytos[key].isSuperUser) {
                this.municipalities.push({label: aytos[key].municipio_minus, value: key});
            }
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
        window.location.href = '/';
    }
}
