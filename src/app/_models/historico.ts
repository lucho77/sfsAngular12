import { TipoReporte } from './tipoReporte';
import { ReportdefData } from './reportdefData';
import { FormdataReportdef } from './formdata';
import { MetodoDTO } from './metodoDTO';
import { FinderRequestDTO } from './finderRequestDTO';
import { ContainerAbmNuevoDTO } from './AbmEditResponse';
export interface Historico {
    // que tipo de reporte es
    repordef: ReportdefData;
    // parametros que le son pasados en la llamada
    listRequest: FormdataReportdef[];
    // parametros que son del reportdef ejemplo la lista de componentes del form o la lista de botones de un tabular
    listParamOwner: FormdataReportdef[];
    // metadata de la llamada
    metadata: MetodoDTO;
    menu: boolean;
    finderRequestABM: FinderRequestDTO;
    // metadata ABM
    containerABM: ContainerAbmNuevoDTO;
    // aca pongo los objetos por los cuales filtra el abm
    listParamABM: FormdataReportdef[];

    // es el parametro que me sirve para filtrar en acciones de ABM con hijos
    formdataClasePadre: FormdataReportdef;
    formTipoClase: string;
    labelReporte: string;
}
