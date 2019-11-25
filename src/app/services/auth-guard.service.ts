import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router/src/interfaces';
import {Auth} from '../models/auth';
import {Municipality} from '../models/municipality';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';

declare const aytos: any;

declare function init_plugins();

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    urlAuthorize: string = environment.urlAuthorize + '?client_id=' + environment.client_id + '&response_type=token&redirect_uri='
        + environment.redirectUri;

    private sMunicipalitySource = new BehaviorSubject<string>('');
    sMunicipality$ = this.sMunicipalitySource.asObservable();

    constructor(public router: Router) {
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
        localStorage.removeItem('municipality');
    }

    updateFilterUser($event) {
        const currentUser: Auth = this.getCurrentUser();
        currentUser.selectedusername = $event.value;
        if (currentUser.persist) {
            localStorage.setItem('current_user', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('current_user', JSON.stringify(currentUser));
        }
        this.sMunicipalitySource.next($event.value);
    }
}
