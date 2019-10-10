import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {EsriRequestService} from './esri-request.service';
import {AuthGuardService} from './auth-guard.service';
import {Attribute} from '../models/attribute';
import {GradeRecord} from '../models/grade-record';

@Injectable({
    providedIn: 'root'
})
export class GradesProtectionService {
    records: GradeRecord[];

    constructor(private service: EsriRequestService, private authService: AuthGuardService) {
    }

    calculate(parentid: string) {
        this.service.getEsriRelatedData(environment.infoplayas_catalogo_edicion_url + '/queryRelatedRecords',
            parentid, '3', '*', false, this.authService.getCurrentUser().token).subscribe(
            (result: any) => {
                if (result) {
                    this.records = [];
                    const periods: Attribute[] = result.relatedRecordGroups[0].relatedRecords;
                    periods.forEach(value => {
                        this.records.push({
                            fecha_fin: new Date(value.attributes.fecha_fin),
                            fecha_inicio: new Date(value.attributes.fecha_inicio),
                            incluir_dias: value.attributes.incluir_dias,
                            afluencia: value.attributes.nivel
                        });
                    });
                    this.loadData_incidents_sports(parentid);
                }
            },
            error => {
                console.log(error.toString());
            }).add(() => {
            console.log('end of request');
        });
    }

    loadData_incidents_sports(parentid: string) {
        this.service.getEsriRelatedData(environment.infoplayas_catalogo_edicion_url + '/queryRelatedRecords',
            parentid, '1', '*', false, this.authService.getCurrentUser().token).subscribe(
            (result: any) => {
                if (result) {
                    const incidents_Sports = {
                        incidentes_graves: result.relatedRecordGroups[0].relatedRecords[0].attributes.incidentes_graves,
                        incidentes_mgraves: result.relatedRecordGroups[0].relatedRecords[0].attributes.incidentes_mgraves,
                        actividades_deportivas: result.relatedRecordGroups[0].relatedRecords[0].attributes.incidentes_mgraves,
                        balizamiento: result.relatedRecordGroups[0].relatedRecords[0].attributes.balizamiento,
                        actividades_acotadas: result.relatedRecordGroups[0].relatedRecords[0].attributes.actividades_acotadas
                    };
                    // calculos para el valor de peligrosidad Incidentes y actividades deportivas
                    const vIncidents = incidents_Sports.incidentes_mgraves > 0 ? 5 :
                        incidents_Sports.incidentes_graves > 0 ? 3 : 0;
                    let dangerLevel = incidents_Sports.actividades_deportivas ? 5 : 0;
                    dangerLevel -= incidents_Sports.balizamiento ? 4 : 0;
                    dangerLevel -= incidents_Sports.actividades_acotadas ? 2 : 0;
                    const vSports = dangerLevel > 0 ? dangerLevel : 0;
                    this.loadData_sea_environment(parentid, vIncidents, vSports);
                }
            },
            error => {
                console.log(error.toString());
            });
    }

    loadData_sea_environment(parentid: string, pIncidents, pSports) {
        this.service.getEsriRelatedData(environment.infoplayas_catalogo_edicion_url + '/queryRelatedRecords',
            parentid, '2', '*', false, this.authService.getCurrentUser().token).subscribe(
            (result: any) => {
                if (result) {
                    const env_sea = {
                        peligrosidad_mar: result.relatedRecordGroups[0].relatedRecords[0].attributes.peligrosidad_mar,
                        peligros_anadidos: result.relatedRecordGroups[0].relatedRecords[0].attributes.peligros_anadidos,
                        accesos: result.relatedRecordGroups[0].relatedRecords[0].attributes.accesos,
                    };
                    // calculos para el valor de peligrosidad condiciones del entorno fisico y del mar
                    const vSeaConditions = env_sea.peligrosidad_mar;
                    const vEnvironment = env_sea.peligros_anadidos ?
                        env_sea.accesos === 'SDIF' ? 1 :
                            env_sea.accesos === 'AVHC' ? 3 : 5 : 0;
                    // calculos de poblacion
                    const municipio = JSON.parse(localStorage.getItem('municipality'));
                    const cargaPoblacional = Math.round((municipio.beds * municipio.occupation * 0.01)) + municipio.population;
                    const vPopulation = this.getDangerPopulationLevel(cargaPoblacional);
                    // calculo del grado
                    this.records.forEach(value => {
                        value.grado = this.calculateGradeLvl(value.afluencia, pIncidents, pSports, vSeaConditions, vEnvironment,
                            vPopulation);
                        value.grado_valor = value.grado === 'A' ? 2 : value.grado === 'M' ? 1 : 0;
                    });
                }
            },
            error => {
                console.log(error.toString());
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

    calculateGradeLvl(flow, vIncidents, vSports, vSeaConditions, vEnvironment, vPopulation): string {
        const riskfactors = (vIncidents + vSports + vSeaConditions + vEnvironment + vPopulation) / 5;
        const riskLvl = riskfactors > 4 ? 'A' : riskfactors > 2 ? 'M' : 'B';
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
