import {Component, OnInit} from '@angular/core';
import {AuthGuardService} from '../services/auth-guard.service';
import {Router} from '@angular/router';
import {Auth} from '../models/auth';
import {RequestService} from '../services/request.service';
import {Municipality} from '../models/municipality';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

declare const aytos: any;

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    private current_user: Auth;

    constructor(private service: RequestService, private authService: AuthGuardService, private spinnerService: Ng4LoadingSpinnerService,
                public router: Router) {
    }

    ngOnInit() {
        this.current_user = this.authService.getCurrentUser();
        if (!this.authService.isMunicipalityStore(this.current_user)) {
            this.spinnerService.show();
            this.getLastYearIstacData();
        }
    }

    userLogOut() {
        this.authService.logOut();
        window.location.href = '/';
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
            });
    }

    getLastYearIstacData2(popYear: number) {
        const representation = 'MEASURE[ABSOLUTE]';
        this.service.getIstacData('ALOJATUR_PLAZAS_OCUPACION/data', representation).subscribe(
            (result: any) => {
                if (result) {
                    const index = Object.keys(result.dimension.TIME.representation.index).length - 1;
                    const tmpyear = Number(Object.keys(result.dimension.TIME.representation.index)[index]);
                    const lastYear = tmpyear < popYear ? tmpyear : popYear;
                    const mun: Municipality = this.authService.getMunicipality();
                    if (mun && lastYear > Number(mun.year)) {
                        this.setIstacData(lastYear);
                    } else if (mun && this.current_user.username !== mun.user) {
                        this.setIstacData(lastYear);
                    } else if (!mun) {
                        this.setIstacData(lastYear);
                    }
                }
            },
            error => {
                console.log(error.toString());
            });
    }

    setIstacData(year: number) {
        const mun: Municipality = {
            user: this.current_user.username,
            year: year,
            ayuntamiento: aytos[this.current_user.username].municipio_mayus
        };
        const representation = 'GEOGRAPHICAL[' + aytos[mun.user].istac_code + '],MEASURE[ABSOLUTE],TIME[' + year + ']';
        this.service.getIstacData('POBLACION/data', representation).subscribe(
            (result: any) => {
                if (result) {
                    mun.population = Number(result.observation[0]);
                    this.setBeds(mun, year, representation);
                }
            },
            error => {
                console.log(error.toString());
                this.spinnerService.hide();
            });
    }

    /* plazas hoteleras y extrahoteleras (apartamentos) ofertadas por municipio. En caso de que el ISTAC incluya al municipio consultado
    en las plazas del resto de la isla, la cantidad para el valor de peligrosidad se calculará a razon del 5 por mil que es la media ponderada
    de la población de ese resto de municipios de la isla en tenerife. Usaremos el mismo valor para el mismo caso de otras islas ya que a esos
     valores de municipios con poco peso turistico el valor aportado por la población turistica es despreciable respecto a los rangos del valor de
     peligrosidad por carga poblacional */
    private setBeds(pop: Municipality, year: number, representation: string) {
        this.service.getIstacData('ALOJATUR_PLAZAS_OFERTADAS/data', representation).subscribe(
            (result: any) => {
                if (result) {
                    pop.beds = result.observation.length > 0 ? Number(result.observation[0]) : Math.trunc(5 * 0.001 * pop.population);
                    this.setOccupation(pop, year, representation);
                }
            },
            error => {
                console.log(error);
                this.spinnerService.hide();
            });
    }

    /* Tasa de ocupación por plazas: se define como la relación expresada en porcentaje entre el total de las pernoctaciones en un mes
    determinado y el producto de las plazas hoteleras y extrahoteleras, excluyendo las camas supletorias, por el número de días que ese mes tiene.
      Para los municipios de poco peso turistico se aplicara el 65 % de tasa de ocupacion debido al escaso impacto de la poblacion turistica
      en el computo total y las escalas en el valor de peligrosidad*/
    private setOccupation(pop: Municipality, year: number, representation: string) {
        this.service.getIstacData('ALOJATUR_PLAZAS_OCUPACION/data', representation).subscribe(
            (result: any) => {
                if (result) {
                    pop.occupation = result.observation.length > 0 ? Number(result.observation[0]) : 65;
                    localStorage.setItem('municipality', JSON.stringify(pop));
                }
            },
            error => {
                console.log(error);
            }).add(() => {
            this.spinnerService.hide();
            console.log('end of request');
        });
    }
}
