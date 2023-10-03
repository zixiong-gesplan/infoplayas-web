import {Injectable} from '@angular/core';
// import 'rxjs/Rx';
import { Beach } from './beach';
import {environment} from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';


let loginURL = environment.SERVER_URL+"oauth/v2/token";
let getUserDataURL = environment.SERVER_URL+"api/core/user/data";

export class User{
    id?: number;
    access_token?: string;
    expires_in?: number;
    token_type?: string;
    refresh_token?: string;
    isDGSE?:boolean;
    isGesplan?:boolean;
    isMunicipality?:boolean;
    username?: string;
    error?: string;
    error_description?: string;
    roles?: string[];
    token?: string;
    email?: string;
    date?: Date;
    sector?: string;
    dgse?: string;
    playa?: Beach;
    municipalities?: Municipality[];
    manager: boolean;
    online: boolean;
}

export class Municipality{
    id: number;
    island: string;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class UserProvider{
    // loading:any;
    user: User;
    
    constructor( private http:HttpClient){}


    // getUser() {
    //     return this.user;
    // }
    private formData(myFormData){
        return Object.keys(myFormData).map(function(key){
            return encodeURIComponent(key) + '=' + encodeURIComponent(myFormData[key]);
        }).join('&');
    }

    async login(request){
        let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
        let formData = this.formData(request)
        this.user = await this.http.post(loginURL,formData,{headers:headers}).toPromise() as User;
        
    }
    async getUser(){
        let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
        let user = await this.http.get(`${getUserDataURL}?access_token=${this.user.access_token}`,{headers:headers})
                                    .toPromise() as User;
        this.user = {
            ...this.user,
            ...user,
        }
        return user;
    }

    logout(){
        delete this.user;
    }

    isAdmin(){
        let roles = this.user.roles as string[];
        return roles.includes('ROLE_GESPLAN') || roles.includes('ROLE_SUPER_ADMIN')
    }
    // jsonToUser(json){
    //     if(json.error){ return false}

    //     this.user = json;
    //     return true;
    // }

    // getUserData(){
    //     let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    //     return this.http.get(getUserDataURL+'?access_token='+this.user.access_token, {headers: headers})
    // }

    // setUserData(json) {
    //     if (json.error) return false;

    //     this.user.id = json.id;
    //     this.user.username = json.username;
    //     this.user.roles = json.roles;
    //     this.user.token = json.token;
    //     this.user.email = json.email;
    //     this.user.manager = json.manager;
    //     this.user.municipalityEntity = json.municipalities;
    //     return true;
        
    // }

    // save() {
    //     localStorage.setItem('user', JSON.stringify(this.user));
    //     this.user.online = true;
    // }
    // load() {
    //     this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : new User();
    // }

    // handleError(error) {
    //     return Observable.throw(error.json().error_description || 'Server error');
    // }
}