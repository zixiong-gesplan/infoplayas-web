import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class ResponseInterceptorService implements HttpInterceptor {

    constructor(private router: Router) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse && event.body && event.body.error && (event.body.error.code === 401 ||
                    event.body.error.code === 498)) {
                    console.log('No autorizado o sesión finalizada');
                    sessionStorage.clear();
                    // TODO hay que implementar el returnUrl, a ver si se puede enviar despues del login de Esri
                    this.router.navigate(['/home'], {queryParams: {returnUrl: this.router.url, sessionout: true}});
                } else {
                    return event;
                }
            }),
            catchError((error: HttpErrorResponse) => {
                Swal.fire({
                    type: 'error',
                    title: 'Error ' + error.status,
                    text: error && error.error.reason ? error.error.reason : 'No se puede conectar con el servidor, reinténtelo más tarde por favor.',
                    footer: ''
                });
                return throwError(error);
            }));
    }

}

