import { Component, ViewEncapsulation, OnInit, Input, Output,
  EventEmitter, OnChanges, HostListener, ViewChild, ElementRef, Directive, ViewChildren, QueryList } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/pages/confirmDialog/confirmDialog.service';
import { AbmService } from 'src/app/_services/abmService';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FrontEndConstants } from 'src/app/constans/frontEndConstants';
import { Pagination } from 'src/app/_models/pagination';
import { Subscription } from 'rxjs';
import { AvisaSeteoService } from 'src/app/_services/avisaSeteoService';
import { DomSanitizer } from '@angular/platform-browser';
import { reject } from 'q';
import { Tabular } from 'src/app/_models/tabular';
import { HeaderDTO } from 'src/app/_models/headerDTO';
import { FormdataReportdef } from 'src/app/_models/formdata';
import { ReportdefService } from 'src/app/_services/reportdef.service';
import { DescriptionService } from 'src/app/_services/descriptionService';
import { NameGlobalService } from 'src/app/_services/nameGlobalService';
import { ParamAllRequestDTO } from 'src/app/_models/paramAllRequestDTO';
import { NameParamDTO } from 'src/app/_models/nameParamDTO';
import { crearParametro, ejecutarMetodo, seteoParamGlobal } from 'src/app/util/reportdefUtil';
import { AccionColumna } from 'src/app/_models/accionColumna';
import { ParamRequestDTO } from 'src/app/_models/paramRequestDTO';
import { PreMethodDTO } from 'src/app/_models/preMethodDTO';
import { ObtenerToStringRequestDTO } from 'src/app/_models/obtenerToStringEntidad';
import { DescripcionEntidadDTO } from 'src/app/_models/nameParamRequestDTO';
import { DownloadFileRequestDTO } from 'src/app/_models/downloadFileRequestdto';
import { TabularAbmRequestDTO } from 'src/app/_models/TabularAbmRequestDTO';
import { ToastService } from 'src/app/component/toast/toast.service';
import { GenericFinderService } from '../genericFinder/genericFinder.service';
import { saveAs } from 'file-saver';
import { FinderParamsDTO } from 'src/app/_models/finderParamsDTO';
import { inicializarFinder, listaRangoPaginados } from '../genericFinder/utilFinder';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DeviceDetectorService } from 'ngx-device-detector';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };
export const compare = (v1:number, v2:number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;



@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate($event)'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: string|null=null;
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<any>();

  rotate(col:any) {
    const c = col['currentTarget'].cellIndex;
    this.direction = rotate[this.direction];
    this.sort.emit( c+'-'+this.direction);

  }
}


