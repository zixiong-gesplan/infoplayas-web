import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../helpers/must-match.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    RegistrationForm: FormGroup;
    frmLogin: FormGroup;

// TODO hay que completar el servicio auth ya creado para comprobar si el usuario está logueado
    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        // TODO formulario de login
        this.frmLogin = this.fb.group({
            email: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern('[a-z]*')])),
            password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
        });

        // TODO formulario de registro
        this.RegistrationForm = this.fb.group({
            email: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern('[a-z]*')])),
            password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
            password2: new FormControl('', Validators.required)
        }, {
            validator: MustMatch('password', 'password2')
        });
    }

    onRegisterSubmit(RegistrationForm: FormGroup) {
        // TODO registro
    }

    onLoginSubmit(frmLogin: FormGroup) {
        // TODO login ESRI
    }
}
