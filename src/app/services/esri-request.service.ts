import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {forkJoin} from 'rxjs';
import {environment} from '../../environments/environment.prod';
import {Attribute} from '../models/attribute';

@Injectable()
export class EsriRequestService {
    beachs: any[];

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
        let features = [];
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
            features = [...results[0].features];
            let list1 = [...results[1].relatedRecordGroups];
            let list2 = [...results[2].relatedRecordGroups];
            let list3 = [...results[3].relatedRecordGroups];
            const oplist = list1.filter(a => list2.some(b => a.objectId === b.objectId));
            const filter = oplist.filter(a => list3.some(b => a.objectId === b.objectId));
            if (filter.length > 0) {
                features = features.filter(a => filter.some(b => a.attributes.objectid_12 === b.objectId));
                list1 = list1.filter(a => filter.some(b => a.objectId === b.objectId));
                list2 = list2.filter(a => filter.some(b => a.objectId === b.objectId));
                list3 = list3.filter(a => filter.some(b => a.objectId === b.objectId));
                let i = 0;
                features.forEach(f => {
                    // calculos para el valor de peligrosidad Incidentes y actividades deportivas
                    const incidents_Sports = list1[i].relatedRecords[0].attributes;
                    const vIncidents = incidents_Sports.incidentes_mgraves > 0 ? 5 :
                        incidents_Sports.incidentes_graves > 0 ? 3 : 0;
                    let dangerLevel = incidents_Sports.actividades_deportivas ? 5 : 0;
                    dangerLevel -= incidents_Sports.balizamiento ? 4 : 0;
                    dangerLevel -= incidents_Sports.actividades_acotadas ? 2 : 0;
                    const vSports = dangerLevel > 0 ? dangerLevel : 0;
                    // calculos para el valor de peligrosidad condiciones del entorno fisico y del mar
                    const env_sea = list2[i].relatedRecords[0].attributes;
                    const vSeaConditions = env_sea.peligrosidad_mar;
                    const vEnvironment = env_sea.peligros_anadidos ?
                        env_sea.accesos === 'SDIF' ? 1 :
                            env_sea.accesos === 'AVHC' ? 3 : 5 : 0;
                    // traemos los periodos y niveles de afluencia
                    const records = [];
                    const periods: Attribute[] = list3[i].relatedRecords;
                    periods.forEach(p => {
                        records.push({
                            fecha_fin: new Date(p.attributes.fecha_fin),
                            fecha_inicio: new Date(p.attributes.fecha_inicio),
                            incluir_dias: p.attributes.incluir_dias,
                            afluencia: p.attributes.nivel
                        });
                    });
                    // calculos de poblacion
                    const municipio = JSON.parse(localStorage.getItem('municipality'));
                    const cargaPoblacional = Math.round((municipio.beds * municipio.occupation * 0.01)) + municipio.population;
                    const vPopulation = this.getDangerPopulationLevel(cargaPoblacional);
                    // calculo del grado
                    const riskfactors = (vIncidents + vSports + vSeaConditions + vEnvironment + vPopulation) / 5;
                    const riskLvl = riskfactors > 4 ? 'A' : riskfactors > 2 ? 'M' : 'B';
                    records.forEach(r => {
                        r.grado = this.calculateGradeLvl(r.afluencia, riskLvl);
                        r.grado_valor = r.grado === 'A' ? 2 : r.grado === 'M' ? 1 : 0;
                    });
                    features[i].records = records;
                    // sacamos el valor del grado mas alto
                    records.sort((a, b) => (b.grado_valor > a.grado_valor) ? 1 : ((a.grado_valor > b.grado_valor) ? -1 : 0));
                    features[i].grado_maximo = records[0].grado;
                    // preparamos el objeto para que tenga la estructura para añadir a la capa grafica de un mapa.
                    features[i].geometry = features[i].centroid;
                    delete features[i].centroid;
                    features[i].geometry.spatialReference = {
                        latestWkid: 32628,
                        wkid: 32628
                    };
                    i += 1;
                });
                this.featuresSource.next(features);
            }
        });
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
                    (results[i] as any).relatedRecords = results[i + 1].relatedRecordGroups[0] ?
                        results[i + 1].relatedRecordGroups[0].relatedRecords : [];
                    this.beachs.push(results[i]);
                }
                console.log(this.beachs);
            }
        });
    }

}
