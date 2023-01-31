import { Component, OnInit, AfterViewInit } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { reject } from 'q';
import { AuthenticationService } from '../_services';
import { ReportdefService } from '../_services/reportdef.service';
import { configurarMenu, configurarParamnetrosGlobales, ejecutarMetodoArea, obtenerReporteInicio } from './loginUtils';
import { AppConfigService } from '../_services/AppConfigService';
import { RegistroDTO } from '../_models/registroDTO';


@Component({templateUrl: 'loginExternal.component.html'})
export class LoginExternalComponent implements OnInit {
  validarusuario:boolean;

    constructor(
        private authenticationService: AuthenticationService, private route: ActivatedRoute,
        private router: Router, private reportdefService: ReportdefService,private appConfig:AppConfigService

    ) {}

    ngOnInit() {
        // reset login status

/*
        this.route.paramMap.subscribe(params => {
          console.log(params);
          const eExt = params.get('ext');
          console.log('EL parametro 2A login es : ' + eExt);

          const lalocJSESSIONID = document.cookie;
          console.log('Las cookies en el login External son : ' + lalocJSESSIONID);
          console.log(lalocJSESSIONID);
        });

        console.log('estoy en el loginExternal External');  */
        this.authenticationService.logout();
        console.log('me voy a loguear');
        this.onExternalLogin();
    }


    // convenience getter for easy access to form fields
    login(user:string,pass:string) {
      return new Promise(resolve => {
        console.log(this.appConfig.getConfig())
      this.authenticationService.login(user, pass, 
      this.appConfig.getConfig().novalidaHabilitado).subscribe
      (user => {
  
        if (user.errorBusiness) {
                       // es un error
                       console.log('ERRORRRRRRRRRRRRRRRRRRR');
                       console.log('error metodo login');
                      return;
                   }
                   // this.loadSpinner = false;
                   if (user && user.token) {
                      // store user details and jwt token in local storage to keep user logged in between page refreshes
                      // limpio la cache local
                        localStorage.setItem('currentUser', null);
                        console.log('despues del localstorage');
                        this.authenticationService.logout();
                   }
                   localStorage.setItem('currentUser', JSON.stringify(user));
                   localStorage.setItem('paramGlobal', JSON.stringify(user.listGlobales));
                   localStorage.setItem('userMenu', JSON.stringify(user.menues));
                   localStorage.setItem('reporte', user.reporteInicio);
  
                   if (user['metodo'] !== null && user['metodo'] !== undefined) {
                     ejecutarMetodoArea(user, user.listGlobales, this.reportdefService);
                   }
                 
                   // this.cargarChat(user);
                    resolve(user);
      },
      (err: HttpErrorResponse) => {
        console.log('error metodo login');
        console.log(err);
  
          if (err['errorBusiness']) {
              // es un error
                if(err['confirmoMail']){
                  //debe confirmar mail
                  this.validarusuario = true;
                  let paramRegister = {} as RegistroDTO;
                  paramRegister.username = user;
                  localStorage.setItem('userAdd', JSON.stringify(paramRegister));
                }
                this.router.navigate(['/login']);
                reject();
                return;
          } else {
              return;
          }
        }
      );
    });
    }
  

   async  onExternalLogin() {
      console.log('logueando nuevo....');
      const userExternal:any  = await this.obtenerUsuarioLoginExterno();
      const user:any = await this.login(userExternal.username,userExternal.pass);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('paramGlobal', JSON.stringify(user.listGlobales));
      localStorage.setItem('userMenu', JSON.stringify(user.menues));
      localStorage.setItem('reporte', user.reporteInicio);

      if (user['metodo'] !== null && user['metodo'] !== undefined) {
       await ejecutarMetodoArea(user, user.listGlobales, this.reportdefService);
      }
      this.router.navigate(['/full/home']);
    }

    obtenerUsuarioLoginExterno() {
      return new Promise(resolve => {


        this.authenticationService.loginExternal(null).subscribe
        (user => {
                // login successful if there's a jwt token in the response
                     if (user.errorBusiness) {
                         // es un error
                         this.router.navigate(['/login']);
                         reject();

                         return;
                     }
                    /*
                     if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    // limpio la cache local
                    console.log('limpiando cache');
                    //localStorage.setItem('currentUser', null);

                    this.authenticationService.logout();
                     }
                     localStorage.setItem('currentUser', JSON.stringify(user));
                     if (user.sharedDTO) {
                      localStorage.setItem('reporte', user.sharedDTO.reporte);
                     }
                     */
                     resolve(user);
        },
        (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log( 'Client-side error occured.' + err );
            } else {
              console.log( 'Server-side error occured.' + err);
            }
            reject();

          }
        );


      });
    }

}
