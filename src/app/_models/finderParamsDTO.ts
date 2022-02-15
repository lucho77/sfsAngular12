import { FormdataReportdef } from './formdata';
import { FinderGenericDTO } from './finderGenericDTO';
export interface FinderParamsDTO {

username: string;
dataSource: string;
idUsuarioUra: number;
webServicesAddress: string;
modelPackage: string;
entityClass: string;
viewName: string;
nameParam: string;
finderGenericDTO: FinderGenericDTO;
firstRow: number;
maxRows: number;
globalParam: string;
vista: string;
entity: string;
listGlobales: FormdataReportdef[];

typeMethodFinder: boolean;
methodName: string;

}
