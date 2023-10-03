import { Component, OnInit } from '@angular/core';
import { User, UserProvider } from 'src/app/provider/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user:User
  constructor(
    private userProvider:UserProvider
  ) {

  }

  ngOnInit(): void {}

}
