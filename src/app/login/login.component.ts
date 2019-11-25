import {Component, OnInit} from '@angular/core';
import {Auth} from '../models/auth';
import {ActivatedRoute, Router} from '@angular/router';

import Swal from 'sweetalert2';
declare const aytos: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    /*Si el usuario ha solicitado mantenerse logueado se establece este valor por defecto,
     en caso de cambiarlo en el portal poner ese valor*/
    private readonly DEFAULT_TIME_KEEP_SIGN_IN: number = 1209600000;

    constructor(public route: ActivatedRoute, public router: Router) {
    }

    ngOnInit() {
        this.setCurrentUser();
    }

    setCurrentUser() {
        return this.route.fragment.subscribe(fragment => {
            if (fragment) {
                if (new URLSearchParams(fragment).get('error') === 'access_denied') {
                    this.router.navigate(['home']);
                    return false;
                }
                if (!aytos.hasOwnProperty(new URLSearchParams(fragment).get('username'))) {
                    Swal.fire({
                        type: 'error',
                        title: 'Usuario no permitido',
                        text: 'El usuario que itenta acceder no está registrado para el uso de esta aplicación. Contacte con el administrador.',
                        footer: ''
                    });
                    this.router.navigate(['home']);
                    return false;
                }
                const current_user: Auth = {
                    token: new URLSearchParams(fragment).get('access_token'),
                    expires: Number(new URLSearchParams(fragment).get('expires_in')),
                    username: new URLSearchParams(fragment).get('username'),
                    selectedusername: aytos[new URLSearchParams(fragment).get('username')].isSuperUser ? Object.keys(aytos)[0] : null,
                    persist: this.getBoolean(new URLSearchParams(fragment).get('persist'))
                };
                // timestamp + expires token
                const currentDate = new Date();
                current_user.expires = current_user.persist ? this.DEFAULT_TIME_KEEP_SIGN_IN
                    + currentDate.getTime() + current_user.expires * 1000 :
                    currentDate.getTime() + current_user.expires * 1000;
                if (current_user.persist) {
                    localStorage.setItem('current_user', JSON.stringify(current_user));
                } else {
                    sessionStorage.setItem('current_user', JSON.stringify(current_user));
                }
            }
            this.router.navigate(['tecnicos']);
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
}
