import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Auth} from '../../models/auth';
import {EsriRequestService} from '../../services/esri-request.service';
import {RequestService} from '../../services/request.service';
import {GradesProtectionService} from '../../services/grades-protection.service';
import {environment} from '../../../environments/environment';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import {Municipality} from '../../models/municipality';
import {PopulationService} from '../../services/population.service';
import {AppSettingsService} from '../../services/app-settings.service';
import {AppSetting} from '../../models/app-setting';

declare var $: any;
declare var jQuery: any;
declare const aytos: any;
declare var UTMXYToLatLon: any;
declare var RadToDeg: any;
declare function navbar_load();

@Component({
    selector: 'app-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.css'],
})
export class SecurityComponent implements OnInit, OnDestroy {
    currentUser: Auth;
    fechaActual: Date = new Date();
    defaultWorkdayInicio: Date;
    defaultWorkdayFin: Date;
    filtermunicipio;
    filterClasificacion: string;
    clasificacionData:string = 'T';
    buscadorPlaya;
    datosPlaya: any = [];
    datosPlayaRelacionada: any = [];
    nomMunicipio;
    private aytos: AppSetting[];
    nombre_playa;
    longitudPlaya;
    clasificacion;
    clasificacionUnico:[] = [];
    medio;
    iddgse;
    formUnitarios: FormGroup;
    formMediosHumanos: FormGroup;
    formBanderas: FormGroup;
    formBalizamiento: FormGroup;
    formPasiva: FormGroup;
    formTorres: FormGroup;
    formHorarios: FormGroup;
    formCalcMateriales: FormGroup;
    codMun;
    mode: string = 'updates';
    latitud: number = 0;
    longitud: number = 0;
    desabilitar:boolean = false;
    objectid;
    contador:number = 0;
    selectObjectId: number;
    options: string;
    grados: [] = [];
    periodos: any [] = [];
    subscripcionFeatures;
    subscripcionSmunicipality;
    calculoTotalHumanosP;
    calculoTotalHumanos;
    totalGAlto:number;
    totalGMedio: number;
    controlHorario: any;
    urlimageweather =  environment.urlimageweather;
    unitarios = {
      jefe_turno_pvp:'',
      socorrista_pvp:'',
      socorrista_embarcacion_pvp:'',
      socorrista_embarcacion_per_pvp:''
    }

    objetoGenerico = {
      attributes: {
        id_dgse:'',
        ultimo_cambio: '',
        ultimo_editor: ''
      },
    };

    datosclima = {
        main: {
            temp: '',
            humidity: '',
            pressure: '',
            temp_max: '',
            temp_min: ' '

        },
        weather: [{
            icon: '02d',
            description: '',
        }],
        wind: {
            deg: '',
            speed: ''
        }
    };



    constructor(private authService: AuthGuardService,
                private service: EsriRequestService,
                private spinnerService: Ng4LoadingSpinnerService,
                private elementRef: ElementRef,
                private fb: FormBuilder,
                private serviceMeteo: RequestService,
                private gradeService: GradesProtectionService,
                private popService: PopulationService,
                private appSettingsService: AppSettingsService)
                {}

    ngOnInit() {
        navbar_load();
        this.currentUser = this.authService.getCurrentUser();
        console.log(this.currentUser.editor);
        this.loadDataForms();
        this.appSettingsService.getJSON().subscribe(data => {
            this.aytos = data;
            this.loadRecords();
            this.readSmuncipality();
        });
        this.readFeatures();
    }

      get f() { return this.formMediosHumanos.controls; }
      get t() { return this.f.attributes as FormArray; }

    loadDataForms() {
        this.formhorarios();
        this.formbanderas();
        this.formbalizamiento();
        this.formtorres();
        this.formpasiva();
        this.formunitarios();
        this.formmedioshumanos();
        this.formCalculadoraMateriales();
    }
  calculoPlaceHolder(grado,longitudPlaya){
    let placeHolderFinal;
    if(grado ==='M'){
      placeHolderFinal = Math.ceil(( longitudPlaya / 400));
    }else{
      placeHolderFinal = Math.ceil((longitudPlaya / 400));
    }

    return placeHolderFinal ;
  }

