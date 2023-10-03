import { ReturnStatement } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {User, UserProvider} from '../../provider/user';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  r_username: string;
  r_password: string;
  r_remember: string;

  authForm: UntypedFormGroup; 
  username: string;
  password: string;
  remember: boolean;
  captcha: any
  constructor(
    // private formBuilder: FormBuilder,
    private userProvider: UserProvider,
    private router:Router
  ) {
    this.r_username = localStorage.getItem('username');
    this.r_password = localStorage.getItem('password');
    this.r_remember = localStorage.getItem('remember');
    this.authForm = new UntypedFormGroup({
      username: new UntypedFormControl(this.username,[
        Validators.required
      ]),
      password:new UntypedFormControl(this.password,[
        Validators.required
      ]),
      captcha: new UntypedFormControl(this.captcha,[
        Validators.required
      ])
    })
  }

  ngOnInit(): void {
  }


 async login(): Promise<void>{
    // this.manageRemember();
    if(!this.captcha){
      this.authForm.controls['captcha'].markAsTouched()
      // console.log(this.authForm.controls['captcha'])
      return
    }
    let request = {
      username: this.username,
      password: this.password,
      grant_type: 'password',
      client_id: '1_5ivyoetdzbgocgsosokg40ckckoggwgo4s08wwcwcwwcsccogo',
      client_secret: '18emxrnzh8v4gskssksk4sw4880sooo04wkco4wkccgwgskkwo'
    }
    try {
      await this.userProvider.login(request)
      let user = await this.userProvider.getUser()
      if(!user ){
        document.getElementById('msgError').innerHTML="Hubo un error en el login."
        return 
      }
      if(user.isMunicipality || user.isGesplan || user.isDGSE){
        this.router.navigateByUrl('/tecnicos');
        return;
      }
      document.getElementById('msgError').innerHTML="Usuario sin permisos"
      return
    } catch (error) {
      document.getElementById('msgError').innerHTML="Hubo un error en el login."
    }


    //let user = await this.userProvider.login(request);
  }

}
