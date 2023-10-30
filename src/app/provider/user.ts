import {Injectable} from '@angular/core';
// import 'rxjs/Rx';
import { Beach } from './beach';
import {environment} from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';


let loginURL = environment.SERVER_URL+"oauth/v2/token";
let getUserDataURL = environment.SERVER_URL+"api/core/user/data";

export type User={
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
            isMunicipality: user.roles.includes('ROLE_MANAGER'),
            isDGSE: user.roles.includes('ROLE_SUPER_ADMIN'),
            isGesplan: user.roles.includes('ROLE_GESPLAN')
        }
        return user;
    }

    logout(){
        delete this.user;
    }

    isMunicipalityOrAdmin(){
        // let roles = this.user.roles as string[];
        // return roles.includes('ROLE_GESPLAN') || roles.includes('')

        /**
         * 
         * ["ROLE_COMPANY",
         * "ROLE_ADMIN_INCIDENT_ACTION_LIST",
         * "ROLE_ADMIN_AFFECTED_PERSON_ACTION_LIST"
         * ,"ROLE_ADMIN_INFLUX_ACTION_LIST",
         * "ROLE_ADMIN_FLAG_ACTION_LIST",
         * ROLE_ADMIN_BEACH_LIST",
         * "ROLE_ADMIN_MUNICIPALITY_LIST",
         * "ROLE_ADMIN_FLAG_REASON_ADVICE_LIST",
         * "ROLE_ADMIN_FLAG_DANGEROUS_LIST",
         * "ROLE_ADMIN_INCIDENT_SUBSTANCE_LIST",
         * "ROLE_ADMIN_INCIDENT_INFORMATION_LIST",
         * "ROLE_ADMIN_INCIDENT_PROFILE_LIST",
         * "ROLE_ADMIN_INCIDENT_LVL_ZERO_RESCUE_LIST",
         * "ROLE_ADMIN_INCIDENT_LVL_ZERO_FIRST_AID_LIST",
         * ROLE_ADMIN_INCIDENT_LVL_ZERO_FIRST_AID_CAUSE_LIST",
         * "ROLE_ADMIN_INCIDENT_FIRST_AID_USER_ASSOCIATION_LIST",
         * "ROLE_ADMIN_INCIDENT_EMERGENCY_GRADE_LIST",
         * "ROLE_ADMIN_INCIDENT_ALARM_SENDER_LIST",
         * "ROLE_ADMIN_INCIDENT_RESOURCES_USED_LIST",
         * "ROLE_ADMIN_INCIDENT_EXTERNAL_RESOURCES_USED_LIST",
         * "ROLE_ADMIN_INCIDENT_TRANSLATION_CENTER_LIST",
         * ROLE_ADMIN_INCIDENT_EVACUATION_LIST",
         * "ROLE_ADMIN_INCIDENT_MOBILIZED_AGENTS_LIST",
         * "ROLE_SONATA_USER_ADMIN_USER_LIST",
         * "ROLE_SONATA_USER_ADMIN_USER_CREATE",
         * "ROLE_ADMIN_INCIDENT_ACTION_VIEW",
         * "ROLE_ADMIN_INCIDENT_ACTION_EXPORT",
         * "ROLE_ADMIN_AFFECTED_PERSON_ACTION_VIEW",
         * "ROLE_ADMIN_AFFECTED_PERSON_ACTION_EXPORT",
         * "ROLE_ADMIN_INFLUX_ACTION_VIEW",
         * "ROLE_ADMIN_INFLUX_ACTION_EXPORT",
         * "ROLE_SUPER_ADMIN",
         * "ROLE_GESPLAN",
         * "ROLE_ADMIN_INCIDENT_ACTION_ALL",
         * "ROLE_ADMIN_AFFECTED_PERSON_ACTION_ALL"
         * ,"ROLE_ADMIN_INFLUX_ACTION_ALL",
         * "ROLE_ADMIN_FLAG_ACTION_ALL",
         * "ROLE_ADMIN_BEACH_ALL",
         * "ROLE_ADMIN_MUNICIPALITY_ALL",
         * "ROLE_ADMIN_FLAG_REASON_ADVICE_ALL",
         * "ROLE_ADMIN_FLAG_DANGEROUS_ALL",
         * "ROLE_ADMIN_INCIDENT_SUBSTANCE_ALL",
         * "ROLE_ADMIN_INCIDENT_INFORMATION_ALL",
         * "ROLE_ADMIN_INCIDENT_PROFILE_ALL",
         * "ROLE_ADMIN_INCIDENT_LVL_ZERO_RESCUE_ALL",
         * "ROLE_ADMIN_INCIDENT_LVL_ZERO_FIRST_AID_ALL",
         * "ROLE_ADMIN_INCIDENT_LVL_ZERO_FIRST_AID_CAUSE_ALL",
         * "ROLE_ADMIN_INCIDENT_FIRST_AID_USER_ASSOCIATION_ALL",
         * "ROLE_ADMIN_INCIDENT_EMERGENCY_GRADE_ALL",
         * "ROLE_ADMIN_INCIDENT_ALARM_SENDER_ALL",
         * "ROLE_ADMIN_INCIDENT_RESOURCES_USED_ALL",
         * "ROLE_ADMIN_INCIDENT_EXTERNAL_RESOURCES_USED_ALL",
         * "ROLE_ADMIN_INCIDENT_TRANSLATION_CENTER_ALL",
         * "ROLE_ADMIN_INCIDENT_EVACUATION_ALL",
         * "ROLE_ADMIN_INCIDENT_MOBILIZED_AGENTS_ALL",
         * "ROLE_ADMIN_GENERAL_CONFIG_ALL",
         * "ROLE_ADMIN_ACTIVITY_ALL",
         * "ROLE_ADMIN_SERVICE_ALL",
         * "ROLE_ADMIN_EQUIPEMENT_ALL",
         * "ROLE_SONATA_USER_ADMIN_USER_ALL",
         * "ROLE_SONATA_USER_ADMIN_GROUP_ALL",
         * "ROLE_OPERATOR",
         * "ROLE_ADMIN",
         * "ROLE_MANAGER",
         * "ROLE_MANAGER_SUP",
         * "ROLE_USER",
         * "ROLE_SONATA_ADMIN",
         * "ROLE_ALLOWED_TO_SWITCH","ROLE_SONATA_USER_ADMIN_USER_VIEW"]
         */
        let roles = this.user.roles as string[];
        return roles.includes('ROLE_MANAGER_SUP') || roles.includes('ROLE_MANAGER') || roles.includes('ROLE_SONATA_ADMIN')
    }
    isAdmin(){
        let roles = this.user.roles as string[];
        this.user.isGesplan = roles.includes('ROLE_GESPLAN');
        this.user.isDGSE = roles.includes('ROLE_SUPER_ADMIN')
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