      dinamicForm(grados,related){
        this.t.controls = [];
        if(related.length > 0){
          this.mode = 'updates';
          for (let i = 0; i < related.length; i++) {
            this.t.push(this.fb.group({
              objectid: new FormControl(related[i].attributes.objectid),
              jefes_turno: new FormControl(related[i].attributes.jefes_turno),
              socorristas_torre: new FormControl(related[i].attributes.socorristas_torre),
              socorristas_polivalentes: new FormControl(related[i].attributes.socorristas_polivalentes),
              socorristas_acuatico: new FormControl(related[i].attributes.socorristas_acuatico),
              socorristas_embarcacion: new FormControl(related[i].attributes.socorristas_embarcacion),
              socorristas_apie: new FormControl(related[i].attributes.socorristas_apie),
              socorristas_embarcacion_per: new FormControl(related[i].attributes.socorristas_embarcacion_per),
              grado: new FormControl(related[i].attributes.grado),
              id_dgse: new FormControl(related[i].attributes.id_dgse),
              nivel: new FormControl(null),
              ultimo_editor: new FormControl(this.currentUser.username),
              ultimo_cambio: new FormControl(this.toDateFormat(true))
            }));
          }
        }else{
          for (let i = 0; i < grados.length; i++) {
            this.t.push(this.fb.group({
              jefes_turno: new FormControl(),
              socorristas_torre: new FormControl(),
              socorristas_polivalentes: new FormControl(),
              socorristas_acuatico: new FormControl(),
              socorristas_embarcacion: new FormControl(),
              socorristas_apie: new FormControl(),
              socorristas_embarcacion_per: new FormControl(),
              grado: new FormControl(grados[i]),
              id_dgse: new FormControl(this.iddgse),
              nivel: new FormControl(),
              ultimo_editor: new FormControl(this.currentUser.username),
              ultimo_cambio: new FormControl(this.toDateFormat(true))
            }));
          }
        }
      }

