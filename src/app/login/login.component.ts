import {Component, OnInit} from '@angular/core';
import {Auth} from '../models/auth';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    constructor(public route: ActivatedRoute, public router: Router) {
    }

    ngOnInit() {
        this.setCurrentUser();
    }

    setCurrentUser() {
        return this.route.fragment.subscribe(fragment => {
            if (fragment) {
                const current_user: Auth = {
                    token: new URLSearchParams(fragment).get('access_token'),
                    expires: Number(new URLSearchParams(fragment).get('expires_in')),
                    username: new URLSearchParams(fragment).get('username')
                };
                sessionStorage.setItem('current_user', JSON.stringify(current_user));
            }
            this.router.navigate(['tecnicos']);
        });
    }
}
