import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class RequestService {

    constructor(private http: HttpClient) {
    }

    getPopulation(code: string, year: number) {
        const params = new HttpParams().set('representation', 'GEOGRAPHICAL[' + code + '],MEASURE[ABSOLUTE]' + ',TIME[' + year + ']');
        return this.http.get(environment.istac_poblacion, {params: params});
    }

    getBeds(code: string, year: number) {
        const params = new HttpParams().set('representation', 'GEOGRAPHICAL[' + code + '],MEASURE[ABSOLUTE]' + ',TIME[' + year + ']');
        return this.http.get(environment.istac_plazas, {params: params});
    }

    getOccupation(code: string, year: number) {
        const params = new HttpParams().set('representation', 'GEOGRAPHICAL[' + code + '],MEASURE[ABSOLUTE]' + ',TIME[' + year + ']');
        return this.http.get(environment.istac_ocupacion, {params: params});
    }
}