      get h() { return this.formHorarios.controls; }
      get g() { return this.h.horariosperiodos as FormArray; }

dinamicFormHorarios(periodos){
    this.g.controls = [];
      for (let i = 0; i < periodos.length; i++) {
        if(periodos[i].attributes.nivel!=='B'){
          this.g.push(this.fb.group({
            objectid: new FormControl(periodos[i].attributes.objectid),
            hora_inicio: new FormControl(periodos[i].attributes.hora_inicio ? new Date(periodos[i].attributes.hora_inicio): null ),
            hora_fin: new FormControl(periodos[i].attributes.hora_fin ? new Date(periodos[i].attributes.hora_fin): null ),
            ultimo_editor: new FormControl(this.currentUser.username),
            ultimo_cambio: new FormControl(this.toDateFormat(true)),
          }, {validator: this.dateLessThan('hora_inicio', 'hora_fin')}));
        }
      }
}

formhorarios(){
  this.formHorarios = this.fb.group({
    horariosperiodos: new FormArray([])
  });
  this.defaultWorkdayInicio = new Date(70, 0, 1, 9, 0, 0);
  this.defaultWorkdayFin = new Date(70, 0, 1, 17, 0, 0);
}

formmedioshumanos(){
  this.formMediosHumanos = this.fb.group({
    attributes: new FormArray([])
  });
}
formunitarios(){

  this.formUnitarios = this.fb.group({
    objectid: new FormControl(''),
    jefe_turno_pvp: new FormControl(0, Validators.min(0)),
    socorrista_pvp: new FormControl(0),
    socorrista_embarcacion_pvp: new FormControl(0),
    socorrista_embarcacion_per_pvp: new FormControl(0),
    bandera_pvp: new FormControl(0),
    mastil_pvp: new FormControl(0),
    cartel_pvp: new FormControl(0),
    bandera_comp_pvp: new FormControl(0),
    carrete_pvp: new FormControl(0),
    m_cuerda_pvp: new FormControl(0),
    boya_pvp: new FormControl(0),
    torre_pvp: new FormControl(0),
    desfibrilador_pvp: new FormControl(0),
    botiquin_pvp: new FormControl(0),
    sistemas_izado_pvp: new FormControl(0),
    salvavidas_pvp: new FormControl(0),
    senal_prohibicion_pvp: new FormControl(0),
    id_ayuntamiento: new FormControl(0),
    ultimo_editor: new FormControl(this.currentUser.username),
    ultimo_cambio: new FormControl(this.toDateFormat(true))
  });
}

formbanderas(){
    this.formBanderas = this.fb.group({
      objectid: new FormControl(),
      id_dgse:  new FormControl(),
      banderas: new FormControl(),
      mastiles: new FormControl(),
      carteles: new FormControl(),
      banderas_comp: new FormControl(),
      senales_prohibicion: new FormControl(),
      ultimo_editor: new FormControl(this.currentUser.username),
      ultimo_cambio: new FormControl(this.toDateFormat(true))
    });
}

formbalizamiento(){
  this.formBalizamiento = this.fb.group({
    objectid: new FormControl(),
    id_dgse:  new FormControl(),
    m_cuerda: new FormControl(),
    boyas_amarillas: new FormControl(),
    boyas_verdes: new FormControl(),
    boyas_rojas: new FormControl(),
    ultimo_editor: new FormControl(this.currentUser.username),
    ultimo_cambio: new FormControl(this.toDateFormat(true))
  });
}

formtorres(){
  this.formTorres = this.fb.group({
    objectid: new FormControl(''),
    id_dgse:  new FormControl(),
    torres : new FormControl(),
    botiquines : new FormControl(),
    desfibriladores : new FormControl(),
    banderas: new FormControl(),
    sistemas_izado : new FormControl(),
    ultimo_editor: new FormControl(this.currentUser.username),
    ultimo_cambio: new FormControl(this.toDateFormat(true))
  });
}

formpasiva(){
  this.formPasiva = this.fb.group({
    objectid: new FormControl(''),
    id_dgse:  new FormControl(),
    carretes:  new FormControl(),
    salvavidas: new FormControl(),
    ultimo_editor: new FormControl(this.currentUser.username),
    ultimo_cambio: new FormControl(this.toDateFormat(true))
  });
}
formCalculadoraMateriales(){
  this.formCalcMateriales = this.fb.group({
    banderas_amort: new FormControl(),
    mastiles_amort: new FormControl(),
    carteles_amort: new FormControl(),
    banderas_compl_amort: new FormControl(),

    salvavidas_amort: new FormControl(),
    carretes_amort: new FormControl(),

    long_cuerda_amort: new FormControl(),
    boyas_amar_amort: new FormControl(),
    senales_proh_amort: new FormControl(),

    boyas_amar_ba_amort: new FormControl(),
    boyas_verd_ba_amort: new FormControl(),
    boyas_roj_ba_amort: new FormControl(),

    torre_amort: new FormControl(),
    botiquin_amort: new FormControl(),
    desfibrilador_amort: new FormControl(),
    bandera_torre_amort: new FormControl()
  })
}

readFeatures() {
  this.subscripcionFeatures = this.service.features$.subscribe(
    (results: any) => {
      const beach = (results[0] as any);
      if (results.length > 0) {
        if(this.options==='materiales'){
          if(beach.relatedInformativo.length !== 0){
            this.formBanderas.get('objectid').setValue(beach.relatedInformativo[0].attributes.objectid);
            this.formBanderas.get('banderas').setValue(beach.relatedInformativo[0].attributes.banderas);
            this.formBanderas.get('mastiles').setValue(beach.relatedInformativo[0].attributes.mastiles);
            this.formBanderas.get('carteles').setValue(beach.relatedInformativo[0].attributes.carteles);
            this.formBanderas.get('senales_prohibicion').setValue(beach.relatedInformativo[0].attributes.senales_prohibicion);
            this.formBanderas.get('banderas_comp').setValue(beach.relatedInformativo[0].attributes.banderas_comp);
          };
          if(beach.relatedBalizamiento.length !==0){
            this.formBalizamiento.get('objectid').setValue(beach.relatedBalizamiento[0].attributes.objectid);
            this.formBalizamiento.get('m_cuerda').setValue(beach.relatedBalizamiento[0].attributes.m_cuerda);
            this.formBalizamiento.get('boyas_amarillas').setValue(beach.relatedBalizamiento[0].attributes.boyas_amarillas);
            this.formBalizamiento.get('boyas_verdes').setValue(beach.relatedBalizamiento[0].attributes.boyas_verdes);
            this.formBalizamiento.get('boyas_rojas').setValue(beach.relatedBalizamiento[0].attributes.boyas_rojas);
          }

          if(beach.relatedPuesto.length !==0){
            this.formTorres.get('objectid').setValue(beach.relatedPuesto[0].attributes.objectid);
            this.formTorres.get('torres').setValue(beach.relatedPuesto[0].attributes.torres);
            this.formTorres.get('desfibriladores').setValue(beach.relatedPuesto[0].attributes.desfibriladores);
            this.formTorres.get('botiquines').setValue(beach.relatedPuesto[0].attributes.botiquines);
            this.formTorres.get('banderas').setValue(beach.relatedPuesto[0].attributes.banderas);
            this.formTorres.get('sistemas_izado').setValue(beach.relatedPuesto[0].attributes.sistemas_izado);
          }
          if(beach.relatedPasiva.length !==0){
            this.formPasiva.get('objectid').setValue(beach.relatedPasiva[0].attributes.objectid);
            this.formPasiva.get('carretes').setValue(beach.relatedPasiva[0].attributes.carretes);
            this.formPasiva.get('salvavidas').setValue(beach.relatedPasiva[0].attributes.salvavidas);
          }

    }

        this.controlHorario = beach.relatedAfluencia.filter(x => x.hora_inicio !== null).length;
        console.log(this.controlHorario);
        if (beach && beach.relatedAfluencia.length > 0 && beach.relatedEntorno.length > 0
          && beach.relatedIncidencias.length > 0) {
            // inicializamos desactivado el esc y el click fuera de la modal
            $('#' + this.options).modal({backdrop: 'static', keyboard: false});
            $('#' + this.options).modal('show');
              beach.periodos = this.gradeService.calculateGradeForPeriods(beach.relatedIncidencias, beach.relatedEntorno,
              beach.relatedAfluencia);
              beach.grado_maximo = this.gradeService.getMaximunGrade(beach.periodos);
              beach.grados = this.gradeService.getDistinctGrades(beach.periodos);
              this.grados = beach.grados;

              if(beach.relatedHumanos){ this.dinamicForm(this.grados,beach.relatedHumanos );}
              this.periodos = beach.periodos;
              this.datosPlayaRelacionada = beach;
              console.log(this.datosPlayaRelacionada);
              this.getNumWorkDays(this.datosPlayaRelacionada.periodos.fecha_inicio, this.datosPlayaRelacionada.periodos.fecha_fin, 'FS');
              this.selectObjectId = beach.objectId;
              this.dinamicFormHorarios(beach.relatedAfluencia);

            } else {
              Swal.fire({
                type: 'error',
                title: 'Error',
                text: 'No existen grados de protección para esta playa     debe determinar el grado de protección en clasificación',
                footer: ''
              });
            }
          }
        },
        error => {
          console.log(error.toString());
        });
    }

