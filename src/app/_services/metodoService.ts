import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../_models';
import { ChatDTO } from '../_models/chatDTO';
import { devolverProyecto } from '../util/proyectoUtil';

@Injectable({ providedIn: 'root' })
export class MetodoService {
    constructor(private http: HttpClient) { }

    nuevoChat(user: User, datos: ChatDTO) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post(`${devolverProyecto()}/nuevaConsultaChat/`, datos)
        .pipe(map(result => result));
    }
}
