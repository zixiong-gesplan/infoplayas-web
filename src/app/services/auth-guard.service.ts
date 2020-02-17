import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router/src/interfaces';
import {Auth} from '../models/auth';
import {environment} from '../../environments/environment';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {EsriRequestService} from './esri-request.service';

declare function init_plugins();

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    urlAuthorize: string = environment.urlAuthorize + '?client_id=' + environment.client_id + '&response_type=token&redirect_uri='
        + environment.redirectUri;

    constructor(public router: Router, private service: EsriRequestService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        init_plugins();
        if (!this.isAuthenticated()) {
            window.location.href = this.urlAuthorize;
            return false;
        }
        if (route.data.permission) {
            const currentUser: Auth = this.getCurrentUser();
            const rol = environment.roles.find(i => i.id === currentUser.roleId);
            switch (route.data.permission) {
                case 'plan':
                    if (!rol.plan_visual) {
                        this.router.navigate(['/tecnicos/bienvenida']);
                        return false;
                    }
                    break;
                case 'incidentes':
                    if (!rol.inc_visual) {
                        this.router.navigate(['/tecnicos/bienvenida']);
                        return false;
                    }
                    break;
                default:
                    this.router.navigate(['/home']);
                    return false;
            }
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
        // this.destroyCredentials();
        sessionStorage.clear();
        localStorage.removeItem('current_user');
        localStorage.removeItem('municipality');
    }

    destroyCredentials() {
        this.service.revokeToken(this.getCurrentUser().token).subscribe(
            (result: any) => {
                if (result) {
                    console.log(result);
                }
            },
            error => {
                console.log(error.toString());
            });
    }
}
