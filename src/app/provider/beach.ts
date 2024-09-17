import { Injectable, inject } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment'
import { Incident } from './incident';
import { Affected } from './affected';

let playasURL = environment.SERVER_URL+"core/beach";

export class Beach {
    id: number;
    name: string;
    DGSE: string;
    island: string;
    municipality: string;
    flag?: number;
    temperature?: number;
    windSpeed?: number;
    windOrientation?: string;
    influxLvl?: number;
    sector?: string;
    updated?: Date;
    aemet?: string;
    srArea?: number;
    id_sanidad?: string;
    incidents: Incident[] = [];
    affectedPeople:Affected [] = [];
    latitude:number|string;
    longitude:number|string;
    img:any;//imagen de las incidencias
}
export class Municipality{
    id: number;
    island: string;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class BeachProvider {
    private http = inject(HttpClient);


    loading: any;

    beachs: Beach[] = [];

    islas: any[] = [];
    municipios: any[] = [];
    municipiosName: any[] = [];
    
    async getAll(){        
        let beachs = await this.http.get(`${playasURL}`).toPromise() as Beach[];
        this.beachs = beachs;

        return this;
        //return new Promise( )
    }

    filter(municipality){
        let beachs = this.beachs.filter( beach =>{
            return beach.municipality == municipality;
        })

        return beachs;
    }
}