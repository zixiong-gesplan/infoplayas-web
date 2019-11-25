import {Injectable} from '@angular/core';
import {Auth} from '../models/auth';
import {Municipality} from '../models/municipality';
import {RequestService} from './request.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {BehaviorSubject} from 'rxjs';

declare const aytos: any;

@Injectable({
    providedIn: 'root'
})
export class PopulationService {

    private sMunicipalitySource = new BehaviorSubject<Municipality>({});
    sMunicipality$ = this.sMunicipalitySource.asObservable();
    private populationName: string;

    constructor(private service: RequestService, private spinnerService: Ng4LoadingSpinnerService) {
    }

    getMunicipality(): Municipality {
        return JSON.parse(localStorage.getItem('municipality'));
    }


    public isMunicipalityStore(current_user: Auth): boolean {
        const mun: Municipality = this.getMunicipality();
        const currentDate = new Date();
        if (mun && current_user.username !== mun.user) {
            return false;
        }
        if (mun && currentDate.getFullYear() - 1 > Number(mun.year)) {
            return false;
        } else {
            return !!mun;
        }
    }

    updateMunicipality(name: string) {
        this.populationName = name;
        this.spinnerService.show();
        this.getLastYearIstacData();
    }

    getLastYearIstacData() {
        const representation = 'MEASURE[ABSOLUTE]';
        this.service.getIstacData('POBLACION/data', representation).subscribe(
            (result: any) => {
                if (result) {
                    const index = Object.keys(result.dimension.TIME.representation.index).length - 1;
                    this.getLastYearIstacData2(Number(Object.keys(result.dimension.TIME.representation.index)[index]));
                }
            },
            error => {
                console.log(error.toString());
                this.spinnerService.hide();
                this.blockEditProteccionData();
            });
    }

    /* En caso de error de los servicios del ISTAC ajeno a la pagina, comprobamos que hay datos en la localStorage, sino bloqueamos edicion
     en los sitios donde se use el valor de peligrosidad por carga poblacional */
    blockEditProteccionData() {
        const mun: Municipality = this.getMunicipality();
        if (!mun) {
            // TODO bloqueamos
        }
    }

    getLastYearIstacData2(popYear: number) {
        const representation = 'MEASURE[ABSOLUTE]';
        this.service.getIstacData('ALOJATUR_PLAZAS_OCUPACION/data', representation).subscribe(
            (result: any) => {
                if (result) {
                    const index = Object.keys(result.dimension.TIME.representation.index).length - 1;
                    const tmpyear = Number(Object.keys(result.dimension.TIME.representation.index)[index]);
                    const lastYear = tmpyear < popYear ? tmpyear : popYear;
                    const mun: Municipality = this.getMunicipality();
                    if (mun && lastYear > Number(mun.year)) {
                        this.setIstacData(lastYear);
                    } else if (mun && this.populationName !== mun.user) {
                        this.setIstacData(lastYear);
                    } else if (!mun) {
                        this.setIstacData(lastYear);
                    } else {
                        this.spinnerService.hide();
                    }
                }
            },
            error => {
                console.log(error.toString());
                this.spinnerService.hide();
                this.blockEditProteccionData();
            });
    }

    setIstacData(year: number) {
        const mun: Municipality = {
            user: this.populationName,
            year: year,
            ayuntamiento: aytos[this.populationName].municipio_mayus
        };
        const representation = 'GEOGRAPHICAL[' + aytos[mun.user].istac_code + '],MEASURE[ABSOLUTE],TIME[' + year + ']';
        this.service.getIstacData('POBLACION/data', representation).subscribe(
            (result: any) => {
                if (result) {
                    mun.population = Number(result.observation[0]);
                    this.setBeds(mun, representation);
                }
            },
            error => {
                console.log(error.toString());
                this.blockEditProteccionData();
                this.spinnerService.hide();
            });
    }

    /* plazas hoteleras y extrahoteleras (apartamentos) ofertadas por municipio. En caso de que el ISTAC incluya al municipio consultado
    en las plazas del resto de la isla, la cantidad para el valor de peligrosidad se calculará a razon del 5 por mil que es la media
    ponderada de la población de ese resto de municipios de la isla en tenerife. Usaremos el mismo valor para el mismo caso de otras islas
    ya que a esos valores de municipios con poco peso turistico el valor aportado por la población turistica es despreciable respecto a los rangos del valor de
     peligrosidad por carga poblacional */
    private setBeds(pop: Municipality, representation: string) {
        this.service.getIstacData('ALOJATUR_PLAZAS_OFERTADAS/data', representation).subscribe(
            (result: any) => {
                if (result) {
                    pop.beds = result.observation.length > 0 ? Number(result.observation[0]) : Math.trunc(5 * 0.001 * pop.population);
                    this.setOccupation(pop, representation);
                }
            },
            error => {
                console.log(error);
                this.blockEditProteccionData();
                this.spinnerService.hide();
            });
    }

    /* Tasa de ocupación por plazas: se define como la relación expresada en porcentaje entre el total de las pernoctaciones en un mes
    determinado y el producto de las plazas hoteleras y extrahoteleras, excluyendo las camas supletorias, por el número de días que ese mes
    tiene. Para los municipios de poco peso turistico se aplicara el 65 % de tasa de ocupacion debido al escaso impacto de la poblacion
    turistica en el computo total y las escalas en el valor de peligrosidad */
    private setOccupation(pop: Municipality, representation: string) {
        this.service.getIstacData('ALOJATUR_PLAZAS_OCUPACION/data', representation).subscribe(
            (result: any) => {
                if (result) {
                    pop.occupation = result.observation.length > 0 ? Number(result.observation[0]) : 65;
                    localStorage.setItem('municipality', JSON.stringify(pop));
                    this.sMunicipalitySource.next(pop);
                }
            },
            error => {
                console.log(error);
            }).add(() => {
            this.spinnerService.hide();
            this.blockEditProteccionData();
            console.log('end of request');
        });
    }
}
