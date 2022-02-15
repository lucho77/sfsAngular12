import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../_models';
import { TabularAbmRequestDTO } from '../_models/TabularAbmRequestDTO';
import { FinderParamsDTO } from '../_models/finderParamsDTO';
import { ParametrosExecuteMethodRequestDTO } from '../_models/parametrosExecuteMethodRequestDTO';
import { devolverProyecto } from '../util/proyectoUtil';

@Injectable({ providedIn: 'root' })
export class AbmService {
    constructor(private http: HttpClient) { }
    eliminarEntidad(dato: User, reporte: string, id: number,
        idOnlyOwner: number, onlyOwner: boolean, onlyOwnerDay: boolean, campoOnlyOwner: string, campoDayOnlyOwner: string  ) {
        
            const datos = {
            username: dato.username,
            dataSource: dato.datasource,
            token: dato.token,
            idUsuarioUra: dato.idUsuarioUra,
            webServicesAddress: dato.webservice,
            modelPackage: dato.packageModel,
            ReportName: reporte,
            id: id,
            vista: null,
            idSessionUser: null,
            idOnlyOwner: idOnlyOwner,
            onlyOwner: onlyOwner,
            onlyOwnerDay: onlyOwnerDay,
            campoOnlyOwner: campoOnlyOwner,
            campoDayOnlyOwner: campoDayOnlyOwner
      };
        return this.http.post(`${devolverProyecto()}/eliminarEntidad/`, datos)
        .pipe(map(result => result));
    }

    consultarAbmGeneric(dato: User, finder: FinderParamsDTO ) {

        finder.dataSource = dato.datasource;
        finder.username = dato.username;
        finder.webServicesAddress = dato.webservice;
        finder.modelPackage = dato.packageModel;
        finder.idUsuarioUra = dato.idUsuarioUra;

        return this.http.post(`${devolverProyecto()}/consultarDatosBusquedaGenerica/`, finder)
        .pipe(map(result => result));
    }
    preseteoCampos(user: User, datos: ParametrosExecuteMethodRequestDTO) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post(`${devolverProyecto()}/rellenoCampos/`, datos)
        .pipe(map(result => result));
    }
    generarPDFABM(dato: User, dataPdf: TabularAbmRequestDTO ) {

        dataPdf.dataSource = dato.datasource;
        dataPdf.username = dato.username;
        dataPdf.webServicesAddress = dato.webservice;
        dataPdf.modelPackage = dato.packageModel;
        dataPdf.idUsuarioUra = dato.idUsuarioUra;
        return this.http.post(`${devolverProyecto()}/generarABMPdf/`, dataPdf)
        .pipe(map(result => result));
    }

}
