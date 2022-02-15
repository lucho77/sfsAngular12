import {  FormdataReportdef } from './formdata';
export interface ReportdefDTO {


nombreReporte: string;
label: string;
listParametrosComienzo: FormdataReportdef[];
listParametrosFin: FormdataReportdef[];
listBotones: FormdataReportdef[];
// lista de parametros que le pasan al reporte
listParametrosPasados: FormdataReportdef[];
formClase: boolean;
vistaForm: string;
recargarForm: boolean;
labelTabular: string;
labelForm: string;
}
