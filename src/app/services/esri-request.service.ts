import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {forkJoin} from 'rxjs';

@Injectable()
export class EsriRequestService {
    beachs: any[];

    constructor(private http: HttpClient) {
    }

    getEsriDataLayer(featureEndPoint: string, cWhere: string, outFields: string, geometry: boolean, token: string, order: string, centro: boolean) {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');

        const params = new HttpParams().set('token', token).append('f', 'json')
            .append('where', cWhere)
            .append('orderByFields', order)//ordenamos por el campo clasificacion
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

    getAllData(featureEndPoint, featureEndPointRelated, relationshipId, cWhere, token, parentIds: string[]) {
        this.beachs = [];
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');
        const myArrayOfFunction = [];
        parentIds.forEach(value => {
            const paramsA = new HttpParams().set('token', token).append('f', 'json')
                .append('where', cWhere)
                .append('outFields', '*')
                .append('returnCentroid', 'false')
                .append('returnGeometry', 'false')
                .append('objectIds', value);
            const paramsB = new HttpParams().set('token', token).append('f', 'json')
                .append('outFields', '*')
                .append('returnGeometry', 'false')
                .append('relationshipId', relationshipId)
                .append('objectIds', value);
            myArrayOfFunction.push(this.http.post(featureEndPoint, paramsA, {headers: headers}));
            paramsB.append('objectIds', value);
            myArrayOfFunction.push(this.http.post(featureEndPointRelated, paramsB, {headers: headers}));
        });

        forkJoin(myArrayOfFunction).subscribe(results => {
            // results[0] es la playa
            // results[1] es la tabla relacionada
            if (results) {
                for (let i = 0; i < myArrayOfFunction.length; i += 2) {
                    (results[i] as any).relatedRecords = results[i + 1].relatedRecordGroups[0] ? results[i + 1].relatedRecordGroups[0].relatedRecords : [];
                    this.beachs.push(results[i]);
                }
                console.log(this.beachs);
            }
        });
    }

}
