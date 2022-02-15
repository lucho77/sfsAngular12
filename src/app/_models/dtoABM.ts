import { FormdataReportdef } from './formdata';
import { ReportDefRequestDTO } from './reportDefRequestDTO';
export interface DtoABM {
modificar: boolean;
// vista nuevo
nuevo: boolean;
// vista tabular
tabular: boolean;
// nombre del reporte
reportdef: string;
// nombre de la entidad
entidad: string;
// valores de la busqueda en el tabular
requestDTOFinders: ReportDefRequestDTO;
// lista de campos del abm en las vistas nuevo o modificar apenas traidas
// del server
listCamposABMInicial: FormdataReportdef[];
// lista de campos del abm en las vistas nuevo o modificar despues que el
// usuario hizo submit
listCamposABMFinal: FormdataReportdef[];
// tiene la instantanea de los editado, cuando se edita una busqueda
// generica;
// determina si el abm tiene hijos

vistaABM: string;

modificarPadreHijo: boolean;
// vista nuevo
// nombre del reportte hijo que hace mension el padre
reportdefHijo: string;

modificarHijo: boolean;
entidadHijo: string;
parametroRelacionPadreHijo: string;
// vista del hijo
vistaHijo: string;

// parametros de filtro del abm
listParamAbm: FormdataReportdef[];

// parametros auxiliares --
listCamposAuxiliares: FormdataReportdef[];



}
