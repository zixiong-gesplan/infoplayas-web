import { HttpClient } from "@angular/common/http";
import { DatePipe } from '@angular/common';

import { Injectable, inject } from "@angular/core";
import { Affected } from "./affected";

import { environment } from "src/environments/environment";
import { UserProvider } from "./user";

const incidentURL = (municipality) =>  `${environment.SERVER_URL}core/report?municipality=${encodeURI(municipality)}`;
const incidentPostURL =  `${environment.SERVER_URL}api/action/incident`;

export class Incident {
    id:number;
    type:number = -1;
    //dateInit:string;
    //dateEnd:string;
    alarmSender:string;
    numberLifeGuard:number | null;
    observation: string;
    hourCall112:string;
    delayArriveExternalResources:number;
    affectedPeopleNumber: number = 0;
    evacuation: string | null;
    cecoes: string | null;
    isLifeGuardCall: string;
    beachName:string;
    flagIncident:number|null; //bandera que habia en ese momento
    affectedPeople: Affected[] = [];
    date: string;
    pointLocation:string;
    resourcesUsed:[];
    externalResourcesUsed:[];
    //usuario de la incidencia
    adviser:number;
    beach:number;
    dateEnd:Date;
    dateIni:Date;
    mobilizedAgents:string[];
    point:string;
    lat:number;
    lng:number
}


@Injectable({
    providedIn: 'root',
})
export class IncidentProvider{
    private http = inject(HttpClient);
    private datePipe = inject(DatePipe);
    private userProvider = inject(UserProvider);

    incidents: Incident[]
    
    emergencyGrade = {
        0: 'Ileso',
        1: 'Leve',
        2: 'Grave',
        3: 'Éxitus'
    }

    typeIntervention = {
        0: 'Primeros Auxilios',
        1: 'Rescate Acuático'
    }

    async getAll(municipality:string){
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        
        let url = incidentURL(municipality);

        let incidents = await this.http.get(url).toPromise() as any[]
        
        this.incidents = incidents.map( item =>{

            let i = this.formatFrontEnd(item)
            return i
        })

        return this;
    }

    formatFrontEnd(incident:any) {

        let {beachLocation,affectedPeople,createdAt,image1,image2,image3,...i} = incident
        let formatter:Incident = i;
        formatter.beachName = beachLocation.name;
        formatter.affectedPeople = affectedPeople;
        formatter.affectedPeople.forEach( person =>{
            person.idIncident = formatter.id;
        })
        formatter.date = new Date(Date.parse(i.dateIni)).toLocaleDateString('en-GB')
        formatter.hourCall112 = new Date(Date.parse(i.hourCall112)).toLocaleTimeString('it-IT')
        return formatter
    }

    async sendIncident(incident:Incident){
        let incidentAction = JSON.stringify({
            id: incident.id,
            adviser: incident.adviser,
            beach: incident.beachName,
            point: incident.pointLocation,
            affectedPeopleNumber: incident.affectedPeopleNumber,
            affectedPeople: this.parseAffectedPeople(incident.affectedPeople),
            type: incident.type ?? "",
            alarmSender: incident.alarmSender ?? "",
            externalResourcesUsed: incident.externalResourcesUsed ?? "",
            isLifeGuardCall: incident.isLifeGuardCall ?? "",
            cecoes: incident.cecoes ?? "",
            numberLifeGuard: incident.numberLifeGuard ?? "",
            mobilizedAgents: incident.mobilizedAgents ?? [],
            observation: incident.observation ?? "",
            resourcesUsed: incident.resourcesUsed ??[],
           
            delayArriveExternalResources: incident.delayArriveExternalResources,
            evacuation: incident.evacuation ?? "",
            dateIni: incident.dateIni.toLocaleString('en-GB'),
            dateEnd: incident.dateEnd ? incident.dateEnd.toLocaleString('en-GB'): "",
            hourCall112: incident.hourCall112 ? incident.hourCall112 :"",
        });
        let response = await this.http.post(
            `${incidentPostURL}?access_token=${this.userProvider.user.access_token}`,
            {incidentAction:incidentAction},
            {
                headers:{'Accept':'application/json'}
            }
        ).toPromise()  
        console.log(response)
        return
    }

    parseAffectedPeople(affectedPeople: Affected[]) {
        let res = [];
        for (let ap of affectedPeople) {
            let item = {
                age: ap.age,
                country: ap.country,
                emergencyGrade: ap.emergencyGrade,
                firstAidCauses: ap.firstAidCauses,
                firstAidReason: ap.firstAidReason,
                gender: ap.gender,
                highVolunteer: ap.highVolunteer,
                municipality: ap.municipality,
                profile: ap.profile,
                requireFirstAid: ap.typeIntervention ? ap.requireFirstAid : true,
                rescueReason: ap.rescueReason,
                substance: ap.substance,
                translationCenter: ap.translationCenter,
                typeIntervention: ap.typeIntervention,
                usedDesa: ap.usedDesa
            }
            res.push(item);

        }
        return res;
    }


}