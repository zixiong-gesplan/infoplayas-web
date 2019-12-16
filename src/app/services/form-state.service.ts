import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FormStateService {
    private sFormsStateSource = new BehaviorSubject<number>(null);
    sFormsState$ = this.sFormsStateSource.asObservable();

    constructor() {
    }

    udpateFormState(pe: number) {
        this.sFormsStateSource.next(pe);
    }
}
