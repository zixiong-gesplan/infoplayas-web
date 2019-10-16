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
    private featuresSource1 = new BehaviorSubject<any[]>([]);
    features1$ = this.featuresSource1.asObservable();
    Publicrecords: GradeRecord[];
    private recordsSource = new BehaviorSubject<any>([]);
    filterRecords = this.recordsSource.asObservable();

    constructor(private service: EsriRequestService, private authService: AuthGuardService, private http: HttpClient) {
    }

    calculateGradeForPeriods(incidents_Sports, env_sea, periods: Attribute[]): GradeRecord[] {
        // calculos para el valor de peligrosidad Incidentes y actividades deportivas
        const vIncidents = incidents_Sports.incidentes_mgraves > 0 ? 5 :
            incidents_Sports.incidentes_graves > 0 ? 3 : 0;
        let dangerLevel = incidents_Sports.actividades_deportivas ? 5 : 0;
        dangerLevel -= incidents_Sports.balizamiento ? 4 : 0;
        dangerLevel -= incidents_Sports.actividades_acotadas ? 2 : 0;
        const vSports = dangerLevel > 0 ? dangerLevel : 0;
        // calculos para el valor de peligrosidad condiciones del entorno fisico y del mar
        const vSeaConditions = env_sea.peligrosidad_mar;
        const vEnvironment = env_sea.peligros_anadidos ?
            env_sea.accesos === 'SDIF' ? 1 :
                env_sea.accesos === 'AVHC' ? 3 : 5 : 0;
        // traemos los periodos y niveles de afluencia
        const records = [];
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
        return records;
    }

    // sacamos el valor del grado mas alto
    getMaximunGrade(records: GradeRecord[]) {
        records.sort((a, b) => (b.grado_valor > a.grado_valor) ? 1 : ((a.grado_valor > b.grado_valor) ? -1 : 0));
        return records[0].grado;
    }

    getDistinctGrades(records: GradeRecord[]) {
        return [...new Set(records.map(x => x.grado))];
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
