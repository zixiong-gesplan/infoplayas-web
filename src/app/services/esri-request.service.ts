import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class EsriRequestService {

    constructor(private http: HttpClient) {
    }

    getEsriDataLayer(featureEndPoint: string, cWhere: string, outFields: string, geometry: boolean, token: string) {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');

        const params = new HttpParams().set('token', token).append('f', 'json')
            .append('where', cWhere)
            .append('orderByFields', 'clasificacion')//ordenamos por el campo clasificacion
            .append('outFields', outFields)
            .append('returnGeometry', geometry ? 'true' : 'false')
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
}
