import {Component, OnInit} from '@angular/core';
import {Auth} from '../models/auth';
import {ActivatedRoute, Router} from '@angular/router';

import Swal from 'sweetalert2';
import {AuthGuardService} from '../services/auth-guard.service';
import {AppSettingsService} from '../services/app-settings.service';
import {AppSetting} from '../models/app-setting';
import {EsriRequestService} from '../services/esri-request.service';
import {environment} from '../../environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    /*Si el usuario ha solicitado mantenerse logueado se establece este valor por defecto,
     en caso de cambiarlo en el portal poner ese valor*/
    private readonly DEFAULT_TIME_KEEP_SIGN_IN: number = 1209600000;

    constructor(public route: ActivatedRoute, public router: Router, private authService: AuthGuardService,
                private appSettingsService: AppSettingsService, private service: EsriRequestService) {
    }

    ngOnInit() {
        this.checkAuthorization();
    }

    checkAuthorization() {
        this.route.fragment.subscribe(fragment => {
            if (fragment) {
                if (new URLSearchParams(fragment).get('error') === 'access_denied') {
                    this.router.navigate(['home']);
                    return false;
                }
                const oAuthInfo = {
                    token: new URLSearchParams(fragment).get('access_token'),
                    expiresToken: Number(new URLSearchParams(fragment).get('expires_in')),
                    username: new URLSearchParams(fragment).get('username'),
                    persist: this.getBoolean(new URLSearchParams(fragment).get('persist')),
                    roleId: null,
                    filter: null
                };
                this.chekRole(oAuthInfo);
            }
        });
    }

    chekRole(oAuthInfo) {
        this.service.getRole(oAuthInfo.token).subscribe(
            (result: any) => {
                const roleIndex = environment.roles.findIndex(x => x.id === result.roleId);
                if (result && roleIndex !== -1) {
                    oAuthInfo.roleId = result.roleId;
                    oAuthInfo.filter = result.description ? result.description.toLowerCase() : null;
                    this.setUserContext(oAuthInfo, roleIndex);
                } else {
                    this.showUserAlert('El usuario que itenta acceder no está registrado para el uso de esta aplicación. ' +
                        'Contacte con el administrador.');
                }
            },
            error => {
                console.log(error.toString());
            });
    }

    setUserContext(oAuthInfo, roleIndex) {
        this.appSettingsService.getJSON().subscribe(data => {
            const aytos: AppSetting[] = data;
            const rol = environment.roles[roleIndex];
            if (rol.scope === 'ayto' && !aytos.find(i => i.ayto ===
                oAuthInfo.filter)) {
                this.showUserAlert('Su usuario no tiene configurado el identificador de su ayuntamiento, ' +
                    'o su ayuntamiento no está configurado aún, contacte con el soporte de la aplicación');
                return false;
            }
            const currentDate = new Date();
            const current_user: Auth = {
                token: oAuthInfo.token,
                // timestamp + expires token
                expires: oAuthInfo.persist ? this.DEFAULT_TIME_KEEP_SIGN_IN
                    + currentDate.getTime() + oAuthInfo.expiresToken * 1000 :
                    currentDate.getTime() + oAuthInfo.expiresToken * 1000,
                username: oAuthInfo.username,
                selectedusername: rol.scope === 'todos' ? aytos[0].username : null,
                persist: oAuthInfo.persist,
                editor: false
            };
            // TODO buscamos si puede editar el usuario
            current_user.editor = rol.plan_edit;
            this.authService.setUser(current_user);
            return this.router.navigate(['tecnicos']);
        });
    }

    getBoolean(value) {
        switch (value) {
            case true:
            case 'true':
            case 1:
            case '1':
            case 'on':
            case 'yes':
                return true;
            default:
                return false;
        }
    }

    showUserAlert(message: string) {
        Swal.fire({
            type: 'error',
            title: 'Usuario no permitido',
            text: message,
            footer: ''
        });
        this.router.navigate(['home']);
    }

}
