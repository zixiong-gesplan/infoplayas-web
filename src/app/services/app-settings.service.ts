import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AppSetting} from '../models/app-setting';

@Injectable({
    providedIn: 'root'
})
export class AppSettingsService {

    constructor(private http: HttpClient) {
    }

    public getJSON(): Observable<any> {
        return this.http.get('assets/js/esri-custom/aytos.json');
    }
}
