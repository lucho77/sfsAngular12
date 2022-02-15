import { NameParamDTO } from './nameParamDTO';
export interface ParamAllRequestDTO {
    list: NameParamDTO [];
    username: string;
    dataSource: string;
    webServicesAddress: string;
    modelPackage: string;
    idUsuarioUra: number;
}
