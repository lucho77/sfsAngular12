import {  FormdataReportdef } from './formdata';
export interface TabularRequestDTO {
    username: string;
    dataSource: string;
    webServicesAddress: string;
    modelPackage: string;
    idUsuarioUra: number;
    reportdef: string;
    vista: string;
    desde: number;
    hasta: number;
    list: FormdataReportdef[];
    global: FormdataReportdef[];
    mobile:boolean;
}