    clasificacionSelect(){
      if(this.clasificacionData!=='T'){
          this.filterClasificacion = 'and clasificacion = \'' + this.clasificacionData+ '\'';
      }else{
        this.filterClasificacion = "";
      }
       this.loadRecords();
    }

    loadRecords() {
        this.spinnerService.show();
        const name = this.currentUser.selectedusername ? this.currentUser.selectedusername : this.currentUser.username;
        if(this.filterClasificacion){
          this.filtermunicipio = 'municipio = \'' + this.aytos.find(i => i.username === name).municipio_minus + '\'' + this.filterClasificacion;
        }else{
            this.filtermunicipio = 'municipio = \'' + this.aytos.find(i => i.username === name).municipio_minus + '\'';
        }
        this.nomMunicipio = this.aytos.find(i => i.username === name).municipio_minus;
        this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_url + '/query',
            this.filtermunicipio, '*', false, this.currentUser.token, 'clasificacion', true).subscribe(
            (result: any) => {
                if (result) {
                    this.datosPlaya = result;
                    this.codMunicipio(this.datosPlaya);
                    if(this.clasificacionUnico.length ===0){
                      var categoriasFiltrar = {};
                      this.clasificacionUnico = this.datosPlaya.features.filter(function (e) {
                        return categoriasFiltrar[e.attributes.clasificacion] ? false : (categoriasFiltrar[e.attributes.clasificacion] = true);
                      });
                    }

                    this.spinnerService.hide();
                }
            },
            error => {
                console.log(error.toString());
                this.spinnerService.hide();

            }).add(() => {
            console.log('end of request');
        });

    }

    readSmuncipality() {
        this.subscripcionSmunicipality = this.popService.sMunicipality$.subscribe(
            (result: Municipality) => {
                if (result.user) {
                    this.currentUser = this.authService.getCurrentUser();
                    // recargamos datos y formularios
                    this.loadDataForms();
                    this.loadRecords();
                }
            },
            error => {
                console.log(error.toString());
            });
    }

    openConfiguration() {
        this.loadUnitPrice('empty');
        $('#configuracion').modal({backdrop: 'static', keyboard: false});
        $('#configuracion').modal('show');

    }

    loadUnitPrice(calculadora){
        this.spinnerService.show();
        // inicializamos desactivado el esc y el click fuera de la modal
        this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_tablas_url + '/' + environment.tbUnitarios + '/query',
        'id_ayuntamiento =\'' + this.codMun + '\'', '*', false, this.currentUser.token, 'id_ayuntamiento', false).subscribe(
          (result: any) => {
            if (result.features.length !== 0) {
              this.formUnitarios.patchValue(result.features[0].attributes);
              this.mode = 'updates';
              this.unitarios = result.features[0].attributes;
              if(calculadora==='humanos'){
                this.createRangeHumanos(this.unitarios);
              }
              this.spinnerService.hide();
            } else {
              this.spinnerService.hide();
            }
          },
          error => {
            this.spinnerService.hide();
          }).add(() => {
          });
    }

  getNumWorkDays(startDate, endDate, modo) {
    let start = moment(startDate, 'YYYY-MM-DD').startOf('day'); //Pick any format
    let end = moment(endDate,'YYYY-MM-DD').startOf('day'); //right now (or define an end date yourself)
    let weekdayCounter = 0;
    let noweekdayCounter = 0;
    while (start <= end) {
      if (start.format('ddd') !== 'Sat' && start.format('ddd') !== 'Sun'){
        weekdayCounter++; //add 1 to your counter if its not a weekend day
      }else{
          noweekdayCounter++;
      }
      start = moment(start, 'YYYY-MM-DD').add(1, 'days'); //increment by one day
    }

    if(modo!='FS'){

      return weekdayCounter;
    }
    else{

      return noweekdayCounter;
    }

  }

