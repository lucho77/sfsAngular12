import { CheckDTO } from './checkDTO';
import { ComboDTO } from './comboDTO';
import { ButtonDTO } from './buttomDTO';
import { FechaDTO } from './fechaDTO';
import { BusquedaGenericaDTO } from './busquedaGenericaDTO';
import { TextAreaDTO } from './textAreaDTO';
import { DtoABM } from './dtoABM';
import { ReportdefDTO } from './reportdefDTO';
import { ParametrosDependenciaDTO } from './parametrosDependencia';
import { FechaCustomDTO } from './fechaCustomDTO';
import { DependenciaComboDTO } from './dependenciaComboDTO';
import { RadioOpcionDTO } from './radioOpciones';
export interface FormdataReportdef {

id: number;
idParametro: number;
// Etiqueta Parametro
label: string;
// Nombre Parametro
name: string;
// Nombre Parametro
nameRes: string;
// Atributo Parametro
attribute: string;
// Tipo Parametro
type: string;
// Valor Parametro
value: any;
// Valor al cargar Parametro
valueOld: any;
// Valor al cargar Parametro
valueNew: any;
// CAsting Parametro
// Requiere Parametro
require: boolean;
// es una entidad
entity: boolean;
// es un Boton
buttom: boolean;
// es una fecha
fecha: boolean;
// es una fecha hora
fechaHora: boolean;
// es un combo
combo: boolean;
// es un check
check: boolean;
// es un radio boton
radio: boolean;
// es un Textarea
textArea: boolean;
// es un RichTextarea
richTextArea: boolean;
// el parametro es global
global: boolean;
// el parametro es nuevoReporteDTO
nuevoReporte: boolean;
// label a mostrar en los tabular

// es un Busqueda Generica
busquedaGenerica: boolean;

// FechaDTO
fechaDTO: FechaDTO;
// ComboDTO
comboDTO: ComboDTO;
// ButtomDTO
buttomDTO: ButtonDTO;
// BusquedaGenericaDTO
busquedaGenericaDTO: BusquedaGenericaDTO;
// CheckDTO
checkDTO: CheckDTO;

// AREADTO
textAreaDTO: TextAreaDTO;

// es un link
link: boolean;

// el parametro se muestra desactivado
disable: boolean;
// el parametro determina si es una llamada externa
externalCall: boolean;

// Titulo tab
nombreTab: boolean;

// label a mostrar en la cabecera del reporte
tituloReporte: string;
// columnas destinos en el tabular
destinationParam: string;
// es un abm
abm: boolean;
// datos del abm
dtoABM: DtoABM;
// es un form
form: boolean;
// Datos del form
reportdefDTO: ReportdefDTO;
// es un tabular
tabular: boolean;
// determina si tiene hijos
padreAbm: boolean;
// datos del padre
// valor que devuelve la logica
valorDevueltoLogica: any;
// ayuda contextual
linkAyuda: string;
// es un componente numerico
entero: boolean;
// es un componente decimal
decimal: boolean;
// es un componente decimal
cantDecimales: number;
// es un componente Texto
onlyPositive: boolean;
// es un componente Texto

text: boolean;
// ayuda contextual parametro
contextHelp: string;

// id filtro Global
idNameFilterGlobal: string;

// es un TextareaDinamico
textAreaDinamico: boolean;


// es un tabular
casoUso: boolean;
// es un inlineYear
inlineYear: boolean;
// hasta q anio menor q se puede ingresar en un componente inlineYear
anioLiminteMenor: number;
// hasta que anio mayor q se puede ingresar en un componente inlineYear
anioLiminteMayor: number;



// dependencioa de parametros
// id filtro Dependiente
idNameFilterDependence: string;
// el parametro se muestra igual siempre
superVisible: boolean;

// para los links tabular

// lista de parametros para el componente de multiple busquedas genericas
// private List<String> subParametros = new ArrayList<String>();

// Nombre de parametro Busqueda Generica Multiple cuando se carga en el ABM
nombreParametroBusquedaGenerica: string;
// Es un radio Botom
radioBoton: boolean;
// nombre del grupo de botones Radio
// no se visualiza el parametro
parametroNoVisible: boolean;
// es un componente que muestre el mes y año
inlineMonth: boolean;
// es un label
labelComponent: boolean;
// es un upload
upload: boolean;
// contenido upload
archivoUpload: string;

// determina que este parametro es pk de un abm
pk: boolean;
// determina que este parametro es pk de un abm
pkTabular: boolean;


// es un Textarea
passwordField: boolean;

// es un campo auxiliar no se persiste
campoAuxiliar: boolean;

// componente OneToMany;
oneToMany: boolean;

// este boolean determina si la accion se abre en una nueva ventana
nuevaVentana: boolean;

// metodoBusquedaGenerica
metodoBusquedaGenerica: string;

// es un linkPivot
linkPivot: boolean;

// id
idPivot: number;

// parametro de un pivot
paramPivot: string;
// para los tabularPDF o TabularXLS determina el tipo de reporte
xls: boolean;

// es un RichTextarea ckEditor
ckEditor: boolean;

// es un uploadImpresion
uploadImpresion: boolean;
// tiene dependencia tipo formdata
dependenciaFormdata: boolean;
// metadata dependencia
dependenciaDTO: ParametrosDependenciaDTO[];
// parametro super global
superGlobal: boolean;
// REPORTE QUE LLAMA SI ES SUPER GLOBAL
reporteSuperGlobal: string;
// si tiene esta marca no es pisado por un parametro global
noEsPisadoGlobal: boolean;
// para que no lo permita editar ni aun si es parametro global
soloLecturaGlobal: boolean;
// es un parametro de tipo lista
lista: boolean;
// es un parametro de tipo lista
autocomplete: boolean;
// este tipo de fecha se puede customizar la apariencia
fechaCustom: boolean;
// Objeto  fecha customizada
fechaCustomDTO: FechaCustomDTO;
// campo que debo actualizar
actualizar: boolean;
// datos de la dependencia combo
dependenciaComboDTO: DependenciaComboDTO;
// las opciones del radio
radioOpcionDTO: RadioOpcionDTO[];
// parametro de tipo cards
cards: boolean;
// parametro que ejecuta un metodo en modo mobile
metodo: string;
// propiedad que toma del modo mobile
propiedad: string;
// es un clock
clock: boolean;
// es una expression
expression: boolean;

enviacomotexto: boolean;

methodDina: boolean;

}