@Component({
  selector: 'app-tabular',
  templateUrl: './tabular.component.html',
  styleUrls: ['./tabular.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
  
})
export class TabularComponent  implements OnInit, OnChanges {
  @Input('tabular') tabular: Tabular;
  @Input('header') header: HeaderDTO[];
  @Input('data') data: any;
  @Input('reporte') reporte: string;
  @Input('vista') vista: string;
  @Input('menu') menu: boolean;
  @Input('tabularABM') tabularABM: boolean;
  @Input('listRequest') listRequest: FormdataReportdef[];
  @Output()refresh = new EventEmitter<any>();
  @Output()backHistory = new EventEmitter<any>();
  @Output()acciones = new EventEmitter<any>();
  @Output()generarExcel = new EventEmitter<any>();
  @Output()editaABM = new EventEmitter<any>();
  @Input('pagination') pagination: Pagination;
  @HostListener('scroll', ['$event'])
  @ViewChild('dataContainer' )dataContainer: ElementRef;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>=Object.create(null);


  estaActivo = false;
  mostrarFiltro = false;
  muestroRombo  = false;
  sinpaginar: boolean;
  contadorFiltro  = 0;
  texto_filtro  = 'Mostrar Filtros';
  tituloReporte: string;
  idSeleccionado: any;
  filtros = false;
  mensajes = false;
  mensajeAmpliado = '';
  altoVentana = 0;
  anchoVentana = 0;
  es_firefox = false;
  private nameRef: Subscription = null;
  menovillan: any;
  descripcion = false;
 mensaje = '';
 mobile: boolean;
  constructor(private confirmationDialogService: ConfirmationDialogService,
    private abmservice: AbmService, private router: Router
    , private genericFinderService: GenericFinderService,
    private reportdefService: ReportdefService, private nameService: NameGlobalService,
    private descriptionService: DescriptionService, private messageService: MessageService, 
    private nameAvisoSeteo: AvisaSeteoService, private sanitizer: DomSanitizer,private modalService: NgbModal,
    private deviceService: DeviceDetectorService) {
      // this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/c9F5kMUfFKk");
      // this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.laurl);
        //this.mobile = true;
      this.mobile = this.deviceService.isMobile();
      console.log('el dispositivo detectado es ' + this.mobile?'MOBILE':'DSKTOP');
   
    }

   limpiaUrl(laurles) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(laurles);
   }
   abreelModal(url) {
    // tslint:disable-next-line:max-line-length
    window.open(url);
   }
   // tslint:disable-next-line:use-life-cycle-interface
 
  traemeSiPaginar() {
    this.tabular.paginar = true;
    // Llamar a esto con lo que Lucho va hacer , es decir al metodo que retorna si esta variable es TRUE o FALSE;
    this.sinpaginar = !this.tabular.paginar;
    if (this.sinpaginar === true) {
      return true;
    } else {
      return false;
    }
  }
  
  ngOnInit() {
    this.sinpaginar = this.traemeSiPaginar();
    console.log('me voy a suscribir al description ');
    this.nameRef = this.descriptionService.descriptionChanged$.subscribe(() => {
      console.log('entro al service description');
      if (this.dataContainer) {
        this.dataContainer.nativeElement.innerHTML = this.descriptionService.getDescription();
      }
    });
    const $event = null;
    if (this.sinpaginar === true) {
      this.muestraCantidadPorPaginayPagina(1, $event);
    }
  }

  ngOnChanges(): void {
    this.idSeleccionado = null;
    this.obtenerClase(this.reporte);
    this.contadorFiltro = this.data.length;
    console.log('entro al onChange');
    if ( this.sinpaginar === true ) {

        const $event = null;
        if (this.sinpaginar === true) {
          this.muestraCantidadPorPaginayPagina(1, $event);
        }
      }
 }

// tslint:disable-next-line:use-life-cycle-interface
ngOnDestroy(): void {
  this.nameRef.unsubscribe();
  console.log('destruido el tabular');
}
  
onSort( column) {
  console.log(column);
}
// ----------------------------Metodos NEGRILLO
  mostrarFiltros() {
    if (this.mostrarFiltro === true) {
      this.mostrarFiltro = false;
      this.texto_filtro = 'Mostrar Filtros';
    } else {
      this.mostrarFiltro = true;
      this.texto_filtro = 'Ocultar Filtros';
    }

  }

  // Sacar esto mañana cuando Lucho me Envie el Parametro sin pagina : boolean
  sinPaginar() {
    if (this.sinpaginar === true) {
      this.sinpaginar = false;
    } else {
      this.sinpaginar = true;
      const lcanti: number = this.contadorFiltro;
      this.muestraCantidadPorPaginayPaginaSinPaginacion(1 , lcanti);
    }
  }
  mostrandoTodo(indexador) {
    const elementos = document.getElementsByClassName('cl-oculta-th');
    for (let i = 0; i < elementos.length; i ++) {
     if ( elementos[i].classList.contains('cl-oculta-th') ) {
       if (i === indexador) {
         elementos[i].className = 'cl-oculta-th';
       } else {
        elementos[i].className = 'cl-muestra-th';
      }
     }
    }
  }

 
  loadPage(page: number) {
    this.pagination.previousPage = page;
    const listaPagLoc: any = listaRangoPaginados(this.tabular,page, this.pagination.cantidadRegistrosxPagina,null, this.data);
    this.pagination.listaPaginacion = listaPagLoc;
  }
  
  chequeaTodo(estaActivo) {
    estaActivo === false ? this.estaActivo = true : this.estaActivo = false;

    if (estaActivo === true) {
      this.data.forEach(element => {
        element['chequeado'] = false;
        this.chequeaFila(element, true);
      });
    } else if (estaActivo === false) {
      this.data.forEach(element => {
        element['chequeado'] = true;
        this.chequeaFila(element, true);
      });
    }
  }

  chequeaFila(event, todo: boolean) {
    let elvenChe = event.chequeado;
    if (!todo) {
      elvenChe = !elvenChe;
    }
    const filaActiva = event;
    // Comprobamos que el elemento exista en el arreglo de los seleccionados
    let indice = 0;
    indice = this.pagination.listaSeleccionada.indexOf(filaActiva);

    // Si es igual a -1 añado al arreglo en caso contrario no
    indice === -1 ? this.pagination.listaSeleccionada.push(filaActiva) : this.pagination.listaSeleccionada.splice(indice, 1);

    // Comprobamos que el elemento exista en el arreglo de listas los seleccionados
    let indiceFil = 0;
    indiceFil = this.data.indexOf(filaActiva);
    this.data[indiceFil]['chequeado'] = elvenChe;
    }

   
   
  buscarParamDestination(fila: any) {
    const objeto = {name: {} as ParamAllRequestDTO, all: []};
    const nameParamArray = [];

    const paramsParts = this.tabular.destination.trim().split(',');
    let j = 0;
    for (const p of paramsParts) {
      const paramsPosition = p.trim().split(':');
      let param = '';
      if ( j === 0 ) {
        param = paramsPosition[0].substring(7, paramsPosition[0].length);

      } else {
        param = paramsPosition[0];

      }
      const position = Number(paramsPosition[1]);
      let i = 0;
      let id = 0;
  // tslint:disable-next-line:foriclickLinkTabular
      // tslint:disable-next-line:forin
      for (const prop in fila) {
              if ( i === position) {
                  id = fila[prop];
                  break;
              }
        i++;
      }
      nameParamArray.push({'name': param.trim(), 'id': id});
      j++;
    }

      const  paramRequest = {} as ParamAllRequestDTO;
      paramRequest.list = [];

      for (const p of nameParamArray) {
        const  paramName = {} as NameParamDTO;
        paramName.name = p.name;
        paramRequest.list.push(paramName);
      }
      objeto.name = paramRequest;
      objeto.all = nameParamArray;
      return objeto;

  }
  private obtenerDescripcionTabular(method: string, fila) {
    const pos = method.indexOf('(');
    const m = method.substring(7, pos);
    // por ahora funciona con un parametro de tipò this que seria la entidad del tabular
    const param = method.substring(pos + 1, (method.length - 1 ));
    if (param.toUpperCase() === 'THIS') {
      console.log();
      let posTbular=0;
      if(!this.mobile){
        posTbular = this.tabular.pkColIndex;

      }else{
        posTbular = this.tabular.pkColIndex - this.tabular.accionesColumna.length;
 
      }
      console.log('posTbular');
      console.log(posTbular);
      console.log('fila');
      console.log(fila);
      let i = 0;
      let id = 0;
      if (!this.tabularABM && !posTbular) {
        posTbular = 0;
      }
      // tslint:disable-next-line:forin
      for (const prop in fila) {
        if ( i === posTbular) {
          id = fila[prop].value;
          break;
        }
        i++;
      }
    const listParametros = [];
      // tslint:disable-next-line:no-shadowed-variable
      const param = crearParametro('P_ID', FrontEndConstants.JAVA_LANG_LONG, id);
      listParametros.push(param);
      ejecutarMetodo(m, false, listParametros, this.reportdefService).then(
        (resp) => {
          if(!this.mobile){
            this.dataContainer.nativeElement.innerHTML = resp.valor;

          }else{
            this.mensaje = resp.valor;
 
          }
      }
     ).catch( error =>
       this.checkError(error)
       );

    } else {
        // no es un this y lo debo sacar de los parametros

        const paramRequest: ParamAllRequestDTO  = this.buscarParamDestination(fila).name;

        const nameParamArray  = this.buscarParamDestination(fila).all;
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const listDestination: FormdataReportdef[] = [];

        this.reportdefService.consultarAllParamByName(user, paramRequest).subscribe(
          result => {
            for (const f of result) {
              for (const p of nameParamArray) {
              if (p.name === f.name ) {
                f.valueNew = p.id;
                listDestination.push(f);
                break;
              }
            }
          }
          ejecutarMetodo(m, false, listDestination, this.reportdefService).then(
            (resp) => {
            this.dataContainer.nativeElement.innerHTML = resp.valor;
            this.mensaje = resp.valor;
          }
         ).catch( error =>
           this.checkError(error)
           );


          }, (err: HttpErrorResponse) => {
            this.checkError(err);
          });




    }
  }
  


  mostrarDetalle(fila) {
      this.descripcion = true;
      if (this.tabular.tabularDescriptivo) {
        console.log('this.tabular.tabularDescriptivo');
        if (this.tabular.campoDescriptivo.includes('METHOD')) {
          this.obtenerDescripcionTabular(this.tabular.campoDescriptivo, fila);
          if(!this.mobile){
            this.dataContainer.nativeElement.innerHTML = this.mensaje;
         }
        } else {
          const des = fila[this.tabular.campoDescriptivo];
          this.dataContainer.nativeElement.innerHTML = des;
          //this.mensaje = des;
        }
      }
    }

    obtenerCampoDescriptivo(fila,content2){
      this.mostrarDetalle(fila);
      this.modalService.open(content2, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        //this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  
    }
    executeColumnAction(col,fila){

      for(let col2 of this.tabular.columns){
        if(col2.title === col.columna){
          if(col['metadata'].mensajeAntesAccion){
            this.confirmationDialogService.confirm(true, 'Atencion!',
            col['metadata'].mensajeAntesAccion)
            .then((confirmed) => {
            if (confirmed) {
              this.clickLinkTabular(col2,fila);
              return;
            }
          
            }).catch(() => console.log('salio)'));
          
          } else {
            this.clickLinkTabular(col2,fila);
          }
          
          }
        }
      }
    

  clickLinkTabular( col, fila) {


    if (col.linkDina) {
      alert('es una columna link dinamica');
      return;
    }

    // tslint:disable-next-line:prefer-const
    let nameParamArray = [];
    if (this.tabular.tabularDescriptivo) {
      console.log('this.tabular.tabularDescriptivo');
      if (this.tabular.campoDescriptivo.includes('METHOD')) {
        this.obtenerDescripcionTabular(this.tabular.campoDescriptivo, fila);

      } else {
        const des = fila[this.tabular.campoDescriptivo];
        this.dataContainer.nativeElement.innerHTML = des;
      }
    }
     if (!col['columnaAdicional'] && !col['link']) {
       return;
     }

    const listDestination: FormdataReportdef[] = [];

    if (this.tabular.destination !== null && this.tabular.destination !== undefined) {
      // tengo que buscar el parametro
      const paramRequest: ParamAllRequestDTO  = this.buscarParamDestination(fila).name;
        console.log('paramRequest');
        console.log(paramRequest);
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.reportdefService.consultarAllParamByName(user, paramRequest).subscribe(
          result => {
             nameParamArray  = this.buscarParamDestination(fila).all;

            for (const f of result) {
              for (const p of nameParamArray) {
              if (p.name === f.name ) {
                f.valueNew = p.id;
                listDestination.push(f);
                break;
              }
            }
          }
          this.generarDatosClickTabularColumna(col, listDestination);
          return;
          }, (err: HttpErrorResponse) => {
            this.checkError(err);
          }
         );
    }
    for (const columna of this.tabular.accionesColumna) {
      if (columna.columna === col['title']) {
          if (col['columnaAdicional']||columna.columnaAccion) {
              // tengo que pasar el id de la columna!
              const pos = this.tabular.pkColIndex ||0;
              let i = 0;
              let id = 0;
              // tslint:disable-next-line:forin
              for (const prop in fila) {
                if ( i === pos) {
                  id = fila[prop];
                  break;
                }
                i++;
              }

              this.llenarParametrosClickLinkTabular(columna, id).then(
                (resp) =>
                this.acciones.emit(columna.metadata)
             ).catch( error =>
               this.checkError(error)
               );
          }
        }

    }

  }


  llenarParametrosClickLinkTabular(columna: AccionColumna, id: number): Promise<boolean> {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise<boolean>( (resolve, reject) => {
    let i = 0;
    const keys = Array.from(Object.keys( columna.metadata.paramsPasar));
    const paramClick = [] as FormdataReportdef[];
    for (const clave of Object.keys(columna.metadata.paramsPasar)) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      const  paramRequest = {} as ParamRequestDTO;
      paramRequest.nombre = clave.trim();
      this.reportdefService.consultarParamByName(user, paramRequest).subscribe(
        result => {
          i++;
          if (this.tabularABM && (columna.metadata.paramSolapa === clave || keys.length === 1)) {
            result['valueNew'] = id;
          } else {
            if(this.mobile){
              result['valueNew'] = id;
            }
            result.actualizar = true;
          }
          console.log('result');
          console.log(result);
          if (keys.length === 1 ) {
            columna.metadata.objeto = result;
          } else {
            paramClick.push(result);
          }
          columna.metadata.aditionalColumn = true;
          columna.metadata.clickFilaTabular = false;
          if(columna.metadata.tipoReportdefParent === undefined || columna.metadata.tipoReportdefParent === null ){
            columna.metadata.tipoReportdefParent = FrontEndConstants.TABULAR_ABM.toUpperCase();
          }
          if (columna.metadata.tipoMetodo === FrontEndConstants.ACCION_MENSAJE) {
            const listParam = [];
            listParam.push(result);
            ejecutarMetodo(columna.metadata.methodName, false, listParam, this.reportdefService)
            .then((resp) => {
              console.log(resp);
              this.mensajes = true;
                this.mensajeAmpliado = resp.valor;
                resolve(true);
                return;
              }
              ).catch( error =>
                  reject(error)

              );
          }
          console.log(keys.length);
          if (i === keys.length) {
            columna.metadata.objetoEvento = paramClick;
            console.log('termino la promesa');
            resolve(true);
          }
              }, (err: HttpErrorResponse) => {
                reject(err);
        }
       );
      }
      // solo 1 parametro
  });
}
ejecutarPremethod(premethod: PreMethodDTO, listDestination: FormdataReportdef[]) {
  return new Promise<void>(resolve => {
    const list = [];
    for (const p of premethod.params) {
      for (const p1 of listDestination) {
        if (p1.name === p) {
            list.push(p1);
        }
      }
    }
    ejecutarMetodo(premethod.metodo, false, list, this.reportdefService).then(
      (resp) =>
      resolve()
   ).catch( error =>
      reject()
     );
  });
}
async generarDatosClickTabularColumna(col: any, listDestination: FormdataReportdef[]) {


    const listDestino: FormdataReportdef[] = [];
    for (const columna of this.tabular.accionesColumna) {
      if (columna.columna === col['title']) {
        columna.metadata.objetoEvento = listDestination;
        columna.metadata.clickFilaTabular = true;
        columna.metadata.aditionalColumn = false;

        if (columna.metadata.tipoMetodo === FrontEndConstants.SET_PARAM_GLOBAL ) {
          // tengo que ver cual es el parametro que tengo que actualizar
          for (const clave of Object.keys(columna.metadata.paramsPasar)) {
          for (const f of listDestination ) {
              if (clave.toString().trim() === f.name.trim()) {
                  listDestino.push(f);
                  break;
                }
            }
          }
          if (columna.metadata.preMethodDTO !== null && columna.metadata.preMethodDTO.metodo !== null ) {
            await this.ejecutarPremethod(columna.metadata.preMethodDTO, listDestination);
          }


      // es un seteo de parametros tengo que hacer un par de cosillas
          const user = JSON.parse(localStorage.getItem('currentUser'));
          const  obtenerToStringRequest = {} as ObtenerToStringRequestDTO;
          obtenerToStringRequest.listId = [];
          for (const p of listDestino) {
            if (!p.entity) {
              continue;
            }
            const  descEntidad = {} as DescripcionEntidadDTO;
            descEntidad.name = p.type;
            descEntidad.id = p.valueNew;
            obtenerToStringRequest.listId.push(descEntidad);
          }
          console.log('obtenerToStringRequest');
          console.log(obtenerToStringRequest);

          this.reportdefService.consultarToStringEntidad(user, obtenerToStringRequest).subscribe(
            result => {
              console.log(result);
              for (const p of listDestino) {
                for (const p1 of result.listToString) {
                    if (p.type === p1.name) {
                        p.busquedaGenericaDTO.mostrarToStringLupa = p1.value;
                        break;
                    }
                }
              }
              console.log('columna.metadata');
              console.log(columna.metadata);
              seteoParamGlobal(columna.metadata, this.reportdefService, this.nameService, null, true, listDestino).then(
                (resp) =>
                 this.exitoSetParamGlobal()
              ).catch( error =>
                this.checkError(error)
                );
                  }, (err: HttpErrorResponse) => {
              this.checkError(err);
            }
           );
          }
        } else {
          continue;

        }
        columna.metadata.objetoEvento = listDestination;
        this.acciones.emit(columna.metadata);
        }

  }
  exitoSetParamGlobal() {
    this.messageService.add({severity:'success', summary:'Exito', detail:'parametro global seteado exitosamente'});
  }

// Metodo para mostrar la cantidad de filas por página  en el Mostrar del Select desplegable
muestraCantidadPorPaginayPagina(noPage, $event) {
  let noRegistrosLoc = 0; // $event.target.value;
    if ($event == null) {
      noRegistrosLoc = this.contadorFiltro;
    } else {
      noRegistrosLoc = $event.target.value;
    }
  const listaPagLoc: any = listaRangoPaginados(this.tabular,noPage, noRegistrosLoc,null, this.data);
  this.pagination.listaPaginacion = listaPagLoc;
  this.pagination.cantidadRegistrosxPagina =  noRegistrosLoc;
  this.pagination.page =  noPage;
}

// Metodo para mostrar la cantidad de filas por página  Cuando no tiene paginación
muestraCantidadPorPaginayPaginaSinPaginacion(noPage, pcantidad) {
    const noRegistrosLoc: number = pcantidad;
    const listaPagLoc: any = listaRangoPaginados(this.tabular,noPage, noRegistrosLoc,null, this.data);

    this.pagination.listaPaginacion = listaPagLoc;
    this.pagination.cantidadRegistrosxPagina =  noRegistrosLoc;
    this.pagination.page =  noPage;
}

downloadFile(col: any, fila: any) {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  const downloadFileRequestDTO = {} as DownloadFileRequestDTO;
  downloadFileRequestDTO.reporte = this.reporte;
  downloadFileRequestDTO.vista = this.tabular.vista;
  downloadFileRequestDTO.headerlinkColumn = col.title;
  const pos = this.tabular.pkColIndex;
  let i = 0;
  let id = 0;
// tslint:disable-next-line:forin
  for (const prop in fila) {
    if ( i === pos) {
      id = fila[prop];
      break;
    }
    i++;
  }
  downloadFileRequestDTO.idReporte = id;
  downloadFileRequestDTO.tabularABM = this.tabularABM;
  this.reportdefService.downloadFile(user, downloadFileRequestDTO).subscribe(
    result => {
      let name = '';
      /*
      if (!result.fmt) {
        window.open('/SFS2FwWsServerWEB/FwWsFileServlet?P_FILE_NAME=' + result.nameArch + '&P_FILE_CTYPE=jpg');
        return;
      } else {
        name = downloadFileRequestDTO.reporte + '--ID-- ' + downloadFileRequestDTO.idReporte + '.fmt';
      }
      */

//      const file = new Blob([result.bytes]);
  
const byteString = window.atob(result.data64);
   const arrayBuffer = new ArrayBuffer(byteString.length);
   const int8Array = new Uint8Array(arrayBuffer);
   for (let i = 0; i < byteString.length; i++) {
     int8Array[i] = byteString.charCodeAt(i);
   }
   const blob = new Blob([int8Array]);    

  saveAs(blob, result.nameArch);
  // result.nameArch, result.fmt);

}, (err: HttpErrorResponse) => {
     this.checkError(err);
});
}

b64_to_utf8( str ) {
  return atob( str );
}

 bin2String(array) {
  let result = '';
  for (let i = 0; i < array.length; i++) {
    result += String.fromCharCode(parseInt(array[i], 16));
  }
  return result;
}

string2Bin(str) {
  const result = [];
  for (let i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i).toString(16));
  }
  return result;
}