createRangeHumanos(unitarios){
  let playasRelacionadas = this.datosPlayaRelacionada.relatedAfluencia;
  let cantidad = this.datosPlayaRelacionada.relatedHumanos;
  let totaldias;
  console.log(playasRelacionadas);
  if(playasRelacionadas){
    this.calculoTotalHumanosP = [];
    this.calculoTotalHumanos = [];
    let  calcHumanos = {
      periodos:[],
      totaljefep:0,
      totalsocp: 0,
      totalsocembp: 0,
      totalsocperp: 0,
      costetotalp: 0,
    };
    let costeTotales = {
      totaljefe:0,
      totalsoc: 0,
      totalsocemb: 0,
      totalsocper: 0,
      costetotal: 0
    }
    for (let i = 0; i < playasRelacionadas.length; i++) {
      if(playasRelacionadas[i].attributes.nivel !='B'){

      calcHumanos.periodos = playasRelacionadas[i].attributes;
      var fecha2 = moment(new Date(playasRelacionadas[i].attributes.fecha_inicio),'YYYY-DD-MMM');
      var fecha1 = moment(new Date(playasRelacionadas[i].attributes.fecha_fin),'YYYY-DD-MMM');
      switch (playasRelacionadas[i].attributes.incluir_dias) {

        case 'TD': {
           totaldias = fecha1.diff(fecha2, 'days');
          break;
        }
        case 'FS': {
          totaldias = this.getNumWorkDays(new Date(playasRelacionadas[i].attributes.fecha_inicio),new Date(playasRelacionadas[i].attributes.fecha_fin),'FS');
          break;
        }
        default: {
          totaldias =  this.getNumWorkDays(new Date(playasRelacionadas[i].attributes.fecha_inicio),new Date(playasRelacionadas[i].attributes.fecha_fin),'LB');
          break;
        }

      }
      var hora_inicio = moment(new Date(playasRelacionadas[i].attributes.hora_inicio),'hh:mm');
      var hora_fin = moment(new Date(playasRelacionadas[i].attributes.hora_fin),'hh:mm');//sumanos un dias para realizar el calculo de la totalidad de dias
      var totalhorasms:number = hora_fin.diff(hora_inicio);
      var totalhoras:number = moment.duration(totalhorasms).asHours();
      var cantidadmediosHumanos = cantidad.filter(h => h.attributes.grado === playasRelacionadas[i].attributes.nivel);
      calcHumanos.totaljefep = parseFloat(unitarios.jefe_turno_pvp) * totaldias * totalhoras * cantidadmediosHumanos[0].attributes.jefes_turno;
      calcHumanos.totalsocp = parseFloat(unitarios.socorrista_pvp) * totaldias * totalhoras * this.calculoTotalSocorristas(cantidad);
      calcHumanos.totalsocembp = parseFloat(unitarios.socorrista_embarcacion_pvp) * totaldias * totalhoras * cantidadmediosHumanos[0].attributes.socorristas_embarcacion;
      calcHumanos.totalsocperp = parseFloat(unitarios.socorrista_embarcacion_per_pvp) * totaldias * totalhoras * cantidadmediosHumanos[0].attributes.socorristas_embarcacion_per;
      calcHumanos.costetotalp = calcHumanos.totaljefep + calcHumanos.totalsocp + calcHumanos.totalsocembp + calcHumanos.totalsocperp;
      let copia = Object.assign({} , calcHumanos);
      this.calculoTotalHumanosP.push(copia);
      costeTotales.totaljefe += calcHumanos.totaljefep;
      costeTotales.totalsoc += calcHumanos.totalsocp;
      costeTotales.totalsocemb+= calcHumanos.totalsocembp;
      costeTotales.totalsocper+= calcHumanos.totalsocperp;
    }
  }
    costeTotales.costetotal= costeTotales.totaljefe + costeTotales.totalsoc + costeTotales.totalsocemb + costeTotales.totalsocper;
    this.calculoTotalHumanos.push(costeTotales);
  }

}
calculoTotalSocorristas(data){
  let total: number = 0;
  for (let y = 0; y < data.length; y++) {

    if(data[y].attributes.grado !=='B' ){
      total +=  data[y].attributes.socorristas_acuatico + data[y].attributes.socorristas_apie + data[y].attributes.socorristas_polivalentes + data[y].attributes.socorristas_torre;
    }
  }

  return total;
}
totaldiasGrado(playasRelacionadas){
  this.totalGAlto = 0;
  this.totalGMedio = 0;
  for (let i = 0; i < playasRelacionadas.relatedAfluencia.length; i++) {
    if(playasRelacionadas.relatedAfluencia[i].attributes.nivel !='B'){
    var fecha2 = moment(new Date(playasRelacionadas.relatedAfluencia[i].attributes.fecha_inicio),'YYYY-DD-MMM');
    var fecha1 = moment(new Date(playasRelacionadas.relatedAfluencia[i].attributes.fecha_fin),'YYYY-DD-MMM');
        switch (playasRelacionadas.relatedAfluencia[i].attributes.incluir_dias) {
          case 'TD': {
            if(playasRelacionadas.relatedAfluencia[i].attributes.nivel!=='A'){
                this.totalGMedio = fecha1.diff(fecha2, 'days') + this.totalGMedio;
           }else{
                this.totalGAlto = fecha1.diff(fecha2, 'days') + this.totalGAlto + this.totalGAlto ;
             }
            break;
          }
          case 'FS': {
              if(playasRelacionadas.relatedAfluencia[i].attributes.nivel!=='A'){
                  this.totalGMedio = this.getNumWorkDays(new Date(playasRelacionadas.relatedAfluencia[i].attributes.fecha_inicio),new Date(playasRelacionadas.relatedAfluencia[i].attributes.fecha_fin),'FS') + this.totalGMedio;
             }else{
                  this.totalGAlto = this.getNumWorkDays(new Date(playasRelacionadas.relatedAfluencia[i].attributes.fecha_inicio),new Date(playasRelacionadas.relatedAfluencia[i].attributes.fecha_fin),'FS') + this.totalGAlto;
          }
            break;
          }
          default: {
              if(playasRelacionadas.relatedAfluencia[i].attributes.nivel!=='A'){
                  this.totalGMedio =  this.getNumWorkDays(new Date(playasRelacionadas.relatedAfluencia[i].attributes.fecha_inicio),new Date(playasRelacionadas.relatedAfluencia[i].attributes.fecha_fin),'LB') + this.totalGMedio;
             }else{
                this.totalGAlto = fecha1.diff(fecha2, 'days') + this.totalGAlto + this.totalGAlto ;
          }
          break;
          }
        }
    }
  }
}

