import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

import { UserProvider,User } from "./user";

let getMotivosURL = environment.SERVER_URL+"api/core/flag/reason";
let getPeligrosURL = environment.SERVER_URL+"api/core/flag/dangerous";
let getSustanciasURL = environment.SERVER_URL+"api/core/incident/substances";
let getAlarmantesURL = environment.SERVER_URL+"api/core/incident/ending/alarmsender";
let getMediosURL = environment.SERVER_URL+"api/core/incident/ending/resourcesused";
let getExternosURL = environment.SERVER_URL+"api/core/incident/ending/externalresourcesused";
let getMunicipiosURL = environment.SERVER_URL+"api/core/municipalities";
let getPaisesURL = "https://restcountries.com/v3.1/all";
let getPerfilesURL = environment.SERVER_URL+"api/core/incident/profiles";
let getTrasladosURL = environment.SERVER_URL+"api/core/incident/ending/translationcenter";
let getMotivosAuxilioURL = environment.SERVER_URL+"api/core/incident/firstaid/type";
let getCausasAuxilioURL = environment.SERVER_URL+"api/core/incident/firstaid/cause";
let getMotivosRescateURL = environment.SERVER_URL+"api/core/incident/rescue";
let getMotivosEvacuacionURL = environment.SERVER_URL+"api/core/incident/incidentevacuation";
let getCuerposURL = environment.SERVER_URL+"api/core/mobilizedagents";

let getGeneralConfigURL = environment.SERVER_URL+"api/core/generalconfig";

@Injectable({
    providedIn: 'root',
})
export class ConfigProvider {

    motivos: any[] = [];
    peligros: any[] = [];
    sustancias: any[] = [];
    alarmantes: any[] = [];
    medios: any[] = [];
    externos: any[] = [];
    municipios: any[] = [];
    paises: any[] = [        
        'Francia',
        'Bélgica',
        'Irlanda',
        'Italia',
        'Finlandia',
        'Holanda',
        'Dinamarca',
        'Noruega',
        'Suecia',
        'Alemania',
        'Reino Unido',
        'España'
    ];
    perfiles: any[] = [];
    traslados: any[] = [];
    motivosAuxilio: any[] = [];
    causasAuxilio: any[] = [];
    motivosRescate: any[] = [];
    motivosEvacuacion: any[] = [];
    cuerpos: any[] = [];

    generalConfig: any[] = [];

    user: User;

    constructor (
        private HttpClient:HttpClient,
        private userProvider: UserProvider,
    ) {
        this.user = this.userProvider.user;
    }

    // Motivos Bandera
    async getMotivosData(){
        let request = await this.HttpClient.get(getMotivosURL+'?access_token='+this.user.access_token).toPromise()
        this.motivosToArray(request)
    }

    motivosToArray(json) {
        if (json.error) { return }
        this.motivos = json.map( item => {return item})

    }
    // Peligros Bandera
    async getPeligrosData() {
        let request = await this.HttpClient.get(getPeligrosURL+'?access_token='+this.user.access_token).toPromise()
        this.peligrosToArray(request)
    }

    peligrosToArray(json) {
        if (json.error) return false;
        this.peligros = json.map( item => {return item.name})
    }

    // Sustancias Incidente Persona
    async getSustanciasData() {
        let request = await this.HttpClient.get(getSustanciasURL+'?access_token='+this.user.access_token).toPromise()
        this.sustanciasToArray(request)
    }

    sustanciasToArray(json) {
        if (json.error) return false;
        this.sustancias = json
    }

    sustanciasFormValue(ids) {
        let result = [];
        if (ids) {
            ids.forEach(id => {
                result.push({id: id, name: this.sustanciasName(id)})
            });
        }
        return result;
    }

    sustanciasName(id) {
        let result = 'Otro';
        this.sustancias.forEach(item => {
            if (item.id == id) {
                result = item.name;
            }
        });

        return result;
    }

    // Alarmantes Incidente
    async getAlarmantesData() {
        let request = await this.HttpClient.get(getAlarmantesURL+'?access_token='+this.user.access_token).toPromise()
        this.alarmantesToArray(request)
    }

    alarmantesToArray(json) {
        if (json.error) return;
        this.alarmantes = json
        return;
    
    }

    // Medios Incidente
    async getMediosData() {
        let request = await this.HttpClient.get(getMediosURL+'?access_token='+this.user.access_token).toPromise()
        this.mediosToArray(request)
    }

    mediosToArray(json) {
        if (json.error) return;
        this.medios = json.map(item=> item)
    }

    mediosFormValue(ids) {
        let result = [];
        if (ids) {
            ids.forEach(id => {
                result.push({id: id, name: this.mediosName(id)})
            });
        }
        return result;
    }

    mediosName(id) {
        let result = 'Otro';
        this.medios.forEach(item => {
            if (item.id == id) {
                result = item.name;
            }
        });

        return result;
    }
    // Medios Externos Incidente
    async getExternosData() {
        let request = await this.HttpClient.get(getExternosURL+'?access_token='+this.user.access_token).toPromise()
        this.externosToArray(request)
    }

    externosToArray(json) {
        if (json.error) return false;

        this.externos = json.map( externo => externo)
        return true;
        
    }

    externosFormValue(ids) {
        let result = [];
        if (ids) {
            ids.forEach(id => {
                result.push({id: id, name: this.externosName(id)})
            });
        }
        return result;
    }

