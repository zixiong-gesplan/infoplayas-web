import { Component, OnInit } from '@angular/core';
import {AuthGuardService} from '../services/auth-guard.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private auth: AuthGuardService, public router: Router) { }

  ngOnInit() {
  }

  userLogOut() {
    this.auth.logOut();
    this.router.navigate(['/']);
  }
}
