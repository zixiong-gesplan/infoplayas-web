import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router/src/interfaces';
import {Auth} from '../models/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    client_id = 'RNiCC2e9tgwl1mCV';
    url = 'https://www.arcgis.com/sharing/rest/oauth2/authorize';
    redirectUri = 'http://localhost:4200/login';
    urlAuthorize: string = this.url + '?client_id=' + this.client_id + '&response_type=token&redirect_uri=' + this.redirectUri;

    constructor() {
    }

    canActivate(): boolean {
        if (!this.isAuthenticated()) {
            window.location.href = this.urlAuthorize;
            return false;
        }
        return true;
    }

    public isAuthenticated(): boolean {
        const currentUser: Auth = JSON.parse(sessionStorage.getItem('current_user'));
        const currentDate = new Date();
        if (currentDate.getTime() >= Number(currentUser.expires)) {
            return false;
        }
        return !!currentUser;
    }

}
