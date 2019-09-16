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

    constructor(private service: RequestService, private authService: AuthGuardService, private spinnerService: Ng4LoadingSpinnerService,
                public router: Router) {
    }

    ngOnInit() {
        const current_user: Auth = this.authService.getCurrentUser();
        if (!this.authService.isMunicipalityStore(current_user)) {
            this.spinnerService.show();
            this.setIstacData(current_user, new Date().getFullYear() - 1);
        }
    }

    userLogOut() {
        this.authService.logOut();
        window.location.href = '/';
    }

    setIstacData(current_user: Auth, year: number) {
        const nextYear = new Date(new Date().getFullYear() + 1, 1, 1);
        const pop: Municipality = {
            user: current_user.username,
            expires: Number(nextYear)
        };
        this.service.getPopulation(aytos[pop.user].istac_code, year).subscribe(
            (result: any) => {
                if (result) {
                    if (result.observation.length > 0) {
                        pop.population = result.observation[0];
                        this.setBeds(pop);
                    } else {
                        // en caso de que no haya informacion del año anterior retrocedemos otro
                        this.setIstacData(current_user, new Date().getFullYear() - 2);
                    }
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
    private setBeds(pop: Municipality) {
        this.service.getBeds(aytos[pop.user].istac_code, new Date().getFullYear() - 1).subscribe(
            (result: any) => {
                if (result) {
                    pop.beds = result.observation.length > 0 ? result.observation[0] : Math.trunc(5 * 0.001 * pop.population);
                    this.setOccupation(pop);
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
    private setOccupation(pop: Municipality) {
        this.service.getOccupation(aytos[pop.user].istac_code, new Date().getFullYear() - 1).subscribe(
            (result: any) => {
                if (result) {
                    pop.occupation = result.observation.length > 0 ? result.observation[0] : 65;
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
