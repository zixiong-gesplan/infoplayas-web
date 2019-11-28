import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
declare var $: any;
declare var jquery: any;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {

    Swal.fire({
      title: 'Esta seccioón no esta activa en este momento',
      text: "Haga click en volver para salir de la sección",
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Volver'
    }).then((isConfirm) =>{
      if (isConfirm) {
        this.location.back();
      }
    })
  }

}