calculadora(medio) {
  this.spinnerService.show();
  this.totaldiasGrado(this.datosPlayaRelacionada);
  this.medio = medio;
  $('#calculadora' + medio).modal('show');
  $('#calculadora' + medio).modal({backdrop: 'static', keyboard: false});
  this.loadUnitPrice(medio);
  this.spinnerService.hide();

}

codMunicipio(datosPlaya) {
    this.codMun = this.datosPlaya.features[0].attributes.id_dgse.substring(0, 3);
      return this.codMun;
    }
    // 2016-06-22 19:10:25 postgres format Date type
    public toDateFormat(timePart: boolean): string {
        const date = new Date();
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        const hh = date.getHours();
        const i = date.getMinutes();
        const ss = date.getSeconds();
        return timePart ? yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + i + ':' + ss : yyyy + '-' + mm + '-' + dd;
    }

    public utmToLatLong(x, y) {
        const latlon = new Array(2);
        let zone, southhemi;
        x = parseFloat(x);
        y = parseFloat(y);
        zone = parseInt('28');
        southhemi = false;
        UTMXYToLatLon(x, y, zone, southhemi, latlon);
        this.latitud = RadToDeg(latlon[0]);
        this.longitud = RadToDeg(latlon[1]);

    }

    public meteo(playa) {
        this.nombre_playa = playa.attributes.nombre_municipio;
        this.utmToLatLong(playa.centroid.x, playa.centroid.y);
        this.serviceMeteo.meteoData(this.latitud, this.longitud).subscribe(
            (result: any) => {
                if (result.length !== 0) {
                    this.datosclima = result;
                    $('#tiempo').modal('show');
                }
            },
            error => {
                Swal.fire({
                    type: 'error',
                    title: '',
                    text: 'Se ha producido un error inesperado',
                    footer: ''
                });
        });
    }

