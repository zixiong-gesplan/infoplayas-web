import {Injectable} from '@angular/core';
import {Attribute} from '../models/attribute';
import {GradeRecord} from '../models/grade-record';

@Injectable({
    providedIn: 'root'
})


export class GradesProtectionService {

    constructor() {
    }

    calculateGradeForPeriods(incidents_Sports, env_sea, periods: Attribute[]): GradeRecord[] {
        // calculos para el valor de peligrosidad Incidentes y actividades deportivas
        const vIncidents = incidents_Sports[0].attributes.incidentes_mgraves > 0 ? 5 :
            incidents_Sports[0].attributes.incidentes_graves > 0 ? 3 : 0;
        let dangerLevel = incidents_Sports[0].attributes.actividades_deportivas ? 5 : 0;
        dangerLevel -= incidents_Sports[0].attributes.balizamiento ? 4 : 0;
        dangerLevel -= incidents_Sports[0].attributes.actividades_acotadas ? 2 : 0;
        const vSports = dangerLevel > 0 ? dangerLevel : 0;
        // calculos para el valor de peligrosidad condiciones del entorno fisico y del mar
        const vSeaConditions = env_sea[0].attributes.peligrosidad_mar;
        const vEnvironment = env_sea[0].attributes.peligros_anadidos > 0 ?
            env_sea[0].attributes.accesos === 'SDIF' ? 1 :
                env_sea[0].attributes.accesos === 'AVHC' ? 3 : 5 : 0;
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
