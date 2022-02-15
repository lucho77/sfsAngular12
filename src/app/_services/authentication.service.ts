import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ParametrosGlobalesDTO } from '../_models/parametrosGlobalesDTO';
import { devolverProyecto } from '../util/proyectoUtil';
import { RegistroDTO } from '../_models/registroDTO';
import { DataToken } from '../_models/dataToken';
import { User } from '../_models/user';
import { SemillaDTO } from '../_models/semillaDTO';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    menu: any = [];
    parametroGlobales: any = [];
    constructor(private http: HttpClient) { }
    loginExternal(idSession: string) {
        let params = new HttpParams();
        params = params.append('sessionID', idSession);
        return this.http.get<any>(`./externalAcces`, {params: params
        });
    }
    loginShared(usuario: string, semilla: string) {
        let params = new HttpParams();
        params = params.append('usuario', usuario);
        params = params.append('semilla', semilla);
        return this.http.get<any>(`./shared`, {params: params
        });
    }
    loginSocket() {
        let params = new HttpParams();
        params = params.append('usuario', 'prueba');
        return this.http.get<any>(`./sfsSockket`, {params: params
        });
    }
    login(username: string, password: string) {
        console.log('Permitido en el Authentication service');
        return this.http.get<any>(`${devolverProyecto()}/login/${username}/${password}/configura`);
    }
    obtnerReporteInicio(username: string, datasource: string, id: number) {
        console.log('Permitido en el Authentication service');
        return this.http.get<any>(`${devolverProyecto()}/obtenerFormInicio/${username}/${datasource}/${id}`);
    }
    version() {
        console.log('obteniendo version Server');
        return this.http.get<any>(`${devolverProyecto()}/versionServer/`);
    }
    cambiarContrasena(data) {
        console.log('Permitido en el Authentication service Cambiar Contraseña');
        const username = data.username;
        const contrasenaActual = data.contrasenaActual;
        const nuevaContrasena = data.nuevaContrasena;
        const idUsuarioUra = data.idUsuarioUra;
        const email = data.email;
        const mUrl  = `${devolverProyecto()}/cambiarContrasena/${username}
        /${nuevaContrasena}/${contrasenaActual}/${idUsuarioUra}/${email}`;

        return this.http.post(mUrl, data)
            .pipe(
                // tslint:disable-next-line:no-shadowed-variable
                map((data) => {
                    console.log(data);
                    // return data.feed.entry;
                    return data;
                  })
            );

    }
    getObtenerMenu( username: string, datasource: string, id: number) {
        // console.log('consultar menus  ' + id );
        this.menu = this.http.get<any>(`${devolverProyecto()}/cargarMenu2/${username}/${datasource}/${id}`);
        return this.getMenu();
    }
    getParametrosGlobales( username: string, datasource: string, idUsuarioUra: number, packageAplication: string) {
        console.log('obtener parametros globales  ');
        // tslint:disable-next-line:max-line-length
        this.parametroGlobales = this.http.get<ParametrosGlobalesDTO>(`${devolverProyecto()}/obtenerParametrosGlobales/${username}/${datasource}/${idUsuarioUra}/${packageAplication}`);
        return this.parametroGlobales;
    }
    logout() {
        // remove user from local storage to log user out
            const user = JSON.parse(localStorage.getItem('currentUser'));
            // si es un login en el celular le dejo grabada en la localStorage
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userMenu');
    }
    getMenu() {
        return this.menu;
    }
    getExtendToken() {
        return this.http.get<any>(`${devolverProyecto()}/extenderToken/`);

    }
    getRegister(datos: RegistroDTO) {
        return this.http.post(`${devolverProyecto()}/registrarce/`, datos)
        .pipe(map(result => result));
    }
    getValidacion(datos: SemillaDTO) {
        return this.http.post(`${devolverProyecto()}/registrarce/`, datos)
        .pipe(map(result => result));
    }
    getChequearSemilla(datos: SemillaDTO) {
        return this.http.post(`${devolverProyecto()}/chequeaSemilla/`, datos)
        .pipe(map(result => result));
    }
    getNuevaSemilla(datos: SemillaDTO) {
        return this.http.post(`${devolverProyecto()}/nuevaSemilla/`, datos)
        .pipe(map(result => result));
    }
    getPersistirToken( datos: DataToken, user: User, ) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post(`${devolverProyecto()}/guardarTokenTelefono/`, datos)
        .pipe(map(result => result));
    }
}
