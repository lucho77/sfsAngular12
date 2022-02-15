import { FormdataReportdef } from './formdata';
import { Tabular } from './tabular';
import { AbmParams } from './abmParams';
import { TabField } from './tabField';
export interface ContainerAbmNuevoDTO {

list: FormdataReportdef[];
globalParam: string;
accionABM: string;
listBotones: FormdataReportdef[];
metodoPreseteo: string;
reportDefHija: string;
clasePadre: string;
// metadato que trae la grilla con los hijos, si hubiere
// lo utilizamos para mandar el id del padre para salvar un hijo
filtrosBusquedaMultiple: string;
tituloForm: string;
ituloFormHijo: string;
vistaModificable: boolean;
vistaPadre: string;
volverSoloHistorico: boolean;
onCancel: boolean;
actualizarGrillaHijo: boolean;
noGuardaPadre: boolean;
chequeaDecimales: boolean;
cantidadHijos: number;
parametrosEnviar: string;
noVuelveGuardar: boolean;
id: number;
tableDTO: Tabular;
abmParams: AbmParams;
tieneHijoAlta: boolean;
reportePadre: string;
componentesAgrupados: string;
postUpdate: string;
postPersist: string;
fieldsTab: TabField[];
tabs: boolean;
}
