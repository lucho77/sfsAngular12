import { Pagination } from 'src/app/_models/pagination';
import { Tabular } from 'src/app/_models/tabular';
import { FinderGenericDTO } from '../../_models/finderGenericDTO';
import { FinderParamsDTO } from '../../_models/finderParamsDTO';
import { HeaderDTO } from '../../_models/headerDTO';

export function inicializarFinder(finder: FinderParamsDTO) {
    finder.dataSource = '';
    finder.username = '';
    finder.webServicesAddress = '';
    finder.modelPackage = '';
    finder.entityClass = '';
    finder.viewName = '';
    finder.nameParam = '';
    finder.firstRow = 0;
    finder.maxRows = 100;
    finder.entity = '';
    finder.vista = '';
    finder.methodName = '';
    finder.globalParam = '';
    finder.typeMethodFinder = false;
    finder.listGlobales = [];
    const  f = {} as FinderGenericDTO;
    f.type = '';
    f.label = '';
    f.atribute = '';
    f.value = '';
    f.globalParam = '';
    f.type = '';
    f.parametrosFinderMetodo = [];
    f.filtrosDependencia = [];
    finder.finderGenericDTO = f;
  }

  export function getData(datos: any, columns: HeaderDTO[]) {
      const d = [];
      let post = {};
      // console.log('datos length ' + datos.length);
      // console.log('columnas length ' + columns.length);
      for (let i = 0; i < datos.length; i++) {
        for (let j = 0; j < columns.length; j++) {
          post[columns[j].name] = datos[i][j].value;
        }
        // console.log('post' + JSON.stringify(post));
        d.push(post);
        post = {};
      }
    return d;
  }

  export function   generarDatosPaginacion(data: Tabular, dataTabular: any) {
    let pagination = {} as Pagination;
    pagination.activa = true;
    pagination.page = 1;
    pagination.cantidadRegistrosxPagina = 10;
    pagination.previousPage = 1;
    pagination.maxBotones = 1;
    pagination.listaPaginacion = [];
    pagination.listaSeleccionada = [];
    pagination.cantColVis = 0;
    if (data.data.length <=  pagination.cantidadRegistrosxPagina ) {
      pagination.activa = false;
    } else {
      pagination.maxBotones =  data.data.length / pagination.cantidadRegistrosxPagina;
    }
    const listaPagLoc: any = listaRangoPaginados(data, pagination.page, pagination.cantidadRegistrosxPagina, pagination, dataTabular);
    pagination.listaPaginacion = listaPagLoc;

        // Inicio de Nuevo 180120191455;
        let canti = 0;
        let elementActual: boolean;
        for (let index = 0; index < data.columns.length; index++) {
          elementActual = data.columns[index].visible;
          if (elementActual === true) {
            canti++;
          }
        }
        elementActual = null;
        pagination.cantColVis = canti;
        canti = null;
        // Fin de Nuevo 180120191455
        return pagination;
}
export function listaRangoPaginados(data: Tabular, noPage: number, cantidad: number, pagination: Pagination, dataTabular: any) {
  let arreNuevo: any [];
  let pivote = 0;
  pivote = cantidad * noPage;

  const posIni = pivote - cantidad;
  const posFin = pivote;
  const posIniLoc = ((noPage * cantidad ) - cantidad ) + 1;
  let posFinLoc = 0;
  pivote < data.data.length ? posFinLoc = pivote : posFinLoc = data.data.length;

  if(pagination){
    pagination.posIni = posIniLoc;
    pagination.posFin = posFinLoc;
  
    if (data.seleccionMultiple) {
      const intlise = pagination.listaSeleccionada.length;
      if (intlise <= 0) {
        dataTabular.forEach(element => {
        element['chequeado'] = false;
        });
      }

    }
  }
  arreNuevo = dataTabular.slice(posIni, posFin);
    return arreNuevo;
}


