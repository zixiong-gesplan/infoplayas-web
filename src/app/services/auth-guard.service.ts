import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router/src/interfaces';
import {Auth} from '../models/auth';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {PopulationService} from './population.service';

declare function init_plugins();

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    urlAuthorize: string = environment.urlAuthorize + '?client_id=' + environment.client_id + '&response_type=token&redirect_uri='
        + environment.redirectUri;

    constructor(public router: Router, private popService: PopulationService) {
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

    getCurrentUser(): Auth {
        return JSON.parse(localStorage.getItem('current_user')) ?
            JSON.parse(localStorage.getItem('current_user')) :
            JSON.parse(sessionStorage.getItem('current_user'));
    }

    setUser(user: Auth) {
        if (user.persist) {
            localStorage.setItem('current_user', JSON.stringify(user));
        } else {
            sessionStorage.setItem('current_user', JSON.stringify(user));
        }
    }

    public logOut() {
        sessionStorage.clear();
        localStorage.removeItem('current_user');
        localStorage.removeItem('municipality');
    }
}
