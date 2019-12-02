import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
declare var jQuery: any;
declare function init_plugins();

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
    title = 'infoplayascanarias';
    ContactForm: FormGroup;

    constructor(private fb: FormBuilder, public router: Router) {
    }

    ngOnInit() {
        init_plugins();
        this.ContactForm = this.fb.group({
            email: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6),
                Validators.pattern('[a-z]*')])),
            phone: new FormControl('', Validators.compose([Validators.minLength(6),
                Validators.pattern('[a-z]*')])),
            first_name: new FormControl('', Validators.required),
            message: new FormControl('', Validators.required),
            last_name: new FormControl('', Validators.required)
        });
    }

    onSubmit(ContactForm: FormGroup) {
        // TODO formulario de contacto
    }

    ngAfterViewInit() {
        setTimeout(function () {
            jQuery('#loader-fade').hide();
        }, 800);
    }
}
