import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RequestService {

    constructor(private http: HttpClient) {
    }

    getIstacData(indicator: string, representation: string) {
        const params = new HttpParams().set('representation', representation)
            .append('granularity', 'GEOGRAPHICAL[MUNICIPALITIES],TIME[YEARLY]')
            .append('fields', '-observationsMetadata');
        return this.http.get(environment.istac + indicator, {params: params});
    }

    meteoData(lat, lon) {
        return this.http.get('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon
            + '&APPID=237a80e2e639efd0fadf62f91c0b65e7&units=metric&lang=es');
    }


}
