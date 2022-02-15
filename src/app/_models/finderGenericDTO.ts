import { FormdataReportdef } from './formdata';
export interface FinderGenericDTO {

type: string;

label: string;

atribute: string;

value: any;

parametrosFinderMetodo: FormdataReportdef[];

filtrosDependencia: FormdataReportdef[];

globalParam: string;

}
