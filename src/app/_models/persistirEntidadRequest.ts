import { FormdataReportdef } from './formdata';
export interface PersistirEntidadRequest {
    username: string;
    dataSource: string;
    webServicesAddress: string;
    modelPackage: string;
    idUsuarioUra: number;
    nueva: boolean;
    Entidad: string;
    valorPK: any;
    idNameClase: string;
    metodoPostUpdate: string;
    metodoPostPersist: string;
    camposPersistirDTO: FormdataReportdef[];
    checkHijo: number;
    vista: string;
    reporte: string;
}
