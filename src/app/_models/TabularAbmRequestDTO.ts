import {  FormdataReportdef } from './formdata';
export interface TabularAbmRequestDTO {
    username: string;
    dataSource: string;
    webServicesAddress: string;
    modelPackage: string;
    idUsuarioUra: number;
    reportdef: string;
    filename: string;
    vista: string;
    desde: number;
    hasta: number;
    valueFinder: any;
    campoFinder: string;
    list: FormdataReportdef[];
    global: FormdataReportdef[];
    filterNameParam: string;
    filterType: string;
    noEjecutarSelect: boolean;
    mobile:boolean;
}
