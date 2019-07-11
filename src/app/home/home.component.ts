import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    title = 'infoplayascanarias';
    ContactForm: FormGroup;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        // TODO formulario de login
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

}
