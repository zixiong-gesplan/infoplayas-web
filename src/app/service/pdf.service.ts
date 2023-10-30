import { Injectable } from '@angular/core';

import {
  Chart,
  LinearScaleOptions
} from 'chart.js/auto';

import * as L from 'leaflet';
import leafletImage from 'leaflet-image';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  doc;

  constructor() {

  }

  async createPDF({
    municipality,
    quarter,
    year,
    beachs,
    conclutions
  }){
    this.doc = new jsPDF('landscape');
    this.doc.page=1;

    await this.portrailPDF(municipality, quarter,year);
    await this.beachListPDF(beachs);
    await this.bodyPDF(beachs);
    await this.backCoverPDF(municipality, quarter,year, conclutions)

  }

  private portrailPDF(municipality,quarter,year){
    var heigth = 12
    var textWitdh = this.doc.getTextWidth("INFORME CUATRIMESTRAL DE INCIDENCIAS EN PLAYAS Y ZBM" + name);
    var margenWitdh = (this.doc.internal.pageSize.width - textWitdh)/2;

    var title =  this.doc.splitTextToSize( "INFORME CUATRIMESTRAL DE INCIDENCIAS EN PLAYAS Y ZBM" ,180);
    this.doc.setFillColor(40, 102, 224);
    this.doc.rect(margenWitdh +8, 5, textWitdh -15, 10, 'F')
    this.doc.setTextColor(255, 255, 255);
    var img = new Image();
    img.src = "assets/images/logos/dgse_icono.png";
    this.doc.addImage(img, 'png', this.doc.internal.pageSize.width - margenWitdh, 5, 40, 15, '','FAST' );
    this.doc.text(title,margenWitdh +10,heigth);

    heigth +=15;

    this.doc.setTextColor(0, 0, 0);
    var name = municipality;
    name = name.toUpperCase();
    textWitdh = this.doc.getTextWidth("MUNICIPIO: " + name);
    margenWitdh = (this.doc.internal.pageSize.width - textWitdh)/2;
    this.doc.text("MUNICIPIO: " + name,20,heigth);

    var text = quarter + " - " + year;
    textWitdh = this.doc.getTextWidth(text);
    margenWitdh = (this.doc.internal.pageSize.width - textWitdh)/2;
    this.doc.text(text,200,heigth);
  }

  private beachListPDF(beachs) {
    this.doc.text("LISTADO DE PLAYAS Y ZONAS DE BAÑO MARITIMAS:", 10, 40)

    //const head = ['ID DGSE','NOMBRE','HORARIO SOCORRISTAS','EMPRESA SOCORRISMO', 'AFLUENCIA','RIESGO','PROTECCIÓN','Nº DE INCIDENCIAS'];
    const head = ['ID DGSE','NOMBRE','HORARIO SOCORRISTAS', 'AFLUENCIA','PROTECCIÓN','Nº DE INCIDENCIAS']
    this.doc.autoTable({
      head:[head],
      body:beachs.map( (playa,index) =>[playa.DGSE, playa.name,
        "",
        playa.afluencia,
        playa.grado_proteccion,
        // playa.horarios.map(horario =>{
        //   return horario.hora_inicio + "--" + horario.hora_fin
        // }).join("\n"),
        // //null, Horarios de Socorristas
        // playa.horarios.map(horario =>{
        //   return horario.afluencia
        // }).join("\n"),
        // //playa.riesgo,
        // playa.horarios.map(horario =>{
        //   return horario.proteccion
        // }).join("\n"),
        
          beachs[index].incidents.length
        ]),
      
      headStyles:{
        halign: 'center',
      },
      bodyStyles:{
        halign: 'center',
      },
      startY: 45,
    })

  }
  
  private render_pie (ctx, labels, backgroundColor,data, x,y) {

    let chart = new Chart(ctx,
     {
       type: 'pie',
       data: {
         labels: labels,
         datasets: [{
           backgroundColor: backgroundColor, 
           data: data
         }]
       },
       options:{

          plugins: {
            tooltip: {
              enabled: false
            },
            legend:{
              labels:{
                font:{
                  size:60
                }
              },
              reverse: true
            },

            // datalabels: {
            //   formatter: (value, ctx) => {
            //       return value;
            //   },
            //   color: '#000',
            //   font: {
            //     weight: 'bold',
            //     size: 45,
            //   }
            // }
          },
          animation:{
            duration: 0,
            onComplete:(e) =>{
              var img = new Image()
              img.src = e.chart.toBase64Image()

              this.doc.addImage(img, x, y, 70, 60,'','FAST')
            }
         }
       }
     
    })
    return chart
  }

  private async bodyPDF(beachs){
    var canvas = <HTMLCanvasElement>document.getElementById('myChart')
    beachs.forEach( beach => {
      //**MAPA de la playa, */
      if(beach.incidents.length <=0) return;
      
      this.doc.addPage()
      this.doc.text("Incidencias del cuatrimestre", 10, 10)
      this.doc.text("Playa / ZBM: " + beach.name, 10, 20)
      const {incidents} = beach
      this.doc.autoTable({
        head:[['Nº REGISTRO','LATITUD','LONGITUD','BANDERA','ORIGEN DE LA LLAMADA','FECHA','TIPO DE SITUACIÓN','ALARMA','MEDIOS EMPLEADOS', 'Nº DE SOCORRISTAS','PERSONAS AFECTADAS','HORA DE NOTIFICACIÓN','Nº INCIDENCIA CECOES','TIEMPO DE LLEGADA (MINS)','EVACUACIÓN', 'TIPO CENTRO'] ],
        body:incidents.map( report =>{
          let resources = report.externalResourcesUsed.concat(report.resourcesUsed)
          resources = resources.map( resource => resource['name']) as any;

          // recursos = (recursos.length > 0) ? recursos.join("\n"): "---"
          let [longitude,latitude] = report.pointLocation.replace("POINT(","").replace(")","").split(" ")

          let evacuacion = (report.evacuation) ? report.evacuation : "--"
          let traslado = report.affectedPeople.map( affected => affected.translationCenter)
          
          
          //return [report["ID"],null,null,report["Fecha emision"],report["Emisor de Alarma"],"--",report["Numero de Socorristas"],report['N. Personas Afect.'],"--",report['CECOES'],report['T. llegada medios Ext.'],"--","--",report['Evacuacion']]
          return [report.id, latitude,longitude,"--",report.alarmSender,report.date,report.type,report.alarmSender,resources,report.numberLifeGuard,report.affectedPeopleNumber,report.hourCall112,report.cecoes,report.delayArriveExternalResources,evacuacion,traslado]
        }),
        
        headStyles:{
          halign: 'center',
          fontSize:5
        },
        bodyStyles:{
          halign: 'center',
          fontSize:8
        },
        startY: 25,
      })

      /*var body =playa.afectados.filter( persona =>{ persona["emergency_grade"] >1}).map(persona =>{*/
      var afectados  = beach.affectedPeople.filter(persona => persona["emergencyGrade"]>1)

      var body =afectados.map(persona =>{
        var genero = persona["gender"] == "male" ? "Hombre":"Mujer"
        var traslado = persona["translation_center"] ? "Sí":"No";
        var primeros_auxilios = persona["require_first_aid"] ? "Sí": "No"
        var alta_voluntaria = persona["high_volunteer"] ? "Sí": "No"
        var desa = persona["used_desa"] ? "Sí": "No"
        const substances = persona['substance'].map( subs => subs.na).join("\n")

        let incident = incidents.find( i => i.id == persona['idIncident'])
        console.log(incident)
        return [persona["idIncident"],new Date(incident.dateIni).toLocaleTimeString('es-ES',{hour:'numeric', minute:'numeric'}),new Date(incident.date).toLocaleDateString('es-ES',{weekday:'long'}),persona["type_intervention"],genero,persona["country"],persona["age"],persona["municipality"],substances,persona["profile"],persona["emergencyGrade"],traslado,primeros_auxilios,alta_voluntaria,desa]
      })
      if( body.length >0){
        this.doc.addPage()
        this.doc.text("Personas afectadas del cuatrimestre", 10, 10)
        this.doc.autoTable({
          head:[['Nº REGISTRO','HORA','DÍA DE LA SEMANA','TIPO DE INTERVENCIÓN','GÉNERO','NACIONALIDAD','EDAD', 'MUNICIPIO','SUSTANCIAS LIMITANTES','PERFIL','GRADO DE EMERGENCIA', 'CENTRO DE TRASLADO','PRIMEROS AUXILIOS','ALTA VOLUNTARIA','DESFIBRILADOR']],
          body:body,
          styles:{
            fontSize:6
          },
          startY: 15,
        })

      }

      this.doc.addPage()
      this.doc.text("Localización de los incidentes",15,15)


      var img = document.createElement('img')
      img.src = beach.img
      img.height = 170
      img.width = 240
      this.doc.addImage(img, 30, 25, 234, 156,'','FAST');


      this.doc.addPage()
      
      this.doc.text("Análisis de las incidencias en " + beach.name, 10, 10)
      
      var ctx = canvas.getContext('2d');
      /** grafica por generos */
      

      let genderStatics ={
        Mujer:0,
        Hombre:0
      } 


      afectados.forEach( person =>{
        (person.gender == "male") ? genderStatics.Hombre++ : genderStatics.Mujer++
      })

      let gender_chart = this.render_pie(ctx,
                        Object.keys(genderStatics),
                        ["#6874F7", "#F7D5F5"], 
                        Object.values(genderStatics),
                        45,
                        35
      )
      gender_chart.destroy()

      let countryStatics ={} 
      afectados.forEach( person =>{
        countryStatics[person.country] = countryStatics[person.country]++ || 1;
      })

      let country_chart = this.render_pie(ctx,
        Object.keys(countryStatics),
        ["#F0C694", "#D9C899", "#CCC4B9", "#FF8FC3", "#FF8F8F", "#FFADAD"], 
        Object.values(countryStatics),
        185,
        35
      )
      country_chart.destroy()

      //this.doc.addPage()

      let ageStatics = {}
      
      afectados.forEach( person =>{
        if(person.age< 10){ ageStatics["0-10"] = ageStatics["0-10"]++ ||1}
        else if(person.age< 20){ ageStatics["10-20"] = ageStatics["10-20"]++ ||1}
        else if(person.age< 35){ ageStatics["20-35"] = ageStatics["20-35"]++ ||1}
        else if(person.age< 50){ ageStatics["35-50"] = ageStatics["35-50"]++ ||1}
        else if(person.age< 60){ ageStatics["50-60"] = ageStatics["50-60"]++ ||1}
        else{ ageStatics["+65"] = ageStatics["+65"] ++ || 1}
      })
      


      let age_chart = new Chart(ctx,
        {
          type:'bar',
          data: {
            labels: Object.keys(ageStatics),
            datasets: [{
              label: "Edades de las personas en las incidencias",
              backgroundColor: ["#F0C694", "#D9C899", "#CCC4B9", "#FF8FC3", "#FF8F8F", "#FFADAD"], 
              data: Object.values(ageStatics)
            }]
          },
          options:{
            scales:{
              // xAxes:[{
              //   ticks:{
              //     fontSize: 60
              //   }
              // }],
              // yAxes:[{
              //   ticks:{
              //     fontSize: 40
              //   }
              // }]
              x:{
                ticks:{
                  font:{
                    size:60
                  }
                }
              },
              y:{
                ticks:{
                  font:{
                    size:60
                  }
                }
              }
            },
            // legend:{  
            //   labels:{
            //     font:{
            //       size:60
            //     }
            //   }
            // },
            animation:{
              duration: 0,
              onComplete:(e) =>{
                var img = new Image()
                img.src = e.chart.toBase64Image()
                //this.doc.addImage(img, 45, 120, 70, 60, undefined, 'MEDIUM')
                this.doc.addImage(img, 45, 120, 70, 60,'','FAST')
              }
            }
          }
      })
      age_chart.destroy();

      let causesStatics = {}
      
      afectados.forEach( person =>{
        let {firstAidCauses} = person;
        firstAidCauses.forEach( cause =>{
          causesStatics[cause["name"] as string] = causesStatics[cause["name"]]++ || 1;
        })
        //

      })

      let causes_chart = this.render_pie(ctx,
        Object.keys(causesStatics),
        ["#F0C694", "#D9C899", "#CCC4B9", "#FF8FC3", "#FF8F8F", "#FFADAD"], 
        Object.values(causesStatics),
        185,
        120
      )
      causes_chart.destroy()

      this.doc.addPage()
      this.doc.text("PROBLEMAS DE COORDINACION DETECTADOS COCES 1-1-2",10,10);
      this.doc.autoTable({
        head:[['Nº DE REGISTRO','Nº DE INCIDENCIA CECOES', 'TIPO DE SITUACIÓN', 'OBSERVACIONES']],
        body:incidents.map( report => {
          var observaciones = (report.observation) ? report.observation : "--";
          return [report.id,report.cecoes,report.type,observaciones]
        }),
        columnStyles:{
          0:{cellWidth: 40},
          1:{cellWidth: 40},
          2:{cellWidth: 40},
          3:{cellwidth:'auto'}
        },
        headStyles:{
          halign: 'center',
        },
        bodyStyles:{
          halign: 'center',
        }
      })
    })

    canvas.style.display="none";
  }

  private async backCoverPDF(municipality,quarter,year,conclutions){
    
    var widthPage = this.doc.internal.pageSize.width;
    var heightPage = this.doc.internal.pageSize.height;
    this.doc.setFontSize(15)
    this.doc.addPage()
    this.doc.text("Conclusiones",10,10);

    this.doc.line(15,15, widthPage-15,15);
    this.doc.line(15, heightPage/2 ,widthPage-15, heightPage/2);
    
    this.doc.line(15, 15 ,15, heightPage/2);

    this.doc.line(widthPage-15,15,widthPage-15,heightPage/2);
    this.doc.text( conclutions,16,22)
    var date = new Date(Date.now());
    var day = date.getDate();
    var month = date.getMonth() +1;
    var currentYear = date.getFullYear()
    this.doc.text(`Fecha de emisión del Informe: ${day}/${month}/${currentYear}`, widthPage/2 -30, heightPage/2 + 15)
    this.doc.text(`Firma:`, 15, heightPage/2 + 30)

    this.doc.save(`${year}_${quarter}_${municipality}.pdf`.split(" ").join('_'))

  }
}