    externosName(id) {
        let result = 'Otro';
        this.externos.forEach(item => {
            if (item.id == id) {
                result = item.name;
            }
        });

        return result;
    }
    // Municipios Incidente Persona
    async getMunicipiosData() {
        let request = await this.HttpClient.get(getMunicipiosURL+'?access_token='+this.user.access_token).toPromise()
        this.municipiosToArray(request)
    }
    municipiosToArray(json) {
        if (json.error) return false;

        this.municipios = json.map( item => item)
        return 
        

    }
    // Paises
    async getPaisesData() {
        try {
            let countries = await this.HttpClient.get(getPaisesURL).toPromise();
            this.paises = this.paisesToArray(countries);
            return;
        } catch (error) {
            return
        }

    }

    paisesToArray(json) {
        if(json.error) return [];
        let paises = json.filter( country => country.translations.spa != null ).map( country => {return country.translations.spa.common});
        return paises;
    }


    // Perfiles Incidente Persona
    async getPerfilesData() {
        let request = await this.HttpClient.get(getPerfilesURL+'?access_token='+this.user.access_token).toPromise()
        this.perfilesToArray(request)
    }

    perfilesToArray(json) {
        if (json.error) return;
        this.perfiles = json
        
    }
    // Traslados Incidente Persona
    async getTrasladosData(){
        let request = await this.HttpClient.get(getTrasladosURL+'?access_token='+this.user.access_token).toPromise()
        this.trasladosToArray(request)
    }
    trasladosToArray(json) {
        if (json.error) return;
        this.traslados = json
        return;
    }

    // MotivosAuxilio
    async getMotivosAuxilioData() {
        let request = await this.HttpClient.get(getMotivosAuxilioURL+'?access_token='+this.user.access_token).toPromise()
        this.motivosAuxilioToArray(request)
    }

    motivosAuxilioToArray(json) {
        if (json.error) return ;
        this.motivosAuxilio = json.map(aux => aux)
    }

    motivosAuxilioFormValue(ids) {
        let result = [];
        if (ids) {
            ids.forEach(id => {
                result.push({id: id, name: this.motivosAuxilioName(id)})
            });
        }
        return result;
    }

    motivosAuxilioName(id) {
        let result = 'Otro';
        this.motivosAuxilio.forEach(item => {
            if (item.id == id) {
                result = item.name;
            }
        });

        return result;
    }

    // CausasAuxilio
    async getCausasAuxilioData() {
        let request = await this.HttpClient.get(getCausasAuxilioURL+'?access_token='+this.user.access_token).toPromise()
        this.causasAuxilioToArray(request)
    }

    causasAuxilioToArray(json) {
        if (json.error) return false;
        this.causasAuxilio = json.map( causaAux => causaAux)
        return true;
        
    }

    causasAuxilioFormValue(ids) {
        let result = [];
        if (ids) {
            ids.forEach(id => {
                result.push({id: id, name: this.causasAuxilioName(id)})
            });
        }
        return result;
    }

    causasAuxilioName(id) {
        let result = 'Otro';
        this.causasAuxilio.forEach(item => {
            if (item.id == id) {
                result = item.name;
            }
        });

        return result;
    }

    // MotivosRescate
    async getMotivosRescateData() {
        let request = await this.HttpClient.get(getMotivosRescateURL+'?access_token='+this.user.access_token).toPromise()
        this.motivosRescateToArray(request)
    }

    motivosRescateToArray(json) {
        if (json.error) return;
        this.motivosRescate = json.map(item => item)
    }

    motivosRescateFormValue(ids) {
        let result = [];
        if (ids) {
            ids.forEach(id => {
                result.push({id: id, name: this.motivosRescateName(id)})
            });
        }
        return result;
    }

    motivosRescateName(id) {
        let result = 'Otro';
        this.motivosRescate.forEach(item => {
            if (item.id == id) {
                result = item.name;
            }
        });

        return result;
    }
    // MotivosEvacuacion
    async getMotivosEvacuacionData(){
        let request = await this.HttpClient.get(getMotivosEvacuacionURL+'?access_token='+this.user.access_token).toPromise()
        this.motivosEvacuacionToArray(request)
    }

    motivosEvacuacionToArray(json) {
        if (json.error) return ;
        this.motivosEvacuacion = json
        return;
        
    }

    // Cuerpos
    async getCuerposData() {
        let request = await this.HttpClient.get(getCuerposURL+'?access_token='+this.user.access_token).toPromise()
        this.cuerposToArray(request)
    }

    cuerposToArray(json) {
        if (json.error) return;
        this.cuerpos = json
        return ;
    }

    cuerposFormValue(ids) {
        let result = [];
        if (ids) {
            ids.forEach(id => {
                result.push({id: id, name: this.cuerposName(id)})
            });
        }
        return result;
    }

    cuerposName(id) {
        let result = 'Otro';
        this.cuerpos.forEach(item => {
            if (item.id == id) {
                result = item.name;
            }
        });

        return result;
    }

    // GeneralConfig
    async getGeneralConfigData() {
        let request = await this.HttpClient.get(getGeneralConfigURL+'?access_token='+this.user.access_token).toPromise()
        this.generalConfigToArray(request)
    }

    generalConfigToArray(json) {
        if (json.error) return false;
        this.generalConfig = [];
        for(let item of json) {
            this.generalConfig[item.name] = item.value;
        }
        return true;
    }
}