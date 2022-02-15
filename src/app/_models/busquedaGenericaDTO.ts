import { ReportParamDTO } from './reportParamDTO';
export interface BusquedaGenericaDTO {
mostrarToStringLupa: string;
// si busca por varios campos
busquedaVariosCampos: boolean;
// si es una lista 1 a N
list: boolean;
// tipo
typeBusquedaStringDefecto: string;

typeFindBy: string;
// el typo del FindBy
typeFindByType: string;
// campo por defecto de busqueda
defaultFindBy: string;
// el typo del FindBy
typeFindByAlter: string;
// el typo del FindBy Alter
typeFindByTypeAlter: string;
// si es un campo editable
editable: boolean;
// la clase del framework
claseFramework: string;
// columna dinamica del 1 a n
columnListDina: string;
// Nombre del metodo por el cual la busqueda generica realizara la consulta
metodoNombre: string;

// GlobalParam del finder
globalParam: string;
// datos usados en el 1N

// header del 1 a n
headerList: string;
// esto dto sirve para personalizar la busqueda generica
// tiene la vista que llama la busqueda generica, asociado al parametro
 paramDTO: ReportParamDTO;

mask: string;
campoaMask: string;
view: string;

reportdefEditable: string;
reportdefEditableSoloConsulta: boolean;

parametrosLlamadaMetodo: string[];
parametrosLlamadaPostMetodo: string[];
parametrosLlamadaMensaje: string[];
postSeteoParametros: boolean;
postSeteoMessage: boolean;

findStringEqual: boolean;

metodoNombrePostFinder: string;
// Nombre del metodo que ejecuta para determinar si hay un mensaje
metodoNombreMessageFinder: string;

}

