import { FormdataReportdef } from './formdata';
export interface ParametrosExecuteMethodRequestDTO {
    username: string;
    dataSource: string;
    webServicesAddress: string;
    modelPackage: string;
    idUsuarioUra: number;
    metodo: string;
    metodoTabular: string;
    ejecutarSQLNativo: boolean;
    pdf: boolean;
    list: FormdataReportdef[];
    async: boolean;
}
