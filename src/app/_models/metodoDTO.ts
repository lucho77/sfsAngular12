import { animate } from '@angular/animations';
import { FormdataReportdef } from './formdata';
import { PreMethodDTO } from './preMethodDTO';

export interface MetodoDTO {

methodName: string;
// el label del botom
labelButtom: string;

// el Icono del botom
iconoButtom: string;

// la accion a desarrollar puede ser un sql nativo o hql, o bien un procedimiento almacenado
ejecutar: string;

// tipo de metodo a ejecutar
tipoMetodo: string;

// reportname a llamar en caso de que el tipo de metodo sea un reportname
reportName: string;

// si es inmediato, esto es en los PDF
inmediate: boolean;

// se utiliza para saber en que BB se esta ejecutando

backingBeanDinamic: string;

// se utiliza por ejemplo en los PDF en los que se tiene que hacer referencia a los BB anteriores
backingBeanDinamicAnterior: string;

// una vez terminada la accion del botom si hay alguna nueva accion aqui se pone
 metodoDTO: MetodoDTO;
// nomenclatura del metodo usado en el FW
nomenclaturaMetodoFW: string;
// si es PDF
pdf: boolean;
// Si es ABM
abm: boolean;

// Usado para las modificaciones y la utilizacion de valores de pk
objeto: any;
// objeto que representa el evento
objetoEvento: FormdataReportdef[];
// parametros de la llamada
paramsPasar: Map<String, any>;

// el tipo de Reportdef que contiene el Metodo
tipoReportdefParent: string;

// determina si ese metodo pasa Parametros
subeParametros: boolean;


// si es un Store Procedure
storeProcedure: boolean;

// determina si esta llamado nuevamente a su padre
volverAlPadre: boolean;
// es una seleccion Multiple
seleccionMultiple: boolean;

// vista del abm
vistaABM: string;

// on Cancel metodo que se activa cuando cancelan
onCancel: string;
// comentario de la accion;
comentario: string;
// se usa para validar una accion Ej: un form llama a un tabular y se quiere validar ciertos valores
validaTabularFromForm: boolean;

// si esta en 1 no guarda la accion en el historico
noGuardaHistorico: boolean;
// mensaje antes de la accion
mensajeAntesAccion: string;

// chequea en la persistencia si existe hijos
chequeaExisteHijo: boolean;

tabularMetodo: string;
ordenBotones: number;
// si esta en 1 borra el historico Actual;
borraHistoricoActual: boolean;
// si esta seteada borra todo el historico anterior, es como si vendria del menu
borraHistoricoTotal: boolean;

// el valor de retorno se puede asignar a un parametro Ej: P_IDMOVBANCO
retasigparam: string;

// es un metodo asyncronico
asyncronico: boolean;

// open in new Window
openNewWindow: string;

paramSolapa: string;

clickFilaTabular: boolean;
aditionalColumn: boolean;
metodoValidaForm: string;
bucleFormMetodo: boolean;
id: number;
preMethodDTO: PreMethodDTO;
accionParam: FormdataReportdef;
buttonVolverYguardar: boolean;
recargarSiempre: boolean;
cssColor:string;
}

