import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProvider } from 'src/app/provider/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  logged:boolean = false;
  isAdmin:boolean;
  isMunicipality:boolean;
  constructor(
    public userProvider:UserProvider,
    private router: Router
  ) { 

  }

  ngOnInit(): void {
    console.log(this.logged)
    if(this.userProvider.user){
      this.logged = true;
      this.isAdmin = this.userProvider.user.isDGSE || this.userProvider.user.isGesplan;
      this.isMunicipality = this.userProvider.user.isMunicipality;
    }else{
      this.logged = false;
    }

  }

  log_out():void{
    this.userProvider.logout()
    this.logged = false;
    this.router.navigate(['/'])
  }

}