private  convertDataURItoFile(data: string, fileName: string, fmt: boolean) {
  const datoDeco = this.b64_to_utf8(data);
  const binario: any[] = this.string2Bin(datoDeco);
  const vitstr = this.bin2String(binario);

  let blob = null;
  if (fmt) {
      blob = new Blob([vitstr], {type : 'text/html;charset=IBM850'});
  }else{
    blob = new Blob([vitstr],{type : 'image/png'});

  }
  return blob;
}

// ----------------------------FIN Metodos NEGRILLO

  tamVentana() {
    let tam = [0, 0];
    if (typeof window.innerWidth !== 'undefined') {
      tam = [window.innerWidth, window.innerHeight];
    } else if (typeof document.documentElement !== 'undefined'
        && typeof document.documentElement.clientWidth !==
        'undefined' && document.documentElement.clientWidth !== 0) {
          tam = [
          document.documentElement.clientWidth,
          document.documentElement.clientHeight
      ];
    } else   {
      tam = [
          document.getElementsByTagName('body')[0].clientWidth,
          document.getElementsByTagName('body')[0].clientHeight
      ];
    }
    return tam;
  }
  onEdit(event) {
    const pos = this.tabular.pkColIndex;
    let i = 0;
    let id = 0;
// tslint:disable-next-line:forin
    for (const prop in event) {
      if ( i === pos) {
        id = event[prop];
        break;
      }
      i++;
    }
    let idOwner = null;
  i = 0;
  i = 0;
  if (this.tabular.onlyOwner ) {
    const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
    for (const p of  formdataGlobales) {
          if (p.name === this.tabular.onlyOwnerParamGlobal && p.value !== null) {
        idOwner = p.value;
        break;
      }
    }
  }
// this.tabular.onlyOwner, this.tabular.onlyOwnerDay, this.tabular.onlyOwnerField, this.tabular.onlOwnerDayField
    const data = {alta: false, id: id, reporte: this.reporte, vista: this.tabular.vista,
      onlyOwner: this.tabular.onlyOwner, idOwner: idOwner, onlyOwnerDay: this.tabular.onlyOwnerDay,
      onlyOwnerField: this.tabular.onlyOwnerField, onlyOwnerDayField: this.tabular.onlOwnerDayField };
    this.editaABM.emit(data);
  }

  private obtenerClase(reporte: string) {
    const labelArray = reporte.split('.');
    let clase = '';
    // tslint:disable-next-line:forin
    for (const j in labelArray) {
      clase = labelArray[j];
    }

    if (this.tabularABM) {
      if (this.tabular.etiqueta) {
        this.tituloReporte = this.tabular.etiqueta;

      } else {
        this.tituloReporte = 'ABM de ' + clase;

      }
    } else {
      if (this.tabular.etiqueta) {
        this.tituloReporte = this.tabular.etiqueta;

      } else {
        this.tituloReporte = 'Tabular ' + clase;

      }
    }
  }

  onDelete(event) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const pos = this.tabular.pkColIndex;
    let i = 0;
    let id = 0;
    // tslint:disable-next-line:forin
    for (const prop in event) {
    if ( i === pos) {
      id = event[prop];
      break;
    }
    i++;
    }
    let idOwner = null;
    i = 0;
    if (this.tabular.onlyOwner ) {
      const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
      for (const p of  formdataGlobales) {
            if (p.name === this.tabular.onlyOwnerParamGlobal && p.value !== null) {
          idOwner = p.value;
          break;
        }
      }
    }
    this.confirmationDialogService.confirm(true, 'Esta seguro de eliminar este registro?',
    'Eliminacion Registro')