public updateMediosHumanos() {
  this.spinnerService.show();
  this.formMediosHumanos.value.attributes[0].objectid ? '' : this.mode ='adds';
  let preciosMediosHumanos = [];
  let bucledelformMedioHumanos =  [];
  let preciosMedios = {
    attributes: {},
  };
  bucledelformMedioHumanos.push(this.formMediosHumanos.value);
  bucledelformMedioHumanos.forEach(r => {
    r.attributes.forEach(x =>{
      preciosMedios.attributes = x;
      //copiamos el objeto preciosMedios para que no cambie al hacer el push
      let preciosMediosCopia = Object.assign({} , preciosMedios);
      preciosMediosHumanos.push(preciosMediosCopia);
    });
  });
    this.updateGenerico(preciosMediosHumanos, environment.tbHumanos ,this.mode);
}
public updateMediosMateriales(){
    this.updateBanderas();
    this.updateBalizamiento();
    this.updateTorres();
    this.updatePasiva();
}

public updateBanderas(){

  this.formBanderas.value.objectid ? '' : this.mode ='adds';
  const banderasSend = [];
  this.objetoGenerico.attributes = this.formBanderas.value;
  this.objetoGenerico.attributes.id_dgse = this.iddgse;
  this.objetoGenerico.attributes.ultimo_cambio = this.toDateFormat(true);
  this.objetoGenerico.attributes.ultimo_editor = this.currentUser.username;
  banderasSend.push(this.objetoGenerico);
  this.updateGenerico(banderasSend, environment.tbInformativo ,this.mode);


}
public updateBalizamiento(){

  this.formBalizamiento.value.objectid ? '' : this.mode ='adds';
  const balizamientoSend = [];
  this.objetoGenerico.attributes = this.formBalizamiento.value;
  this.objetoGenerico.attributes.id_dgse = this.iddgse;
  this.objetoGenerico.attributes.ultimo_cambio = this.toDateFormat(true);
  this.objetoGenerico.attributes.ultimo_editor = this.currentUser.username;
  balizamientoSend.push(this.objetoGenerico);
  this.updateGenerico(balizamientoSend, environment.tbBalizamiento ,this.mode);


}

public updateTorres(){

  this.formTorres.value.objectid ? '' : this.mode ='adds';
  const torrresSend = [];
  this.objetoGenerico.attributes = this.formTorres.value;
  this.objetoGenerico.attributes.id_dgse = this.iddgse;
  this.objetoGenerico.attributes.ultimo_cambio = this.toDateFormat(true);
  this.objetoGenerico.attributes.ultimo_editor = this.currentUser.username;
  torrresSend.push(this.objetoGenerico);
  this.updateGenerico(torrresSend, environment.tbPuesto ,this.mode);


}
public updatePasiva(){
  this.formPasiva.value.objectid ? '' : this.mode ='adds';
  const pasivaSend = [];
  this.objetoGenerico.attributes = this.formPasiva.value;
  this.objetoGenerico.attributes.id_dgse = this.iddgse;
  this.objetoGenerico.attributes.ultimo_cambio = this.toDateFormat(true);
  this.objetoGenerico.attributes.ultimo_editor = this.currentUser.username;
  pasivaSend.push(this.objetoGenerico);
  this.updateGenerico(pasivaSend, environment.tbPasiva ,this.mode);
}

