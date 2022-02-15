import { FormdataReportdef } from './formdata';
import { TabField } from './tabField';
import { MetodoDTO } from './metodoDTO';

export interface FormReportdef {
   visualizacion: string;
   list: FormdataReportdef[];
   labelDescripcion: string;
   camposAgrupados: string;
   fieldsTab: TabField[];
   tabs: boolean;
   formMetodo: boolean;
   parametro: FormdataReportdef;
   metodoDTOs: MetodoDTO[];
   dinamycForm: boolean;

}
