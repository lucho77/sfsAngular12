import { HttpErrorResponse } from '@angular/common/http';
import { reject } from 'q';
import { DataToken } from 'src/app/_models/dataToken';
import { FrontEndConstants } from '../constans/frontEndConstants';
import { ParametrosExecuteMethodRequestDTO } from '../_models/parametrosExecuteMethodRequestDTO';
import { ParametrosGlobalesDTO } from '../_models/parametrosGlobalesDTO';
import { AuthenticationService } from '../_services';
import { ReportdefService } from '../_services/reportdef.service';

export function configurarParamnetrosGlobales(user: any, authenticationService: AuthenticationService, context: any, isMovil: boolean,
     token: string ) {
    return new Promise(resolve => {
      authenticationService.getParametrosGlobales(user.username, user.datasource,
      user.idUsuarioUra, user.packageModel).subscribe
    ((p: ParametrosGlobalesDTO) => {
        // parametro globales traidos del service
        console.log('preparando parametros globales');
        if (isMovil) {
          // meto el longitud y latitud
          console.log('configurando los parametros globales en modo Movil');
          console.log('context Movil');
          console.log(JSON.stringify(context));
          // const location = JSON.parse(context.location);

          for ( const g of p.list) {
            console.log('***************p.name*********************');
            if ( g.metodo !== null && g.propiedad !== null && (context.location !== null && context.location !== undefined )) {
              console.log('context.location.longitude' );
              console.log(context.location.longitude );
              console.log('context.location.latitude' );
              console.log(context.location.latitude );
              console.log('propiedad' );
              console.log(g.propiedad );
              const value = context.location[g.propiedad];
                console.log('****************Name Parametro Global***************');
                console.log(g.name);
                console.log('****************value Parametro Global***************');
                console.log(value);
                g.valueNew = value;
            }
          }
        }
        if (isMovil) {
          for ( const g of p.list) {
            if (g.name === FrontEndConstants.P_TOKEN) {
              g.valueNew = token;
              console.log(g.valueNew);
              break;
            }
          }
        }
        if (user.sharedDTO) {
            // esto quiere decir que viene desde un Shared
            // el parametro que viene en el shared
            console.log('user.sharedDTO');
            console.log(user.sharedDTO);
            for ( const g of p.list) {
              if (g.name === 'P_IDAFILIADO4') {
                g.valueNew =   user.sharedDTO.idAfiliado;
                g.value =   user.sharedDTO.idAfiliado;
                g.busquedaGenericaDTO.mostrarToStringLupa = user.sharedDTO.nameAfil;
                  localStorage.setItem('tabInformationName', user.sharedDTO.nameAfil);
                  // this.nameService.setearNameGlobal(user.sharedDTO.nameAfil, null);
                }
            if ( g.name === FrontEndConstants.SHAREDPARAMETER ) {
              console.log('el parametro g.name');
              g.valueNew = user.sharedDTO.idCompartir;
            }
          }
         }
            localStorage.setItem('paramGlobal', JSON.stringify(p));
            // this.loadSpinner = false;
            resolve(p);
           },
(err: HttpErrorResponse) => {
 console.log('ERRORRRRRRRRRRRRRRRRRRR');
// this.loadSpinner = false;
 // this.error = 'error de acceso a los parametros Globales';
  console.log('error de acceso a los parametros Globales');
  if (err['tokenError'] || err['tokenExpired'] ) {
//    this.router.navigate(['/token']);
    reject();
    return;
  } else {
  //  this.router.navigate(['/globalParamsError']);
    reject();
    return;
  }
});

});

}
export function configurarMenu(user: any, authenticationService: AuthenticationService) {
    return new Promise(resolve => {

    authenticationService.getObtenerMenu(user.username, user.datasource, user.idUsuarioUra).subscribe
    (m => {
            // login successful if there's a jwt token in the response
    //       console.log('menu: ' + m);
             localStorage.setItem('userMenu', JSON.stringify(m));
           // this.loadSpinner = false;
           resolve(m);
            },
    (err: HttpErrorResponse) => {
      console.log('ERRORRRRRRRRRRRRRRRRRRR');
      console.log('error de acceso al menu');
      if (err['tokenError'] || err['tokenExpired'] ) {
        // this.router.navigate(['/token']);
        reject();
        return;
      } else {
        // this.router.navigate(['/menuError']);
        reject();
        return;
      }
    }
    );
  });


  }

  export function obtenerReporteInicio(user: any, authenticationService: AuthenticationService) {
    return new Promise<void>(resolve => {

    authenticationService.obtnerReporteInicio(user.username, user.datasource, user.idUsuarioUra).subscribe
    (m => {
            // login successful if there's a jwt token in the response
    //       console.log('menu: ' + m);
    // en teoria al devolverle el reporte y al guardar en el loccal storage
    // lo toma el home y lo redirecciooooona al reporte correcto
    // Y LA CONCHA DE DE SU MADRE INTERNET DE MIERDA
    console.log(m.respuestagenerica);
    if ( m.respuestagenerica === null || m.respuestagenerica === undefined || m.respuestagenerica.trim() === '' ) {
        console.log('no carga form inicial');
    } else {
      localStorage.setItem('reporte', m.respuestagenerica);
    }
           // this.loadSpinner = false;
           resolve();
            },
    (err: HttpErrorResponse) => {
      console.log('ERRORRRRRRRRRRRRRRRRRRR');
      console.log('error de acceso al reporte inicio');
        reject();
    }
    );
  });


  }

  export function ejecutarMetodoArea(user: any, m: any, reportdefService: ReportdefService) {
    return new Promise<void>(resolve => {
     const pos =  user.metodo.indexOf('(');
     const listAux = [];
     const metodo =  user.metodo.substring(0, pos);

     const param = user.metodo.substring(pos + 1, (user.metodo.length - 1 ));
     const params = param.split(',');
     for (const p of params) {
       for ( const g of m.list) {
         if (g.name === p) {
           listAux.push(g);
         }
       }
     }
     for (const p of listAux) {
        if (p.name === 'P_IDAFILIADO4' && (p.valueNew === null || p.valueNew === undefined )) {
          // no debe ejecutar nada si el parametro P_IDAFILIADO4 esta en null
          resolve();
          return;
        }
     }


     const dataMetodo = {} as ParametrosExecuteMethodRequestDTO;
     // tslint:disable-next-line:prefer-const
     dataMetodo.list = listAux;
     dataMetodo.pdf = false;
     dataMetodo.metodo = metodo;
      reportdefService.postExecuteMethod(user, dataMetodo).subscribe(
         (mensaje: any) => {
           localStorage.setItem('tabInformationBody', mensaje.valor);

           for ( const g of m.list) {
            if (g.name === 'P_IDAFILIADO4') {
                localStorage.setItem('tabInformationName', g.busquedaGenericaDTO.mostrarToStringLupa);
                break;
            }
          }
           resolve();
         },
         (err: HttpErrorResponse) => {
          console.log(err);
              reject();
              return;

          });
        });
 }
 export function extenderToken(user: any, authenticationService: AuthenticationService) {
    return new Promise(resolve => {
      authenticationService.getExtendToken().subscribe
    ( tokenExtended => {
      user.token = tokenExtended.token;
      localStorage.setItem('currentUser', JSON.stringify(user));
      resolve(user);
    },
    (err: HttpErrorResponse) => {
      console.log(err);
      // this.errorLogin = true;
      // this.loadSpinner = false;
      if (err['errorBusiness']) {
          // es un error
         //  this.error = err['mensaje'];
          reject();
          return;
      } else {
          // this.error = 'error al tratar de extender token app';
          reject();
          return;
      }
    });
  });

  }
  export function persistirTokenCel(token: string, user: any, authenticationService: AuthenticationService) {
    return new Promise(resolve => {

    const dataToken = {} as DataToken;
    dataToken.token = token;
    dataToken.usuario = user.username;
    console.log('dataToken.token');
    console.log(dataToken.token);
    console.log(dataToken.usuario);

    authenticationService.getPersistirToken(dataToken, user).subscribe
    ( tokenData => {
      console.log('exito persistiendo el token de telefono');
      user.tokenCel = token;
      localStorage.setItem('currentUser', JSON.stringify(user));
      resolve(tokenData);
    },
    (err: HttpErrorResponse) => {
      console.log('ERRORRRRRRRRRRRRRRRRRRR');
      console.log('persistir token');

      console.log(err);
    //  this.errorLogin = true;
     // this.loadSpinner = false;
      if (err['errorBusiness']) {
          // es un error
       //   this.error = err['mensaje'];
          reject();
          return;
      } else {
        //  this.error = 'error al tratar de persistir token cel';
          reject();
          return;
      }
    });
  });

  }