public updateGenerico(data, tabla, mode){
  this.service.updateEsriData(environment.infoplayas_catalogo_edicion_tablas_url + '/'+tabla+'/applyEdits',
    data, mode, this.currentUser.token).subscribe(
      (result: any) => {
        if (!result.error) {
          this.spinnerService.hide();
            Swal.fire({
              type: 'success',
              title: 'Exito',
              text: 'la actualización ha sido correcta',
              footer: ''
            });
          //bajamos todas las ventanas modales abiertas
        //  $('#' + this.options).modal('hide');
          $('#configuracion').modal('hide');
          $('#horarios').modal('hide');
        } else {
          this.spinnerService.hide();
          Swal.fire({
            type: 'error',
            title: '',
            text: 'Se ha producido un error inesperado',
            footer: ''
          });
        }
    },
    error => {
      this.spinnerService.hide();
      Swal.fire({
        type: 'error',
        title: '',
        text: 'Se ha producido un error inesperado',
        footer: ''
      });
    })
}

public update() {
  this.spinnerService.show();
  this.formUnitarios.value.objectid ? '' : this.mode ='adds';
  const preciosUnitariosSend = [];
  const preciosUnitarios = {
    attributes: {
      ultimo_cambio: '',
      id_ayuntamiento: '',
      ultimo_editor: ''
    },
  };
  preciosUnitarios.attributes = this.formUnitarios.value;
  preciosUnitarios.attributes.ultimo_cambio = this.toDateFormat(true);
  preciosUnitarios.attributes.ultimo_editor = this.currentUser.username;
  preciosUnitarios.attributes.id_ayuntamiento = this.codMun;
  preciosUnitariosSend.push(preciosUnitarios);
  this.updateGenerico(preciosUnitariosSend, environment.tbUnitarios ,this.mode);
}

private anhadir_medios(playa, option) {
  let relationIds;
  switch (option) {
    case 'humanos': {
      relationIds = [environment.relAfluencia, environment.relHumanos, environment.relEntorno, environment.relIncidencias];
      break;
    }
    case 'materiales': {
      this.formbanderas();
      this.formtorres();
      this.formpasiva();
      this.formbalizamiento();
      relationIds = [environment.relAfluencia, environment.relEntorno, environment.relIncidencias,
            environment.relBalizamiento, environment.relInformativo, environment.relPuesto, environment.relPasiva];
      break;
    }
    default: {
      relationIds = [environment.relAfluencia, environment.relEntorno, environment.relIncidencias];
      break;
    }
  }
      this.service.getMultipleRelatedData([playa], relationIds, this.currentUser.token);
      this.options = option;
      this.nombre_playa = playa.attributes.nombre_municipio;
      this.iddgse = playa.attributes.id_dgse;
      this.longitudPlaya = playa.attributes.longitud_metros;
      this.clasificacion = playa.attributes.clasificacion;
}

public updateHorarios(){
  let pHorarios = [];
  let bucleHorarios = [];
  let pHorariosAdd = {
      attributes: {
        hora_inicio: 0,
        hora_fin: 0,
        ultimo_cambio : '',
        ultimo_editor: ''
      },
  };
  bucleHorarios.push(this.formHorarios.value);

  bucleHorarios.forEach(r => {
    r.horariosperiodos.forEach(x =>{
      pHorariosAdd.attributes = x;
      pHorariosAdd.attributes.hora_inicio = this.getUTC0date(x.hora_inicio);
      pHorariosAdd.attributes.hora_fin = this.getUTC0date(x.hora_fin);
      pHorariosAdd.attributes.ultimo_cambio = this.toDateFormat(true);
      pHorariosAdd.attributes.ultimo_editor = this.currentUser.username;
      //copiamos el objeto
      let horariosCopia = Object.assign({} , pHorariosAdd);
      pHorarios.push(horariosCopia);

    });
  });

  this.updateGenerico(pHorarios, environment.tbAfluencia ,'updates');
 }

dateLessThan(from: string, to: string) {
  return (group: FormGroup): {[key: string]: any} => {
    let f = group.controls['hora_inicio'];
    let t = group.controls['hora_fin'];
    let m = moment(new Date(f.value)).format('HH:mm');
    let p = moment(new Date(t.value)).format('HH:mm');

    if(m!="00:00" && p !="00:00"){
      if (parseInt(m) >= parseInt(p) || p=='') {
        this.desabilitar = true;
        return {}
      }else{
        this.desabilitar = false;
      }
    }else{
      this.desabilitar = true;
    }
    return {};
  }
}

ngOnDestroy() {
  this.subscripcionFeatures.unsubscribe();
  this.subscripcionSmunicipality.unsubscribe();
  this.service.clearfeaturesSource();
  }

private getUTC0date(datep) {
  const date = new Date(datep);
  // solo necesitamos la parte de la hora, fijo al comienzo de la unix timestamp
  date.setFullYear(1970, 0, 1);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }

reset_calculadora(){
  this.formCalculadoraMateriales();
  }
}
