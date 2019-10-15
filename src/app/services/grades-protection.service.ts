import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {EsriRequestService} from './esri-request.service';
import {AuthGuardService} from './auth-guard.service';
import {Attribute} from '../models/attribute';
import {GradeRecord} from '../models/grade-record';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, forkJoin} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GradesProtectionService {
    private featuresSource = new BehaviorSubject<any[]>([]);
    features$ = this.featuresSource.asObservable();
    Publicrecords: GradeRecord[];
    private recordsSource = new BehaviorSubject<any>([]);
    filterRecords = this.recordsSource.asObservable();

    constructor(private service: EsriRequestService, private authService: AuthGuardService, private http: HttpClient) {
    }

    calculate(parentid: string, token: string) {
        const records = [];
        const httpRequests = [];
        const relationsIds = ['1', '2', '3'];
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');


        relationsIds.forEach(value => {
            const params = new HttpParams().set('token', token).append('f', 'json')
                .append('objectIds', parentid)
                .append('outFields', '*')
                .append('returnGeometry', 'false')
                .append('relationshipId', value);
            httpRequests.push(this.http.post(environment.infoplayas_catalogo_edicion_url + '/queryRelatedRecords',
                params, {headers: headers}));
        });

        forkJoin(httpRequests).subscribe(results => {
            if (results[0].relatedRecordGroups.length > 0 && results[1].relatedRecordGroups.length > 0
                && results[2].relatedRecordGroups.length > 0) {
                // calculos para el valor de peligrosidad Incidentes y actividades deportivas
                const incidents_Sports = (results[0] as any).relatedRecordGroups[0].relatedRecords[0].attributes;
                const vIncidents = incidents_Sports.incidentes_mgraves > 0 ? 5 :
                    incidents_Sports.incidentes_graves > 0 ? 3 : 0;
                let dangerLevel = incidents_Sports.actividades_deportivas ? 5 : 0;
                dangerLevel -= incidents_Sports.balizamiento ? 4 : 0;
                dangerLevel -= incidents_Sports.actividades_acotadas ? 2 : 0;
                const vSports = dangerLevel > 0 ? dangerLevel : 0;
                // calculos para el valor de peligrosidad condiciones del entorno fisico y del mar
                const env_sea = (results[1] as any).relatedRecordGroups[0].relatedRecords[0].attributes;
                const vSeaConditions = env_sea.peligrosidad_mar;
                const vEnvironment = env_sea.peligros_anadidos ?
                    env_sea.accesos === 'SDIF' ? 1 :
                        env_sea.accesos === 'AVHC' ? 3 : 5 : 0;
                // traemos los periodos y niveles de afluencia

                const periods: Attribute[] = (results[2] as any).relatedRecordGroups[0].relatedRecords;
                periods.forEach(value => {
                    records.push({
                        fecha_fin: new Date(value.attributes.fecha_fin),
                        fecha_inicio: new Date(value.attributes.fecha_inicio),
                        incluir_dias: value.attributes.incluir_dias,
                        afluencia: value.attributes.nivel
                    });
                });
                // calculos de poblacion
                const municipio = JSON.parse(localStorage.getItem('municipality'));
                const cargaPoblacional = Math.round((municipio.beds * municipio.occupation * 0.01)) + municipio.population;
                const vPopulation = this.getDangerPopulationLevel(cargaPoblacional);
                // calculo del grado
                const riskfactors = (vIncidents + vSports + vSeaConditions + vEnvironment + vPopulation) / 5;
                const riskLvl = riskfactors > 4 ? 'A' : riskfactors > 2 ? 'M' : 'B';
                records.forEach(value => {
                    value.grado = this.calculateGradeLvl(value.afluencia, riskLvl);
                    value.grado_valor = value.grado === 'A' ? 2 : value.grado === 'M' ? 1 : 0;
                });
                this.Publicrecords = records;
                const temp = [...new Set(records.map(x => x.grado))];
                this.recordsSource.next(temp);
            } else {
                this.recordsSource.next({nodata: ''});
            }
        });
    }

    calculateAll(parentids: number[], token: string) {
        let features = [];
        const httpRequests = [];
        const relationsIds = ['1', '2', '3'];
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/X-www-form-urlencoded');

        const paramsA = new HttpParams().set('token', token).append('f', 'json')
            .append('where', '1=1')
            .append('outFields', 'objectid_12')
            .append('returnCentroid', 'true')
            .append('returnGeometry', 'false')
            .append('objectIds', parentids.join(','));
        httpRequests.push(this.http.post(environment.infoplayas_catalogo_edicion_url + '/query',
            paramsA, {headers: headers}));

        relationsIds.forEach(value => {
            const paramsB = new HttpParams().set('token', token).append('f', 'json')
                .append('objectIds', parentids.join(','))
                .append('outFields', '*')
                .append('returnGeometry', 'false')
                .append('relationshipId', value);
            httpRequests.push(this.http.post(environment.infoplayas_catalogo_edicion_url + '/queryRelatedRecords',
                paramsB, {headers: headers}));
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

    getDangerPopulationLevel(cargaPoblacional: number): number {
        const dangerPopulationLimits: number[] = [0, 5000, 20000, 100000];
        let n = 0;
        while (cargaPoblacional > dangerPopulationLimits[n]) {
            n += 1;
        }
        const lisValues: number [] = [0, 1, 3, 5];
        return n > 0 ? lisValues[n - 1] : 0;
    }

    calculateGradeLvl(flow, riskLvl): string {
        const aRisk_Flow = [
            ['BB', 'B'],
            ['BM', 'M'],
            ['BA', 'A'],
            ['MB', 'B'],
            ['MM', 'M'],
            ['MA', 'A'],
            ['AB', 'M'],
            ['AM', 'A'],
            ['AA', 'A'],
        ];
        return aRisk_Flow.filter(x => x[0] === riskLvl + flow)[0][1];
    }
}
