import { FinderDTO } from './finderDTO';
import { HeaderDTO } from './headerDTO';
import { RowsTabla } from './rowsTabla';
import { FormdataReportdef } from './formdata';
import { AccionColumna } from './accionColumna';
import { PermisoDTO } from './permisoABM';
export interface Tabular {

 finderDTOs: FinderDTO[];
 rowLabel: string;
 etiqueta: string;
 headerArchivo: string;
 nameColumnaId: string;
pkColIndex: number;
totalRows: number;
fromRow: number;
pageRows: number;
columns: HeaderDTO[];
data: RowsTabla[];
dataMobile: RowsTabla[];
vista: string;
accionesColumna: AccionColumna[];
botones: FormdataReportdef[];
footer: boolean;
seleccionMultiple: boolean;
eliminacionMultiple: boolean;
permisoDTO: PermisoDTO;
enviaParametros: string;
editarSi: string;
agregarSi: string;
destination: string;
tabularDescriptivo: boolean;
campoDescriptivo: string;
onlyOwner: boolean;
onlyOwnerField: string;
 onlOwnerDayField: string;
onlyOwnerDay: boolean;
onlyOwnerParamGlobal: string;
labelcabeceraABM: string;
mostrarFiltros: boolean;
edicionHorizontal: boolean;
paginar: boolean;
responsive: string;
actualizar: boolean;
}


