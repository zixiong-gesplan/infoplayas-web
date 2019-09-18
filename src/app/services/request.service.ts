import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment.prod';

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
}
