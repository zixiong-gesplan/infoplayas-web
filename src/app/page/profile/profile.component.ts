import { Component, OnInit, inject } from '@angular/core';
import { User, UserProvider } from 'src/app/provider/user';
import { NavbarComponent } from '../../component/navbar/navbar.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    standalone: true,
    imports: [NavbarComponent]
})
export class ProfileComponent implements OnInit {
  private userProvider = inject(UserProvider);


  user:User

  ngOnInit(): void {}

}
