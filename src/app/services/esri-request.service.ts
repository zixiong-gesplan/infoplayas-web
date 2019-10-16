import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {environment} from '../../environments/environment.prod';
import {Attribute} from '../models/attribute';

@Injectable()
export class EsriRequestService {
    private featuresSource = new BehaviorSubject<any[]>([]);
    features$ = this.featuresSource.asObservable();

    constructor(private http: HttpClient) {
    }

    getEsriDataLayer(featureEndPoint: string, cWhere: string, outFields: string, geometry: boolean, token: string, order: string,
                     centro: boolean) {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');

        const params = new HttpParams().set('token', token).append('f', 'json')
            .append('where', cWhere)
            .append('orderByFields', order)
            .append('outFields', outFields)
            .append('returnCentroid', centro ? 'true' : 'false')
            .append('returnGeometry', geometry ? 'true' : 'false');
        return this.http.post(featureEndPoint, params, {headers: headers});
    }

    getEsriRelatedData(featureEndPoint: string, parentIds: string, relationId: string, outFields: string,
                       geometry: boolean, token: string) {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');

        const params = new HttpParams().set('token', token).append('f', 'json')
            .append('objectIds', parentIds)
            .append('outFields', outFields)
            .append('returnGeometry', geometry ? 'true' : 'false')
            .append('relationshipId', relationId);
        return this.http.post(featureEndPoint, params, {headers: headers});
    }

    updateEsriData(featureEndPoint: string, data: Object, mode: string, token: string) {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');
        const params = new HttpParams().set('token', token).append('f', 'json')
            .append(mode, JSON.stringify(data));
        return this.http.post(featureEndPoint, params, {headers: headers});
    }

    deleteEsriData(featureEndPoint: string, token: string, objectIds: number[]) {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');

        const params = new HttpParams().set('token', token).append('f', 'json')
            .append('objectIds', objectIds.join(','));
        return this.http.post(featureEndPoint, params, {headers: headers});
    }

    getEsriLayerIdsOnly(featureEndPoint: string, token: string, cWhere: string) {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');

        const params = new HttpParams().set('token', token).append('f', 'json')
            .append('where', cWhere)
            .append('returnIdsOnly', 'true');
        return this.http.post(featureEndPoint, params, {headers: headers});
    }

    getMultipleRelatedData(objectids: number[], relationsIds: string[], token: string) {
        const httpRequests = [];
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');

        relationsIds.forEach(value => {
            const params = new HttpParams().set('token', token).append('f', 'json')
                .append('objectIds', objectids.join(','))
                .append('outFields', '*')
                .append('returnGeometry', 'false')
                .append('relationshipId', value);
            httpRequests.push(this.http.post(environment.infoplayas_catalogo_edicion_url + '/queryRelatedRecords',
                params, {headers: headers}));
        });

        forkJoin(httpRequests).subscribe(results => {
            const features = [];
            if (results) {
                objectids.forEach(f => {
                    const ob = {objectId: f};
                    for (let i = 0; i < httpRequests.length; i++) {
                        const cad = i + 1;
                        ob['relatedRecords' + cad] = results[i].relatedRecordGroups.find(r => r.objectId === f) ?
                            results[i].relatedRecordGroups.find(r => r.objectId === f) : [];
                        delete ob['relatedRecords' + cad].objectId;
                    }
                    features.push(ob);
                });
                this.featuresSource.next(features);
            }
        });
    }
}