.then((confirmed) => {
   if (confirmed) {
     this.abmservice.eliminarEntidad(user, this.reporte, id, idOwner,
      this.tabular.onlyOwner, this.tabular.onlyOwnerDay, this.tabular.onlyOwnerField, this.tabular.onlOwnerDayField).subscribe(
       result => {
        this.messageService.add({severity:'success', summary:'Exito', detail:'registro eliminado exitosamente'});
        this.refresh.emit('refresh');

       }, (err: HttpErrorResponse) => {

        this.checkError(err);
  }

     );
   }

}).catch(() => console.log('salio)'));

  }

  exportExcel(event) {
    this.generarExcel.emit(event);
  }
  refrescar(event) {
    this.refresh.emit('refresh');
  }

  exportGrafico($event) {
    // this.graficosComponent.open($event);
  }

  exportPDF(event) {
    let unSoloRegistro = false;
    // exporta a pdf el this.abmservice;
    const user = JSON.parse(localStorage.getItem('currentUser'));
    let hArchivo = '';
    let filename = '';
    // this.refresh.emit('pdf');
    const finder = {} as FinderParamsDTO;
    inicializarFinder(finder);
    finder.methodName = 'buscarPdfUsuario';
    finder.typeMethodFinder = true;

    const  paramUser = {} as FormdataReportdef;
    paramUser.name = 'P_STRINGUSUARIO';
    paramUser.value = user.username;
    paramUser.valueNew = user.username;
    paramUser.entity = false;
    paramUser.text = true;
    paramUser.busquedaGenerica = false;
    paramUser.type = FrontEndConstants.JAVA_LANG_STRING;

    const  paramReporte = {} as FormdataReportdef;
    paramReporte.name = 'P_REPORTE';
    paramReporte.value = this.reporte;
    paramReporte.valueNew = this.reporte;
    paramReporte.entity = false;
    paramReporte.text = true;
    paramReporte.busquedaGenerica = false;
    paramReporte.type = FrontEndConstants.JAVA_LANG_STRING;

    finder.finderGenericDTO.parametrosFinderMetodo.push(paramUser);
     finder.finderGenericDTO.parametrosFinderMetodo.push(paramReporte);

     this.abmservice.consultarAbmGeneric(user, finder).subscribe(
      result => {
        if ((result['data'] && result['data'].length === 0 ) || result['headerArchivo'] === undefined  ) {
          this.messageService.add({severity:'error', summary: 'Definir FMT', detail: 'no hay FMT definidos para este ABM'});

           return;
       } else if (result['data'] && result['data'].length === 1) {
        unSoloRegistro = true;
      // si hay un solo registro no hay que llamar a la busqueda generica
      for (let j = 0; j < result['columns'].length; j++) {
        if (result['columns'][j].name === result['headerArchivo']) {
          hArchivo = result['data'][0][j].value;
          break;
        }
        filename = result['data'][0][FrontEndConstants.UBICACION_COLUMNA_NOMBRE_ARCHIVO_FMT].value;
      }

      const pdfRequest = {} as TabularAbmRequestDTO;
      this.inicializarTabularRequestPDF(pdfRequest, hArchivo, filename, this.vista);
      this.abmservice.generarPDFABM(user, pdfRequest).subscribe(
        pdf => {
          window.open('/SFS2FwWsServerWEB/FwWsFileServlet?P_FILE_NAME=' + pdf['filename'] + '&P_FILE_CTYPE=pdf');
        }, (err: HttpErrorResponse) => {

          this.checkError(err);

        });

       }
       if (!unSoloRegistro) {

           this.genericFinderService.confirm('Seleccionar fuente de Impresion ',
            result, null, null, null, null, false, '',result['columns'])
       .then((fila) => {

        let i = 0;
        // tslint:disable-next-line:forin
        for (const prop in fila ) {
          if ( i === FrontEndConstants.UBICACION_COLUMNA_NOMBRE_ARCHIVO_FMT) {
            filename = fila[prop];
          }
          if (prop === result['headerArchivo']) {
            hArchivo = fila[prop];
          }
          i++;
        }
        const pdfRequest = {} as TabularAbmRequestDTO;
        this.inicializarTabularRequestPDF(pdfRequest, hArchivo, filename, this.vista);
        this.abmservice.generarPDFABM(user, pdfRequest).subscribe(
          pdf => {
            window.open('/SFS2FwWsServerWEB/FwWsFileServlet?P_FILE_NAME=' + pdf['filename'] + '&P_FILE_CTYPE=pdf');
          }, (err: HttpErrorResponse) => {

            this.checkError(err);

          });

       }).catch(() => console.log('salio)'));
      }

      }, (err: HttpErrorResponse) => {

       this.checkError(err);
      });

  }

  private inicializarTabularRequestPDF(requestPDF: TabularAbmRequestDTO, reporte: string, filename: string, vista: string) {
    const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));

    requestPDF.dataSource = '';
    requestPDF.username = '';
    requestPDF.webServicesAddress = '';
    requestPDF.modelPackage = '';
    requestPDF.reportdef = reporte;
    requestPDF.filename =  filename;
    requestPDF.vista = vista;
    requestPDF.desde = 0;
    requestPDF.hasta =  100;
    requestPDF.valueFinder =  null;
    requestPDF.campoFinder = null;
    requestPDF.list =  [];
    requestPDF.global =  formdataGlobales;
    requestPDF.filterNameParam = null;
    requestPDF.filterType = null;
  }

  private checkError(error: any ) {
    console.log('mando el error derecho y fue');
    console.log(error);
    this.messageService.add({severity:'error', summary: 'Error', detail: error.mensaje});
  }
  backHistorico() {
    this.backHistory.emit(event);
  }
  verFiltros(content1: string) {
    this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
			//this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			//this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});

  }
  nuevoAbm() {
    const data = {alta: true, id: this.idSeleccionado, reporte: this.reporte, vista: this.tabular.vista};
    // debo ver si hay algun agregarsi
    console.log('this.tabular.agregarSi');
    console.log(this.tabular.agregarSi);
    if (this.tabular.agregarSi) {
        // por ahora solo con parametros globales
        // ejemplo verificarAfiliado(P_IDAFILIADO)
        const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
        const pos = this.tabular.agregarSi.indexOf('(');
        const methodName =  this.tabular.agregarSi.substring(0, pos);
        const param = this.tabular.agregarSi.substring((pos + 1), (this.tabular.agregarSi.length - 1));
        const parametros = param.split(',');
        console.log(methodName);
        console.log(parametros);
        const listAux = [];
        for (const p of parametros) {
          for (const g of formdataGlobales) {
            if (p.trim() === g.name.trim()) {
                listAux.push(g);
                break;
            }
          }

        }
        ejecutarMetodo(methodName, false, listAux, this.reportdefService).then(
          (resp) =>
          this.editaABM.emit(data)
       ).catch( error =>
         this.checkError(error)
         );
    } else {
      this.editaABM.emit(data);

    }
  }

  onRowSelect(event) {
   // determino a que columna le hago click esto sirve para cuando hgacemos nuevo muestre los datos de la fila
   console.log(event);
   const pos = this.tabular.pkColIndex;
      let i = 0;
     // tslint:disable-next-line:forin
     for (const prop in event.data) {
      if ( i === pos) {
        this.idSeleccionado = event.data[prop];
        break;
      }
      i++;
    }
  }

  processActions(event: FormdataReportdef) {
    if (event.buttomDTO.metodoDTO.seleccionMultiple) {
      // si la accion es una seleccion multiple
     // debo traer los id de la seleccion
     if (this.pagination.listaSeleccionada.length === 0) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'debe seleccionar al menos un registro de la grilla'});

      return;
     } else {
        // debo poner la lista en algun lugar de la lista
        const ps = [];
        const pos = this.tabular.pkColIndex ? this.tabular.pkColIndex : 0;
        let i = 0;
       // tslint:disable-next-line:forin
       for (const prop of this.pagination.listaSeleccionada) {
        i = 0;
           // tslint:disable-next-line:forin
           for (const p in prop) {
                if ( i === pos) {
                  ps.push(prop[p]);
                  break;
                } else {
                  i++;
                }
            }
    }
        event.buttomDTO.metodoDTO.objeto = ps;
     }
    }
    this.acciones.emit(event.buttomDTO.metodoDTO);
  }
  getCantidad() {
    let can = this.pagination.cantColVis;
    const ancho = 100 / can;
    can = null;
    return ancho + '%';
  }
}
