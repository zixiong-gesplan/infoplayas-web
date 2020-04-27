import {Injectable} from '@angular/core';
import {Municipality} from '../models/municipality';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {BehaviorSubject} from 'rxjs';
import {AppSetting} from '../models/app-setting';
import {AppSettingsService} from './app-settings.service';
import {environment} from '../../environments/environment';
import {EsriRequestService} from './esri-request.service';
import {AuthGuardService} from './auth-guard.service';
import {AppSettings} from '../../app-settings';
import {UtilityService} from './utility.service';

@Injectable({
    providedIn: 'root'
})
export class PopulationService {

    private sMunicipalitySource = new BehaviorSubject<Municipality>({});
    sMunicipality$ = this.sMunicipalitySource.asObservable();

    constructor(private service: EsriRequestService, private spinnerService: Ng4LoadingSpinnerService,
                private appSettingsService: AppSettingsService, private authService: AuthGuardService) {
    }

    getMunicipality(): Municipality {
        return JSON.parse(localStorage.getItem('municipality'));
    }

    updateMunicipality(name: string, aytos: AppSetting[]) {
        this.spinnerService.show();
        const mun: Municipality = {
            user: name,
            istac_code: aytos.find(i => i.ayto === name)
                .istac_code,
            ayuntamiento: aytos.find(i => i.ayto === name).municipio_mayus
        };

        // llamo a la tabla de cargapoblacional que actualiza el script del jupiter notebook a principios de año carga_poblacional_ISTAC.ipynb
        this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_tablas_url + '/' + AppSettings.tbPoblacional + '/query',
            'id_ayuntamiento = \'' + mun.istac_code + '\'', '*', false, this.authService.getCurrentUser().token,
            'id_ayuntamiento', false).subscribe(
            (result: any) => {
                if (result && result.features.length > 0) {
                    const istac = result.features[0].attributes;
                    mun.objectid = istac.objectid;
                    mun.population = istac.poblacion;
                    mun.beds = istac.plazas;
                    mun.occupation = istac.ocupacion;
                    mun.beds_vacational = istac.plazas_vacacional;
                    mun.occupation_vacational = istac.ocupacion_vacacional;
                    this.sMunicipalitySource.next(mun);
                    localStorage.setItem('municipality', JSON.stringify(mun));
                } else {
                    UtilityService.showErrorMessage('La tabla de datos del ISTAC está vacía',
                        'Los cálculos no serán correctos, contacte con el administrador.');
                }
            },
            error => {
                UtilityService.showErrorMessage('NO se ha podido contactar con el servidor',
                    'Los cálculos no serán correctos, trate de recargar la página, si persiste inténtelo más tarde.')
            }).add(() => {
            this.spinnerService.hide();
            console.log('end of request');
        });
    }
}
