import {Component, ElementRef, OnInit, OnDestroy} from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Auth} from '../../models/auth';
import {EsriRequestService} from '../../services/esri-request.service';
import {RequestService} from '../../services/request.service';
import {GradesProtectionService} from '../../services/grades-protection.service';
import {environment} from '../../../environments/environment';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {FormBuilder, FormControl, FormGroup, Validators, FormArray} from '@angular/forms';
import Swal from 'sweetalert2';

declare var $: any;
declare var jQuery: any;
import * as moment from 'moment';
declare const aytos: any;
declare var UTMXYToLatLon: any;
declare var RadToDeg: any;

@Component({
    selector: 'app-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.css'],
})
export class SecurityComponent implements OnInit, OnDestroy {

    currentUser: Auth;
    fechaActual: Date = new Date();
    filtermunicipio;
    datosPlaya: any = [];
    datosPlayaRelacionada: any = [];
    nomMunicipio;
    nombre_playa;
    longitudPlaya;
    clasificacion;
    medio;
    iddgse;
    formUnitarios: FormGroup;
    formMediosHumanos: FormGroup;
    formBanderas: FormGroup;
    formBalizamiento: FormGroup;
    formPasiva: FormGroup;
    formTorres: FormGroup;
    formHorarios: FormGroup;
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
    calculoTotalHumanosP;
    calculoTotalHumanos;
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
                private gradeService: GradesProtectionService,)
                {}

    ngOnInit() {
      this.loadRecords();
      this.formhorarios();
      this.formbanderas();
      this.formbalizamiento();
      this.formtorres();
      this.formpasiva();
      this.formunitarios();
      this.formmedioshumanos();
                }

      get f() { return this.formMediosHumanos.controls; }
      get t() { return this.f.attributes as FormArray; }

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
    senales_prohibicion: new FormControl(0),
    id_ayuntamiento: new FormControl(0),
    ultimo_editor: new FormControl(this.currentUser.username),
    ultimo_cambio: new FormControl(this.toDateFormat(true))
  });
}

