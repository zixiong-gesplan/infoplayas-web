import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router/src/interfaces';
import {Auth} from '../models/auth';
import {Municipality} from '../models/municipality';
import {RequestService} from './request.service';
import {environment} from '../../environments/environment';

declare function init_plugins();

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    urlAuthorize: string = environment.urlAuthorize + '?client_id=' + environment.client_id + '&response_type=token&redirect_uri='
        + environment.redirectUri;

    constructor(private service: RequestService) {
    }

    canActivate(): boolean {
        init_plugins();
        if (!this.isAuthenticated()) {
            window.location.href = this.urlAuthorize;
            return false;
        }
        return true;
    }

    public isAuthenticated(): boolean {
        const currentUser: Auth = this.getCurrentUser();
        const currentDate = new Date();
        if (currentUser && currentDate.getTime() >= Number(currentUser.expires)) {
            return false;
        }
        return !!currentUser;
    }

    public isMunicipalityStore(current_user: Auth): boolean {
        const mun: Municipality = this.getMunicipality();
        const currentDate = new Date();
        if (mun && current_user.username !== mun.user) {
            return false;
        }
        if (mun && currentDate.getFullYear() - 1 > Number(mun.year)) {
            return false;
        } else {
            return !!mun;
        }
    }

    getCurrentUser(): Auth {
        return JSON.parse(localStorage.getItem('current_user')) ?
            JSON.parse(localStorage.getItem('current_user')) :
            JSON.parse(sessionStorage.getItem('current_user'));
    }

    getMunicipality(): Municipality {
        return JSON.parse(localStorage.getItem('municipality'));
    }

    public logOut() {
        sessionStorage.clear();
        localStorage.removeItem('current_user');
    }
}
