import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    constructor() {
    }

    static showSuccessMessage(mensaje) {
        Swal.fire({
            type: 'success',
            title: 'Éxito',
            text: mensaje,
            footer: ''
        });
    }

    static showErrorMessage(title, mensaje) {
        Swal.fire({
            type: 'error',
            title: title,
            text: mensaje,
            footer: ''
        });
    }
}
