import {  FormdataReportdef } from './formdata';
export interface ReportDefRequestDTO {

reportName: string;
entity: string;
titulo: string;
viewName: string;
filenamePath: string;
idTab: string;
firstRow: number;
maxRow: number;
filterValue: number;
filterAtribute: string;
filterType: string;
filterNameParam: string;
preMethodButtom: string;
nueva: boolean;
tabularNativo: boolean;
enviaParametrosGlobales: boolean;
idReporte: number;

// Son listas usadas para la busqueda Avazanda
listFilterValue: any[];
listFilterAtribute: string[];
listOrderBy: string[];
listFilterType: string[];
listFilterNameParam: string[];
listFilterOperator: string[];
listNull: string[];


tituloReporte: string;
filterLabel: string;
typeExport: number;
formatExport: number;
filePath: string;
idFilterByPadre: number;
clasePadre: string;
tipoComponente: string;
// filtro de los abm que son filtrados por algun valor
// private FilterABM filterABM;
siguienteAccion: FormdataReportdef;
volverAABM: boolean;
fmtABM: boolean;

idFilterPreseteo: any;
busquedaAvanzada: boolean;

muestraTotales: boolean;
volverHistorico: boolean;
onCancel: boolean;
contenedorModal: boolean;
headerlinkColumn: string;
columnasTotales: Map<String, Object>;

recargarForm: boolean;

noEjecutarSelect: boolean;

parametroPadre: string;
atributoPadre: string;

impresionTabular: boolean;

}
