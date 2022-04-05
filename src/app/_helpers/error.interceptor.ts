import { Error } from '../_models/error';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log('entro al interceptor');
             // console.log(err);
             if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload();
            }
//            const error = err.error;
            // this.errorService.limpiar();
            if (err.error !== 'undefined') {
                const error = new Error(err.error.mensaje, err.error.errorBusiness, err.error.tokenError, err.error.tokenExpired,
                     false, '{}', '{}', '{}', '{}', '{}',err.error.confirmoMail);
                console.log('error business');
                 console.log(error);
               // this.errorService.setError(error);
                return throwError(error);
            } else {
                console.log('error grave ');
                const error = new Error('Error Grave', false, false, false, true, '{}', '{}', '{}', '{}', '{}',false);
                // this.errorService.setError(error);
                return throwError(error);
            }
        }));
    }
}
