import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProvider } from 'src/app/provider/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit,AfterViewInit {
  logged:boolean = false;
  isAdmin:boolean;
  isMunicipality:boolean;
  constructor(
    public userProvider:UserProvider,
    private router: Router
  ) { 

  }

  ngOnInit(): void {

    if(this.userProvider.user){
      this.logged = true;
      this.isAdmin = this.userProvider.user.isDGSE || this.userProvider.user.isGesplan;

      this.isMunicipality = this.userProvider.user.isMunicipality;
    }else{
      this.logged = false;
    }

  }
  ngAfterViewInit(){
    let tab:HTMLElement;
    if(this.router.url==='/'){
      console.log("works")
      console.log(document.querySelector('#tab-home'));
      console.log(document.querySelector('#tab-catalogo'));
      tab = document.querySelector('#tab-home');
    }
    if(this.router.url==='/catalogo'){
      tab = document.querySelector('#tab-catalogo');
    }
    if(this.router.url==='/planos'){
      tab = document.querySelector('#tab-planos');
    }
    if(this.router.url==='/cecoes'){
      tab = document.querySelector('#tab-cecoes');
    }
    if(this.router.url==='/reports'){
      tab = document.querySelector('#tab-reports');
    }
    if(this.router.url==='/login'){
      tab = document.querySelector('#tab-login');
    }
    if(this.router.url==='/trabajo-campo'){
      tab = document.querySelector('#tab-trabajo-campo');
    }
    // console.log(tab);
    (tab.children[0] as HTMLElement).style.fontWeight = 'bolder';
  }
  log_out():void{
    this.userProvider.logout()
    this.logged = false;
    this.router.navigate(['/'])
  }

}