formbanderas(){
    this.formBanderas = this.fb.group({
      objectid: new FormControl(),
      id_dgse:  new FormControl(),
      accesos: new FormControl(),
      banderas: new FormControl(),
      mastiles: new FormControl(),
      carteles: new FormControl(),
      banderas_comp: new FormControl(),
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

readFeatures() {
  this.subscripcionFeatures = this.service.features$.subscribe(
    (results: any) => {
      const beach = (results[0] as any);
      if (results.length > 0) {
        if(this.options==='materiales'){
          if(beach.relatedRecords6.length !== 0){
            this.formBanderas.get('objectid').setValue(beach.relatedRecords6[0].attributes.objectid);
            this.formBanderas.get('accesos').setValue(beach.relatedRecords6[0].attributes.accesos);
            this.formBanderas.get('banderas').setValue(beach.relatedRecords6[0].attributes.banderas);
            this.formBanderas.get('mastiles').setValue(beach.relatedRecords6[0].attributes.mastiles);
            this.formBanderas.get('carteles').setValue(beach.relatedRecords6[0].attributes.carteles);
            this.formBanderas.get('banderas_comp').setValue(beach.relatedRecords6[0].attributes.banderas_comp);
          };
          if(beach.relatedRecords5.length !==0){
            this.formBalizamiento.get('objectid').setValue(beach.relatedRecords5[0].attributes.objectid);
            this.formBalizamiento.get('m_cuerda').setValue(beach.relatedRecords5[0].attributes.m_cuerda);
            this.formBalizamiento.get('boyas_amarillas').setValue(beach.relatedRecords5[0].attributes.boyas_amarillas);
            this.formBalizamiento.get('boyas_verdes').setValue(beach.relatedRecords5[0].attributes.boyas_verdes);
            this.formBalizamiento.get('boyas_rojas').setValue(beach.relatedRecords5[0].attributes.boyas_rojas);
          }

          if(beach.relatedRecords7.length !==0){
            this.formTorres.get('objectid').setValue(beach.relatedRecords7[0].attributes.objectid);
            this.formTorres.get('torres').setValue(beach.relatedRecords7[0].attributes.torres);
            this.formTorres.get('desfibriladores').setValue(beach.relatedRecords7[0].attributes.desfibriladores);
            this.formTorres.get('botiquines').setValue(beach.relatedRecords7[0].attributes.botiquines);
            this.formTorres.get('banderas').setValue(beach.relatedRecords7[0].attributes.banderas);
            this.formTorres.get('sistemas_izado').setValue(beach.relatedRecords7[0].attributes.sistemas_izado);
          }
          if(beach.relatedRecords8.length !==0){
            this.formPasiva.get('objectid').setValue(beach.relatedRecords8[0].attributes.objectid);
            this.formPasiva.get('carretes').setValue(beach.relatedRecords8[0].attributes.carretes);
            this.formPasiva.get('salvavidas').setValue(beach.relatedRecords8[0].attributes.salvavidas);
          }

    }

        if (beach && beach.relatedRecords1.length > 0 && beach.relatedRecords2.length > 0
          && beach.relatedRecords3.length > 0) {
            // inicializamos desactivado el esc y el click fuera de la modal
            $('#' + this.options).modal({backdrop: 'static', keyboard: false});
            $('#' + this.options).modal('show');
              beach.periodos = this.gradeService.calculateGradeForPeriods(beach.relatedRecords1, beach.relatedRecords2,
              beach.relatedRecords3);
              beach.grado_maximo = this.gradeService.getMaximunGrade(beach.periodos);
              beach.grados = this.gradeService.getDistinctGrades(beach.periodos);
              this.grados = beach.grados;
              if(beach.relatedRecords4){ this.dinamicForm(this.grados,beach.relatedRecords4 );}
              this.periodos = beach.periodos;
              this.datosPlayaRelacionada = beach;
              this.selectObjectId = beach.objectId;
              this.dinamicFormHorarios(beach.relatedRecords3);

            } else {
              Swal.fire({
                type: 'error',
                title: 'Error',
                text: 'No existen grados de protección para esta playa     debe determinar el grado de protección en la fase 2',
                footer: ''
              });
            }
          }
        },
        error => {
          console.log(error.toString());
        });
    }

    loadRecords() {
        this.spinnerService.show();
        this.currentUser = this.authService.getCurrentUser();
        this.filtermunicipio = 'municipio = \'' + aytos[this.currentUser.username].municipio_minus + '\'';
        this.nomMunicipio = aytos[this.currentUser.username].municipio_minus;
        this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_url + '/query',
            this.filtermunicipio, '*', false, this.currentUser.token, 'clasificacion', true).subscribe(
            (result: any) => {
                if (result) {
                    this.readFeatures();
                    this.datosPlaya = result;
                    this.codMunicipio(this.datosPlaya);
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
  openConfiguration(){
    this.loadUnitPrice()
    $('#configuracion').modal({backdrop: 'static', keyboard: false});
    $('#configuracion').modal('show');

  }

    loadUnitPrice() {
        this.spinnerService.show();
        // inicializamos desactivado el esc y el click fuera de la modal
        this.service.getEsriDataLayer(environment.infoplayas_catalogo_edicion_tablas_url + '/10/query',
            'id_ayuntamiento =\'' + this.codMun + '\'', '*', false, this.currentUser.token, 'id_ayuntamiento', false).subscribe(
            (result: any) => {
                if (result.features.length !== 0) {
                    this.formUnitarios.patchValue(result.features[0].attributes);
                    this.mode = 'updates';
                    this.unitarios = result.features[0].attributes;
                    this.createRangeHumanos(this.unitarios);
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
  let playasRelacionadas = this.datosPlayaRelacionada.relatedRecords3;
  if(playasRelacionadas){
    let cantidad = this.datosPlayaRelacionada.relatedRecords4;
    console.log(playasRelacionadas);

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
      var fecha1 = moment(new Date(playasRelacionadas[i].attributes.fecha_fin),'YYYY-DD-MMM').add(1,'day');//sumanos un dias para realizar el calculo de la totalidad de dias
      var totaldias;
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
      console.log(totaldias);
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

calculadora(medio) {
  this.spinnerService.show();
  if(medio ==='humanos'){
    this.loadUnitPrice();
  }
  console.log(medio);
  $('#calculadora' + medio).modal('show');
  // inicializamos desactivado el esc y el click fuera de la modal
  $('#calculadora' + medio).modal({backdrop: 'static', keyboard: false});
  this.spinnerService.hide();
  this.medio = medio;

    }

    public codMunicipio(datosPlaya) {
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
    this.updateGenerico(preciosMediosHumanos, 5 ,this.mode);
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
  this.updateGenerico(banderasSend, 7 ,this.mode);

}
public updateBalizamiento(){
  this.formBalizamiento.value.objectid ? '' : this.mode ='adds';
  const balizamientoSend = [];
  this.objetoGenerico.attributes = this.formBalizamiento.value;
  this.objetoGenerico.attributes.id_dgse = this.iddgse;
  this.objetoGenerico.attributes.ultimo_cambio = this.toDateFormat(true);
  this.objetoGenerico.attributes.ultimo_editor = this.currentUser.username;
  balizamientoSend.push(this.objetoGenerico);
  this.updateGenerico(balizamientoSend, 6 ,this.mode);

}

public updateTorres(){
  this.formTorres.value.objectid ? '' : this.mode ='adds';
  const torrresSend = [];
  this.objetoGenerico.attributes = this.formTorres.value;
  this.objetoGenerico.attributes.id_dgse = this.iddgse;
  this.objetoGenerico.attributes.ultimo_cambio = this.toDateFormat(true);
  this.objetoGenerico.attributes.ultimo_editor = this.currentUser.username;
  torrresSend.push(this.objetoGenerico);
  this.updateGenerico(torrresSend, 8 ,this.mode);

}
public updatePasiva(){
  this.formPasiva.value.objectid ? '' : this.mode ='adds';
  const pasivaSend = [];
  this.objetoGenerico.attributes = this.formPasiva.value;
  this.objetoGenerico.attributes.id_dgse = this.iddgse;
  this.objetoGenerico.attributes.ultimo_cambio = this.toDateFormat(true);
  this.objetoGenerico.attributes.ultimo_editor = this.currentUser.username;
  pasivaSend.push(this.objetoGenerico);
  this.updateGenerico(pasivaSend, 9 ,this.mode);

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
          $('#' + this.options).modal('hide');
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
  this.updateGenerico(preciosUnitariosSend, 10 ,this.mode);
}

private anhadir_medios(playa, option) {
  let relationIds;
  switch (option) {
    case 'humanos': {
      relationIds = ['1', '2', '3', '4'];
      break;
    }
    case 'materiales': {
      this.formbanderas();
      this.formtorres();
      this.formpasiva();
      this.formbalizamiento();
      relationIds = ['1', '2', '3', '5', '6', '7','8','9'];
      break;
    }
    default: {
      relationIds = ['1', '2', '3'];
      break;
    }
  }
      this.service.getMultipleRelatedData([playa], relationIds, this.currentUser.token);
      this.options = option;
      this.nombre_playa = playa.attributes.nombre_municipio;
      this.iddgse = playa.attributes.id_dgse;
      this.longitudPlaya = playa.attributes.longitud_m;
      this.clasificacion = playa.attributes.clasificacion;
}

public updateHorarios(){
  let pHorarios = [];
  let bucleHorarios = [];
  let pHorariosAdd = {
      attributes: {
        hora_inicio: '',
        hora_fin: '',
        ultimo_cambio : '',
        ultimo_editor: ''
      },
  };
  bucleHorarios.push(this.formHorarios.value);
  bucleHorarios.forEach(r => {
          r.horariosperiodos.forEach(x =>{

          const hora_inicio = this.getUTC0date(new Date(x.hora_inicio));
          const hora_fin = this.getUTC0date(new Date(x.hora_inicio));
            pHorariosAdd.attributes.hora_inicio = moment(hora_inicio).format('YYYY-MM-DD HH:mm:ss');
            pHorariosAdd.attributes.hora_fin = moment(hora_fin).format('YYYY-MM-DD HH:mm:ss');
            pHorariosAdd.attributes.ultimo_cambio = this.toDateFormat(true);
            pHorariosAdd.attributes.ultimo_editor = this.currentUser.username;
        //copiamos el objeto
        let horariosCopia = Object.assign({} , pHorariosAdd);
         pHorarios.push(horariosCopia);

      });
  });
  this.updateGenerico(pHorarios, 4 ,'updates');
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
  this.service.clearfeaturesSource();
  }

    private getUTC0date(date: Date) {
        return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
            date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }
}
