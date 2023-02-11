import { Component, ViewEncapsulation, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import {  HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { reject } from 'q';
import { interval } from 'rxjs';
import { TipoReporte } from '../_models/tipoReporte';
import { Tabular } from '../_models/tabular';
import { HeaderDTO } from '../_models/headerDTO';
import { FinderDTO } from '../_models/finderDTO';
import { Historico } from '../_models/historico';
import { LinkedList } from 'linked-list-typescript';
import { Pagination } from '../_models/pagination';
import { FormReportdef } from '../_models/form';
import { ReportdefData } from '../_models/reportdefData';
import { AbmParams } from '../_models/abmParams';
import { FormdataReportdef } from '../_models/formdata';
import { ReportdefService } from '../_services/reportdef.service';
import { ParamDataHijoService } from '../_services/dataHijoService';
import { DescriptionService } from '../_services/descriptionService';
import { ConfirmationDialogService } from '../pages/confirmDialog/confirmDialog.service';
import { ExitService } from '../_services/exitService';
import { NameGlobalService } from '../_services/nameGlobalService';
import { ToastService } from './toast/toast.service';
import { MetodoDTO } from '../_models/metodoDTO';
import { FinderRequestDTO } from '../_models/finderRequestDTO';
import { TabularAbmRequestDTO } from '../_models/TabularAbmRequestDTO';
import { User } from '../_models';
import { TabularRequestDTO } from '../_models/TabularRequestDTO';
import { buscarParametro, buscarParametrosEnHistoricos, consultarParametroByClase, crearParametro, inicializarHistorico, prepararParametrosApasar } from '../util/reportdefUtil';
import { FrontEndConstants } from '../constans/frontEndConstants';
import { ObtenerToStringRequestDTO } from '../_models/obtenerToStringEntidad';
import { DescripcionEntidadDTO } from '../_models/nameParamRequestDTO';
import { ObtenerPropiedadDTO } from '../_models/ObtenerPropiedadDTO';
import { ParamRequestDTO } from '../_models/paramRequestDTO';
import { ParametrosExecuteMethodRequestDTO } from '../_models/parametrosExecuteMethodRequestDTO';
import { PersistirEntidadResponse } from '../_models/persistirEntidadResponse';
import { PersistirEntidadRequest } from '../_models/persistirEntidadRequest';
import { ReportMethodResponseDTO } from '../_models/reportMethodResponseDTO';
import { ContainerAbmNuevoDTO } from '../_models/AbmEditResponse';
import { AltaEdicionABMDTO } from '../_models/edicionABM';
import { generarDatosPaginacion, getData } from '../pages/genericFinder/utilFinder';
import { MessageService } from 'primeng/api';
// import { SocketClientService } from '../../../_services/SocketClientService';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeviceDetectorService } from 'ngx-device-detector';

declare function downloadFile(mime: string, url: string): any;

@Component({
  selector: 'app-reportdef',
  templateUrl: './reportdef.component.html',
  providers: [  BrowserAnimationsModule,MessageService ],
  encapsulation: ViewEncapsulation.None,
  styleUrls:['./reportdef.components.scss'],

})

export class ReportdefComponent  implements OnInit {
  private stompClient = null;
   tipoReporte: TipoReporte;
  // datos tabla
  tabular: Tabular;
  dataHijos: Tabular;
  tieneHijoAlta: boolean;
  dataTabular: any;
   settings: any;
   header: HeaderDTO[];
   vista: string;
   cargadoABM: boolean;
   datosBusquedaTabular: any;
   campos: FinderDTO[];
   stack = new LinkedList<Historico>();
   pagination: Pagination;
   android: boolean;
  // fin datos tabla
  // datos form
  formRepordef: FormReportdef;
  dataReportdefAux: ReportdefData = {
    form: false,
    tabular: false,
    tabularAbm: false,
    formAbmNew: false,
    formAbmEdit: false,
    formHijo: false,
    menu: false,
    cargando: false,
    mostrarInfoArea: false,
    responsive: false
  };
  abmParams: AbmParams;
  dataReportdef: ReportdefData;
  listRequest: FormdataReportdef[];
  public reporte: string;
  public labelReporte: string;
  tituloReporte: string;
  idEntidad: number;
  notifi: any  = {
    notificationTitle: '',
    deploying: false,
    notification: '',
    notificationFooter: '',
    show: false,
    notificaciones: []
  };

  busquedaAlmacenada: any = {
      busqueda: '',
      campo: null
  };
  showABMFilter: boolean;
  firstHeartbeat = true;

  constructor(
    private router: Router,private messageService: MessageService ,
    private rutaActiva: ActivatedRoute, private reportdefService: ReportdefService,
    private paramService: ParamDataHijoService, private descriptionService: DescriptionService, private nameService: NameGlobalService,
    private confirmationDialogService: ConfirmationDialogService, private changeDetector: ChangeDetectorRef,
    private exitService: ExitService,private spinnerSfs: NgxSpinnerService,private deviceService: DeviceDetectorService
  ) {

   }

  /*
  connect() {
    console.log('conectandose al socket server');
    const socket = new SockJS('http://localhost:8081/sfsSockets');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    const user = <User>JSON.parse(localStorage.getItem('currentUser'));
    const u = JSON.stringify(user);
    this.stompClient.connect({'login': u}, function (frame) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);
      _this.stompClient.subscribe('/topic/deploy', function (deploy) {
        this.notifi.deploying = true;
        this.notifi.show = true;
        this.notifi.notificationTitle = 'Nueva version disponible';
        this.notifi.notificationFooter = 'Atencion';
        this.notifi.notification = 'Por favor, salga y vuelva a entrar para actualizar!.Gracias!';


      });

    });
  }
 */
  disconnect() {
    // this.socketClientService.disconnect();
  }



   // tslint:disable-next-line:use-life-cycle-interface
   ngOnDestroy(): void {
  }

  angularFunctionCalled() {
    alert('Angular 2+ function is called');
  }

  ngOnInit() {

    //this.spinner = false;
     this.exitService.exitChanged$.subscribe(() => {
      this.disconnect();
    });
    /*
    this.socketClientService.onMessage('/topic/deploy').subscribe(() => {
      // this.disconnect();
      this.notifi.deploying = true;
      this.notifi.show = true;
      this.notifi.notificationTitle = 'Nueva version disponible';
      this.notifi.notificationFooter = 'Atencion';
      this.notifi.notification = 'Por favor, salga y vuelva a entrar para actualizar!.Gracias!';

  });
  this.socketClientService.onMessage('/topic/consultas').subscribe((chatpojos: any) => {
    // this.disconnect();
    console.log('NOTIFICA');
    console.log(chatpojos);
    if (chatpojos.length > 0) {
      this.notifi.show = true;
      this.notifi.notificaciones = chatpojos;
    }

});
*/
this.android = false;
  if (this.deviceService.isMobile) {
      this.android = true;
  }
    this.notifi.deploying = false;


    this.rutaActiva.params.subscribe((params: Params) => {
      const report = this.rutaActiva.snapshot.params.reporte; // (+) converts string 'id' to a number
      this.reporte = report;
      if (this.reporte !== 'nothing') {
        this.determinarTipoReportdef(report);
      }


      this.labelReporte = report;
      this.idEntidad =  0;
      // this.loadSpinner.hide();
       this.descriptionService.setDescription('');

       // this.connect();
       // ********** socket and Idle service */

     /*
       this.socketService.checkStatus().then( () => {
        console.log('actualizando usuario');
      });
      /*
       this.setIdle();

      this.socketService.listen('deploying')
      .subscribe( (data: any) => {
          console.log('DEPLOYINGGGGGGGGGGGG');
          console.log(data);
          this.notifi.deploying = true;
          this.notifi.show = true;
          this.notifi.notificationTitle = 'Nueva version disponible';
          this.notifi.notificationFooter = 'Atencion';
          this.notifi.notification = 'Por favor, salga y vuelva a entrar para actualizar!.Gracias!';
      });
      this.socketService.listen('usuarios-activos')
      .subscribe( (data: any) => {
          console.log('USUARIOS ACTIVOS');
          console.log(data);

      });

      this.socketService.listen('notifica')
      .subscribe( (data: any) => {
          console.log('NOTIFICA');
          console.log(data);
          if (data.length > 0) {
            this.notifi.show = true;
            this.notifi.notificaciones = data;
          }

        });
        this.socketService.listen('chat')
        .subscribe( (data: any) => {
            console.log('chat');
            console.log(data);
            // vemos el tema del chat
          });
          // ******* fin socket and idle  */
    (<any>window).geoUpdate = (res) => {
          const a = res;
        //  alert('la funcion esta andando');
    };

  });
    this.mostrarInfo();
  }

     // tslint:disable-next-line:member-ordering
     /*
     private setIdle() {
      this.userIdle.startWatching();

      // Start watching when user idle is starting.
      this.userIdle.onTimerStart().subscribe(count => {
        console.log(count);
        console.log('onTimerStart()');
      });

      // Start watch when time is up.
      this.userIdle.onTimeout().subscribe(() => {
      // Deberia poder informar inactividad usuario
      console.log('Time is up!');
    });

     }
     */
     private mostrarInfo() {
      const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));

      for (const p of formdataGlobales ) {
          if (p.name === 'P_INFO' && p.value === '1' ) {
            this.dataReportdefAux.mostrarInfoArea = true;
            break;
          }

      }
     }

  private determinarTipoReportdef(reportdef: string) {
     // console.log('entro al determinar  tipo de reportdef: ' + reportdef);
    //  this.toastrService.success('toast ok');
    const metadata = {} as MetodoDTO;
    metadata.methodName = reportdef;

     this.reportdefService.determinarTipoReportdef(reportdef).subscribe
     ((m: TipoReporte) => {
         this.tipoReporte = m;
         // console.log('tipoReporte');
         // console.log(m);
         // console.log('tipo reporte ' + this.tipoReporte.tipo);
         if (this.tipoReporte.tipo === 'TABULAR' ) {
          const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
          // si es un tabular que viene directamente desde un menu, puede filtrar por los globales
             this.generarTabular(true, metadata, formdataGlobales, false);
       } else if (this.tipoReporte.tipo === 'FORM' ) {
        this.generarForm(true, metadata, false, null);
       } else if (this.tipoReporte.tipo === 'ABM') {
         const finder = {} as FinderRequestDTO;
         // console.log('entro aca');

        this.generarTabularAbm(true, metadata, finder, false, false, false);
       }
         },
      (err: HttpErrorResponse) => {

        this.checkError(err);

  }
);



  }

  private generateTabularAbmRequestDTO(data: TabularAbmRequestDTO,  reportdef: string,
    desde: number, hasta: number, vista: string, campoFinder: string, datoFinder: any , filterNameParam: string, filterType: string ) {
     const user = <User>JSON.parse(localStorage.getItem('currentUser'));
     const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
     // console.log('idUsuarioUra');
     // console.log(user.idUsuarioUra);
     data.desde = desde;
   data.hasta = hasta;
   data.username = user.username;
   data.dataSource = user.datasource;
   data.modelPackage = user.packageModel;
   data.idUsuarioUra = user.idUsuarioUra;
   data.webServicesAddress = user.webservice;
   data.reportdef = reportdef;
   data.vista = vista;
   data.global = formdataGlobales;
   data.campoFinder = campoFinder;
   data.valueFinder = datoFinder;
   data.filterNameParam = filterNameParam;
   data.filterType = filterType;
   data.list = [];
 }
 private generateTabularRequestDTO(data: TabularRequestDTO,  reportdef: string,
  desde: number, hasta: number, vista: string, listRequest: FormdataReportdef[]) {
   const user = <User>JSON.parse(localStorage.getItem('currentUser'));
   const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
   data.desde = desde;
 data.hasta = hasta;
 data.username = user.username;
 data.dataSource = user.datasource;
 data.modelPackage = user.packageModel;
 data.idUsuarioUra = user.idUsuarioUra;
 data.webServicesAddress = user.webservice;
 data.reportdef = reportdef;
 data.vista = vista;
 data.global = formdataGlobales;
 data.list = listRequest;
}
private async generarTabularAbm(menu: boolean, metadata: MetodoDTO, finder: FinderRequestDTO,
  busquedaFinder: boolean, backHistorico: boolean, excel: boolean) {
   
    this.spinnerSfs.show('reportdef');
    const data = {} as TabularAbmRequestDTO;
    data.mobile =  this.deviceService.isMobile();
    // veo si tiene que mandar algun parametro global
    // tslint:disable-next-line:prefer-const

    this.generateTabularAbmRequestDTO(data, metadata.methodName, 0, 200, null,
      finder !== null ? finder.atribute : null, finder !== null ? finder.value : null,
      finder !== null ? finder.label : null, finder !== null ? finder.type : null );
    if (metadata.objeto ) {
      // tiene que filtrar por este valor
      if (metadata.objeto['name'] ) {
        data.list.push(metadata.objeto);
      } else {
        const dataFilter = {} as FormdataReportdef;
        dataFilter.name = metadata.objeto['nombre'];
        dataFilter.valueNew = metadata.objeto['valor'];
        dataFilter.value = metadata.objeto['valor'];
        dataFilter.type = metadata.objeto['typo'];
        dataFilter.entity = true;
        dataFilter.busquedaGenerica = true;
        data.list.push(dataFilter);
        }
    } else {
      const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
      const parametros = [];
      if (metadata.paramsPasar) {

        for (const clave of Object.keys(metadata.paramsPasar)) {
          // busco si tiene un parametro en el historico
          const count = this.stack.length;
          parametros.push(clave.toString());
         // console.log('parametros');
          // console.log(parametros);
          const listParam: FormdataReportdef[] = buscarParametrosEnHistoricos(count, parametros, this.stack, formdataGlobales);
          // console.log('listParam');
          // console.log(listParam);
          data.list = listParam;
          break;
        }
      }

      }

      const user = JSON.parse(localStorage.getItem('currentUser'));
      console.log("llamo al reportdef");
      console.log("user.sharedDTO.id");
      if (user.sharedDTO && user.sharedDTO.id && ( user.sharedDTO.reporte === metadata.methodName ) ) {
        const param = crearParametro('P_ID', FrontEndConstants.JAVA_LANG_LONG, user.sharedDTO.id);
        data.list.push(param);
      }

    if (excel) {
      this.reportdefService.generarExcel(data).subscribe(
      excelFile => {
        window.open('/SFS2FwWsServerWEB/FwWsFileServlet?P_FILE_NAME=' + excelFile['filename'] + '&P_FILE_CTYPE=excel');
      }, (err: HttpErrorResponse) => {

        this.checkError(err);

      });


    } else {
      this.cargadoABM = false;
      this.showABMFilter = false;
      const  actualizar: boolean = await this.ejecutarTabularABM(data, menu, busquedaFinder, backHistorico, metadata, finder, false);
    if (actualizar) {
      const inter = interval(15000);
      const subscribe = inter.subscribe(val =>
        this.ejecutarTabularABM(data, menu, busquedaFinder, backHistorico, metadata, finder, true)
      );
    }
}
  }

   ejecutarTabularABM(data: TabularAbmRequestDTO, menu: boolean, busquedaFinder: boolean,
     backHistorico: boolean, metadata: MetodoDTO,  finder: FinderRequestDTO, actualizar: boolean) {
      return new Promise<boolean>(resolve => {
        this.reporte = data.reportdef;
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    this.reportdefService.getObtenerTabularAbm(data).subscribe
    ((m: Tabular) => {
     // this.loadSpinner.hide();
     if (m.mostrarFiltros) {
       this.showABMFilter = true;
     }
      if (menu && !actualizar) {
       this.dataReportdefAux.tabular = false;
       this.dataReportdefAux.tabularAbm = false;
       this.dataReportdefAux.form = false;
       this.dataReportdefAux.formAbmEdit = false;
       this.dataReportdefAux.formAbmNew = false;
       this.dataReportdefAux.formHijo = false;
       if (!actualizar) {
        this.limpiarHistorico();
       }
      }
      if (!busquedaFinder && !actualizar) {
       this.limpiarreporte();
       this.dataReportdefAux.tabularAbm = true;
       // this.dataReportdefAux.cargando = false;
       this.dataReportdefAux.menu = menu;
       const dataReportdef = new ReportdefData(false, false, true, false, false, false, menu, false,
          user.mostrarInfoArea, this.dataReportdefAux.responsive);
          
          this.dataReportdef = dataReportdef;
       if (!backHistorico || menu) {
         this.setearHistorico(menu, metadata, null, null, finder, dataReportdef, data.list);
       }
      }
      this.tabular = m;
     this.header = this.tabular.columns;
     this.spinnerSfs.hide('reportdef') 
     
     this.dataTabular =  getData(this.tabular.data, this.tabular.columns);
     this.getFinder(this.tabular.finderDTOs);
     this.pagination =  generarDatosPaginacion(this.tabular,this.dataTabular);
     this.cargadoABM = true;
     this.vista = this.tabular.vista;
      resolve(m.actualizar);
        },
     (err: HttpErrorResponse) => {
       this.checkError(err);
       reject(err);
      });
  });
  }
  private generarTabularMetodo(menu: boolean, metadata: MetodoDTO, listRequest: FormdataReportdef[],
    backHistory: boolean, data: TabularRequestDTO ) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    // this.loadSpinner.show();
    this.reportdefService.getObtenerTabularByMethod(data).subscribe
    ((m: Tabular) => {
     // this.loadSpinner.hide();
      if (menu) {
       this.limpiarHistorico();
      }

      this.limpiarreporte();
      const dataReportdef = new ReportdefData(false, true, false, false, false, false, menu, false , user.mostrarInfoArea, false);
      this.dataReportdef = dataReportdef;
      this.dataReportdefAux.menu = menu;
      if (!backHistory && !menu) {
       // console.log('data tabular');
        // console.log(m);
        this.setearHistorico(menu, metadata, null, listRequest, null, dataReportdef, null);
        // console.log('stack');
        // console.log(this.stack);
      }
      // console.log('tabular');
       // console.log(m);
      this.tabular = m;
      this.header = this.tabular.columns;
     // this.getSettings(this.tabular.columns);

     this.dataTabular =  getData(this.tabular.data, this.tabular.columns);
     this.getFinder(null);
     this.pagination =  generarDatosPaginacion(this.tabular,this.dataTabular);


     this.vista = this.tabular.vista;
     this.dataReportdefAux.tabular = true;
        },
     (err: HttpErrorResponse) => {
       this.checkError(err);
 });
  }


  private generarTabular(menu: boolean, metadata: MetodoDTO, listRequest: FormdataReportdef[], backHistory: boolean ) {
    this.spinnerSfs.show('reportdef')
   
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const data = {} as TabularRequestDTO;
    // tslint:disable-next-line:prefer-const
    this.generateTabularRequestDTO(data, metadata.methodName, 0, 200, null, listRequest);
    //data.mobile =  true;  //this.deviceService.isMobile();

     data.mobile = this.deviceService.isMobile();
    this.listRequest = listRequest;
    // console.log('this.listRequest');
    // console.log(this.listRequest);

    if (data.mobile) {
      console.log('*************************es android******************************************');
      //const context = JSON.parse(applicacionContext());
      console.log('********************************context****************************************');
      // console.log(context);
      /*
      for ( const p of listRequest) {
        if ( p.metodo !== null && p.propiedad !== null) {
            const value = context.location[p.propiedad];
            p.valueNew = value;
        }
      }
      */
    }
    if (metadata.tipoMetodo.toUpperCase() === FrontEndConstants.TABULAR_METHOD.toUpperCase()) {
      this.generarTabularMetodo(menu, metadata, listRequest, backHistory, data);
      return;
    }
    let responsive = false;
    //this.dataTabular = [];
    //this.pagination.listaPaginacion = [];
    this.reportdefService.getObtenerTabular(data).subscribe
    ((m: Tabular) => {
      this.spinnerSfs.hide('reportdef')
      // this.loadSpinner.hide();
      if (menu) {
       this.limpiarHistorico();
      }
      if (m.responsive !== null) {
        responsive = true ;
      }
      this.limpiarreporte();
      const dataReportdef = new ReportdefData(false, true, false, false, false, false, menu, false , user.mostrarInfoArea, responsive);
     if(this.pagination !=null){
      this.pagination.listaPaginacion = [];
     }
      this.dataReportdef = dataReportdef;
      this.dataReportdefAux.menu = menu;
      if (m.etiqueta !== null) {
        this.tituloReporte = m.etiqueta;
      }
      if (!backHistory && !menu) {
        this.setearHistorico(menu, metadata, null, listRequest, null, dataReportdef, null);
      }
      this.tabular = m;
      this.header = this.tabular.columns;

     // this.getSettings(this.tabular.columns);
     this.dataTabular =  getData(this.tabular.data, this.tabular.columns);
     this.getFinder(null);
     this.pagination =  generarDatosPaginacion(this.tabular,this.dataTabular);
     this.spinnerSfs.hide('reportdef')
     


     this.vista = this.tabular.vista;
     this.dataReportdefAux.tabular = true;

     // this.tabular = m;
        // console.log('la tabla tiene ' + this.tabular);
        },
     (err: HttpErrorResponse) => {
       this.checkError(err);
 });

  }

private setearToStringEntidad(listRequest: FormdataReportdef[]) {
  return new Promise<void>(resolve => {

  if ( listRequest === null ) {
    reject();
      return;
  }
  console.log('entro al setearToStringEntidad');
  const  obtenerToStringRequest = {} as ObtenerToStringRequestDTO;
  obtenerToStringRequest.listId = [];
  for (const p of listRequest) {
    if (!p.entity || !p.valueNew || p.busquedaGenericaDTO.mostrarToStringLupa) {
      continue;
    }
    const  descEntidad = {} as DescripcionEntidadDTO;
    descEntidad.name = p.type;
    descEntidad.id = p.valueNew;
    obtenerToStringRequest.listId.push(descEntidad);
  }
  if (obtenerToStringRequest.listId.length > 0 ) {

  const user = JSON.parse(localStorage.getItem('currentUser'));

  this.reportdefService.consultarToStringEntidad(user, obtenerToStringRequest).subscribe(
    result => {
      console.log(result);
      for (const p of listRequest) {
        for (const p1 of result.listToString) {
            if (p.type === p1.name) {
                p.busquedaGenericaDTO.mostrarToStringLupa = p1.value;
                resolve();
            }
        }
      }
  });

}
reject();
});
}

consultarPropiedadFormTipoClase(reporte: string, user: User) {
  return new Promise(resolve => {

  const enviaParametrosDTO = {} as ObtenerPropiedadDTO;
  enviaParametrosDTO.entidad = reporte;
  this.reportdefService.obtenerPropiedadFormTipoClase(user, enviaParametrosDTO).subscribe
  ((result: any) => {
    console.log(result);
    resolve(result);
  },
  (err: HttpErrorResponse) => {
    resolve(null);
  });

});

}

callForm(user: any, menu: boolean, m: FormReportdef, metadata: MetodoDTO, listRequest: FormdataReportdef[]) {
  // this.loadSpinner.hide();
  const dataReportdef = new ReportdefData(true, false, false, false, false, false, menu, false, user.mostrarInfoArea, false);
  this.dataReportdef = dataReportdef;
  this.dataReportdefAux.form = true;
  this.dataReportdefAux.menu = menu;
  if (m.labelDescripcion) {
    this.labelReporte = m.labelDescripcion;
  }
  this.formRepordef = m;
      const historico = {} as Historico;
      historico.labelReporte = this.labelReporte;
      if (menu) {
        this.limpiarHistorico();
       }
        // tslint:disable-next-line:prefer-const
         // metadata.tipoMetodo = FrontEndConstants.FORM ;
        inicializarHistorico(historico, metadata, dataReportdef, listRequest, m.list, true, null, null);
      this.stack.append(historico);
      if (this.stack.length > 1) {
        this.actualizarDatosHistoricos(this.formRepordef.list);
      }

}
  async  generarForm(menu: boolean, metadata: MetodoDTO, backHistorico: boolean,
    listRequest: FormdataReportdef[]) {
    // console.log('recupera form');
    // this.setearToStringEntidad(listRequest);
    const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
    const user = JSON.parse(localStorage.getItem('currentUser'));
    // this.dataReportdefAux.form = false;
    this.limpiarreporte();
    // el listRequest se usa para poder rellenar algun campo;
    // this.loadSpinner.show();
    this.spinnerSfs.show('reportdef')
    if (!backHistorico || metadata.recargarSiempre) {
      // primero me fijo que no sea un form de tipo clase
      if (backHistorico) {
        const historico = this.stack.tail as Historico;
        listRequest = historico.listRequest;
      } else if (menu) {
        localStorage.removeItem('fechaCustom');
      }
     const formTipoClase: any = await this.consultarPropiedadFormTipoClase(metadata.methodName, user);
     if (formTipoClase.respuestagenerica != null ) {
        console.log('es un form de tipo clase');
        this.reportdefService.getObtenerFormByClass(user, metadata.methodName, formdataGlobales, listRequest).subscribe
          ((m: FormReportdef) => {
            this.spinnerSfs.hide('reportdef')
            console.log('form de tipo clase');
            this.callForm(user, menu, m, metadata, listRequest);
              },
          (err: HttpErrorResponse) => {
            this.checkError(err);
      });
     } else {
      this.reportdefService.getObtenerForm(user, metadata.methodName, formdataGlobales, listRequest).subscribe
      ((m: FormReportdef) => {
        this.spinnerSfs.hide('reportdef')
        this.callForm(user, menu, m, metadata, listRequest);
      },
        (err: HttpErrorResponse) => {
          this.checkError(err);
    });
  }
    } else {
      this.spinnerSfs.hide('reportdef')

      this.dataReportdefAux.cargando = true;
      const dataReportdef = new ReportdefData(true, false, false, false, false, false, menu, false, user.mostrarInfoArea, false);
      this.dataReportdef = dataReportdef;
      this.dataReportdefAux.menu = menu;
      const historico = this.stack.tail as Historico;
      this.labelReporte = historico.labelReporte;
      const formR = {} as FormReportdef;
      formR.list = historico.listParamOwner;
      console.log('formR.list');
      console.log(formR.list);
      // console.log('form desde el back history');
      // console.log(formR);
      this.formRepordef = formR;
        this.dataReportdefAux.form = true;
        this.reloadTree();
//      if (this.stack.length > 1 && !backHistorico) {
 //       this.actualizarDatosHistoricos(this.formRepordef.list);
  //    }
      }
  }

  private actualizarDatosHistoricos (data: FormdataReportdef[]) {
    for (const f of data) {
      if (f.global || f.buttom) {
        continue;
      }
     const fParam: FormdataReportdef[] =  buscarParametro(f.name, this.stack, null);
      if (fParam.length > 0) {
        const param: FormdataReportdef = fParam[0];
        if (param.valueNew) {
          f.valueNew = param.valueNew;
          f.value = param.valueNew;
          f.valueOld = param.valueNew;
          if (f.busquedaGenerica) {
            f.busquedaGenericaDTO.mostrarToStringLupa = param.busquedaGenericaDTO.mostrarToStringLupa ;
          }
        }
      }

    }
  }
  private getFinder(datos: FinderDTO[]) {
    this.campos = datos;
  }


 
  
  processFind(dato: any, excel: boolean) {
    // this.userIdle.resetTimer();

    console.log('procesando el find');
    console.log(dato);
    const finderRequest = {} as FinderRequestDTO;
       // tslint:disable-next-line:prefer-const
       let historico = this.stack.tail as Historico;
    if (dato) {
      // console.log('label ' + dato.campoBusqueda.label);
      // console.log('busqueda ' + dato.busqueda);
      // console.log('atribute ' + dato.campoBusqueda.atribute);
      // console.log('type ' + dato.campoBusqueda.type);
      this.datosBusquedaTabular = dato;
      finderRequest.atribute = dato.campoBusqueda.atribute;
      finderRequest.label = dato.campoBusqueda.label;
      finderRequest.value = dato.busqueda;
      finderRequest.type = dato.campoBusqueda.type;
      historico.finderRequestABM = finderRequest;
        // console.log('this.busquedaAlmacenada');
        // console.log(this.busquedaAlmacenada);
      this.busquedaAlmacenada = dato;
      this.generarTabularAbm(false, historico.metadata, finderRequest, true, false, excel);
    } else {
      this.generarTabularAbm(false, historico.metadata, finderRequest, true, false, excel);
    }
  }
  processRefreshTabular(dato: any) {
      // console.log('refrescar tabular');
      // console.log(this.datosBusquedaTabular);
      const historico = this.stack.tail as Historico;
      if (historico.repordef.tabularAbm) {
        this.processFind(this.datosBusquedaTabular, false);
      } else {
          // es un tabular
          this.generarTabular(historico.menu, historico.metadata, historico.listRequest, true);
      }
    }
    processActionsDina(eventAction: MetodoDTO ) {
      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.LOGICA.toUpperCase()) {
        const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
        // console.log('eventAction');
        // console.log(eventAction);
        const historico = this.stack.tail as Historico;
        const listParam: FormdataReportdef[] = prepararParametrosApasar(historico.repordef,
          eventAction, this.formRepordef['list'], this.stack, formdataGlobales);
        this.generarMethod( false, eventAction, listParam);
        return;
      }
      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.FORM.toUpperCase()) {
        const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
        // console.log('eventAction');
        // console.log(eventAction);
        const historico = this.stack.tail as Historico;
        const listParam: FormdataReportdef[] = prepararParametrosApasar(historico.repordef,
          eventAction, this.formRepordef['list'], this.stack, formdataGlobales);
        this.generarForm( false, eventAction, false, listParam);
        return;
      }

      }
    processActions(eventAction: MetodoDTO ) {
      // console.log('entro aca');
      // console.log('eventAction');
      // console.log(eventAction);
      // this.userIdle.resetTimer();
      const historico = this.stack.tail as Historico;

      if (eventAction.tipoMetodo.toUpperCase()  === FrontEndConstants.VOLVER_PRIMER_HISTORICO_Y_REFRESCAR.toUpperCase() ) {
        this.backFirstHistoryAndRefresh();
     }
     if (eventAction.tipoMetodo.toUpperCase()  === FrontEndConstants.VOLVER_PRIMER_HISTORICO.toUpperCase() ) {
      this.backFirstHistoryAndRefresh();
     }

      if (eventAction.tipoMetodo.toUpperCase()  === FrontEndConstants.ACCION_Y_VUELVE_TABULARABM.toUpperCase() ) {
        this.backHistory();
     }
     if (eventAction.tipoMetodo.toUpperCase()  === FrontEndConstants.REFRESCAR_TABULAR.toUpperCase() ) {
       if (eventAction.tipoReportdefParent.toUpperCase()  === FrontEndConstants.TABULAR_ABM.toUpperCase() ) {
           this.generarTabularAbm(historico.menu, historico.metadata, null, false, false, false);
          return;
       } else {
         // implementar para TABULAR
         this.generarTabular(historico.menu, historico.metadata, historico.listRequest, false);
       }
     }
     if (eventAction.tipoMetodo.toUpperCase()  === FrontEndConstants.VOLVER_HISTORICO_ANTERIOR.toUpperCase() ) {
      this.confirmationDialogService.confirm(true, 'La accion se ha ejecutado exitosamente',
      'Volvera a la pantalla anterior')
  .then((confirmed) => {
     if (confirmed) {
      this.backHistory();
      return;
      }

  }).catch(() => console.log('se queda ahi)'));

      }

     // metodos de ABM
      if (eventAction.tipoReportdefParent !== null &&
        eventAction.tipoReportdefParent.toUpperCase()  === FrontEndConstants.FORM.toUpperCase()) {
        this.proccesForm(eventAction);
        return;
      }
      if (eventAction.tipoReportdefParent !== null &&
        eventAction.tipoReportdefParent.toUpperCase()  === FrontEndConstants.FORM_ABM.toUpperCase()) {
          // console.log('entro a una accion de un abm');
          // console.log(this.tipoReporte);
            // Do some async stuff
            // If async opp successful

              this.persisteEntidad(historico.repordef.formAbmNew, eventAction).
              then( (resp) => {
                historico.formdataClasePadre.value = resp.idClasePersistida;
                historico.formdataClasePadre.valueNew = resp.idClasePersistida;
                this.proccesForm(eventAction);
              })

                .catch( error =>  this.checkError(error));
        }
      if (eventAction.tipoReportdefParent !== null &&
        eventAction.tipoReportdefParent.toUpperCase()  === FrontEndConstants.TABULAR_ABM.toUpperCase()) {
        this.proccesTabular(eventAction);
        return;
      }
      if (eventAction.tipoReportdefParent !== null &&
        eventAction.tipoReportdefParent.toUpperCase()  === FrontEndConstants.TABULAR.toUpperCase()) {
        this.proccesTabular(eventAction);
        return;
      }
      if (eventAction.tipoMetodo === FrontEndConstants.FORM ) {

      }
      if (eventAction.tipoMetodo === FrontEndConstants.LOGICA ) {

      }
      if (eventAction.tipoMetodo === FrontEndConstants.PDF ) {

      }
      if (eventAction.tipoMetodo === FrontEndConstants.TABULAR_ABM ) {
        this.generarTabularAbm(false, eventAction, null, false, false, false);
      }
      if (eventAction.tipoMetodo === FrontEndConstants.MODIFICAR_ABM ) {
        const data = {alta: false, id: eventAction.objeto.valueNew, reporte: eventAction.methodName, vista: eventAction.vistaABM};
        this.editarABM(data, false);
      }
      if (eventAction.tipoMetodo === FrontEndConstants.MODIFICAR_ABM_VOLVER ) {
          this.proccesForm(eventAction);
      }

    }

    async proccesTabular(eventAction: MetodoDTO) {
    // viene desde un ABM
      const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
      const historico = this.stack.tail as Historico;
      let parametros = [];
      if (historico.listRequest !== null && historico.listRequest.length > 0 ) {
          parametros = historico.listRequest;
      }
      if (historico.listParamABM) {
        for (const f of historico.listParamABM) {
          parametros.push(f);
        }
      }

      const listParam: FormdataReportdef[] = prepararParametrosApasar(historico.repordef,
      eventAction, parametros, this.stack, formdataGlobales);
      for (const f of listParam) {
        if (f.name === FrontEndConstants.P_LIST_ID) {
          console.log('encontrado el P_LIST_ID');
          console.log(eventAction.objeto);
            f.valueNew = eventAction.objeto;
            break;
        }
      }
      if ((eventAction.tipoMetodo !== FrontEndConstants.LOGICA && eventAction.tipoMetodo !== FrontEndConstants.PDF)  &&
      Object.keys(eventAction.paramsPasar).length !== listParam.length) {
        if ((eventAction.objeto !== null) && (eventAction.objeto.hasOwnProperty('name'))) {
          let encontrado = false;
          for (const f1 of listParam) {
            encontrado = false;
            if (f1.name === eventAction.objeto['name'] ) {
                  f1.valueNew = eventAction.objeto['valueNew'];
                  encontrado = true;
                  break;
            }
          }
          if (!encontrado) {
              listParam.push(eventAction.objeto);
          }
        }
        if (eventAction.objetoEvento !== null && eventAction.objetoEvento.length > 0) {
          let encontrado = false;
          for (const f1 of eventAction.objetoEvento) {
            encontrado = false;
            for (const f2 of listParam) {
              if (f1.name === f2.name) {
                encontrado = true;
                break;
              }
            }
            if (!encontrado) {
              listParam.push(f1);
            }
          }

        }
      }
      for (const f1 of listParam) {
        if (f1.entity && f1.valueNew && f1.busquedaGenericaDTO.mostrarToStringLupa === null) {
           await this.getToStringEntidad(f1);
        }
      }

      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.TABULAR.toUpperCase()) {
        this.generarTabular(false, eventAction, listParam, false);
      return;
    }
    if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.TABULAR_ABM.toUpperCase()) {
      this.generarTabularAbm(false, eventAction, historico.finderRequestABM, false, false, false);
        return;
    }
  if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.FORM.toUpperCase()) {
      this.generarForm(false, eventAction, false, listParam);
    return;
  }
  if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.PDF.toUpperCase()) {
      this.generarMethod( true, eventAction, listParam);
      return;
    }

    if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.LOGICA.toUpperCase()) {
      this.generarMethod( false, eventAction, listParam);
      return;
      }
      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.MODIFICAR_ABM.toUpperCase()) {
        const data = {alta: false, id: listParam[0].valueNew, reporte: eventAction.methodName, vista: eventAction.vistaABM};
        this.editarABM(data, false);
        return;
        }
        if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.NUEVO_ABM.toUpperCase()) {
          const data = {alta: true, id: null, reporte: eventAction.methodName, vista: eventAction.vistaABM};
          this.editarABM(data, false);
          return;
          }
    }

    async proccesForm(eventAction: MetodoDTO) {

      const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
      // console.log('eventAction');
      // console.log(eventAction);
      const historico = this.stack.tail as Historico;
      // console.log('historico');
      // console.log(historico);
      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.PERSISTIR_ENTIDAD.toUpperCase()) {
           this.persistirmodificarEntidad(true, eventAction);
           return;
      }
      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.MODIFICAR_ENTIDAD.toUpperCase()) {
        this.persistirmodificarEntidad(false, eventAction);
        // console.log('persistio entidad');
        return;
    }
    if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.MODIFICAR_ABM_VOLVER.toUpperCase()) {
      this.persistirmodificarEntidad(false, eventAction);
      // console.log('persistio entidad');
      return;
  }

      let fechaCustom = false;
      let pFechaCustom: FormdataReportdef = null;
      for (const f of this.formRepordef['list'] ) {
        if (f.fechaCustom) {
          pFechaCustom = f;
          fechaCustom = true;
          break;
        }
    }

    if (fechaCustom) {
      // si es fechaCustom debo agregar el parametro que me falta
      // el cual surge a traves del click que se le dio a la tabla del componente
      // el click asigna un id a un parametro configurado en la llamada del componente fechaCustom
      const paramFaltante: any = await this.getValueWithAsync(pFechaCustom);
      // this.formRepordef['list'].push(paramFaltante);
      console.log(this.formRepordef['list']);
      const listParam: FormdataReportdef[] = prepararParametrosApasar(historico.repordef,
        eventAction, this.formRepordef['list'], this.stack, formdataGlobales);
        let encontrado = false;
        for (const f of listParam ) {
          if (f.name === paramFaltante.name) {
            f.valueNew = paramFaltante.valueNew;
            f.value = paramFaltante.valueNew;
            encontrado = true;
            break;
          }
      }
      if (!encontrado) {
        listParam.push(paramFaltante);
      }
        this.continuarProcesandoForm(eventAction, listParam, historico);
    } else {

      if ( eventAction.bucleFormMetodo) {
        const listParam: FormdataReportdef[] = this.formRepordef['list'];
        this.continuarProcesandoForm(eventAction, listParam, historico);
      } else {
        const listParam: FormdataReportdef[] = prepararParametrosApasar(historico.repordef,
          eventAction, this.formRepordef['list'], this.stack, formdataGlobales);
          this.continuarProcesandoForm(eventAction, listParam, historico);
      }
    }

    }

    private  getValueWithAsync(param: FormdataReportdef) {
      return new Promise(resolve => {

        const paramRequest = {} as ParamRequestDTO;
        paramRequest.nombre = param.fechaCustomDTO.nameParamSel;
        const user = JSON.parse(localStorage.getItem('currentUser'));

        this.reportdefService.consultarParamByName(user, paramRequest).subscribe
        ((p: FormdataReportdef) => {
          p.valueNew = param.fechaCustomDTO.idSeleccionado;
          p.value = param.fechaCustomDTO.idSeleccionado;
          resolve(p);
        },
         (err: HttpErrorResponse) => {
           reject(err);
     });
      });
    }
    private  getToStringEntidad(param: FormdataReportdef) {
      return new Promise<void>(resolve => {

        const  descEntidad = {} as DescripcionEntidadDTO;
        descEntidad.name = param.type;
        descEntidad.id = param.valueNew;
        const  obtenerToStringRequest = {} as ObtenerToStringRequestDTO;
        obtenerToStringRequest.listId = [];
        obtenerToStringRequest.listId.push(descEntidad);

        if (obtenerToStringRequest.listId.length > 0 ) {

          const user = JSON.parse(localStorage.getItem('currentUser'));
          this.reportdefService.consultarToStringEntidad(user, obtenerToStringRequest).subscribe(
            result => {
              console.log(result);
                for (const p1 of result.listToString) {
                    if (param.type === p1.name) {
                        param.busquedaGenericaDTO.mostrarToStringLupa = p1.value;
                        resolve();
                    }
              }
          });
        }

    });
  }
    private continuarProcesandoForm(eventAction: MetodoDTO, listParam: FormdataReportdef[], historico: Historico) {

      if ( eventAction.tipoReportdefParent === FrontEndConstants.FORM_ABM) {
        listParam.push(historico.formdataClasePadre);
      }
      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.TABULAR.toUpperCase()) {
        this.generarTabular(false, eventAction, listParam, false);
        return;
      }
      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.FORM_METODO.toUpperCase()) {
        this.generarMethodForm( eventAction, listParam);
        return;
      }
      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.TABULAR_ABM.toUpperCase()) {
        this.generarTabularAbm(false, eventAction, null, false, false, false);
        return;
      }

      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.PDF.toUpperCase()) {
        // console.log('ejecutar metodo');
        // console.log(historico.formdataClasePadre);
        this.generarMethod( true, eventAction, listParam);
        return;
      }
      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.SETEXTERNALPARAMGLOBAL.toUpperCase()) {
        // console.log('ejecutar metodo');
        // console.log(historico.formdataClasePadre);
         listParam = [];
         for (const clave of Object.keys(eventAction.paramsPasar)) {
             for (const p of historico.containerABM.list) {
                if (p.name === clave) {
                  listParam.push(p);
                }
             }
        }
        this.generarMethod( false, eventAction, listParam);
        return;
      }

      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.LOGICA.toUpperCase()) {
        this.generarMethod( false, eventAction, listParam);
        return;
      }

      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.FORM.toUpperCase()) {
        this.generarForm( false, eventAction, false, listParam);
        return;
      }
      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.TYPE_QUESTION.toUpperCase()) {
          const data = {} as ParametrosExecuteMethodRequestDTO;
          data.list = listParam;
          data.pdf = false;
          data.metodo = eventAction.methodName;
          this.generarMethodTypeQuestion( data, eventAction);
          return;
      }
    // ejecuta un tabular en modo metodo
      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.TABULAR_METHOD.toUpperCase()) {

        this.generarTabular(false, eventAction, listParam, false);
        return;
      }
      if (eventAction.tipoMetodo.toUpperCase() === FrontEndConstants.MODIFICAR_ABM.toUpperCase()) {
        const data = {alta: false, id: eventAction.objeto.valueNew, reporte: eventAction.methodName, vista: eventAction.vistaABM};
        this.editarABM(data, false);
        return;
        }

}

    private obtenerParametroClasePadre(result: PersistirEntidadResponse): Promise<boolean> {

      return new Promise<boolean>( (resolve) => {
        const historico = this.stack.tail as Historico;
        const user = JSON.parse(localStorage.getItem('currentUser'));

        // cargo lo del hijo
       // console.log('exito');
        // console.log(result);
            historico.containerABM.id = result.idClasePersistida;
            this.dataHijos = result.dataHijoDTO.tableDTO;
            this.abmParams = result.dataHijoDTO.abmParams;
            historico.repordef.formHijo = true;
            historico.repordef.formAbmNew = false;
            historico.repordef.formAbmEdit = true;
            this.dataReportdefAux.formHijo = true;
            this.dataReportdefAux.formAbmNew = false;
            this.dataReportdefAux.formAbmEdit = true;
            this.dataReportdefAux.formHijo = true;
         // this.tieneHijoAlta = m.tieneHijoAlta;
         this.paramService.setearParam(result.dataHijoDTO.abmParams);
         //this.getSettings( result.dataHijoDTO.tableDTO.columns);
         this.dataTabular =  getData(result.dataHijoDTO.tableDTO.data, result.dataHijoDTO.tableDTO.columns);
    
        // busco el parent
        // esto lo hago para tener a mano el parent de los abm con Hijos
          const paramRequest = {} as ParamRequestDTO;
          paramRequest.nombre = result.dataHijoDTO.abmParams.entidadPadre;
          consultarParametroByClase(paramRequest, this.reportdefService).
          then( (resp) => {
          resp.valueNew = result.idClasePersistida;
          resp.value = result.idClasePersistida;
          localStorage.removeItem('paramParent');
          localStorage.setItem('paramParent', JSON.stringify(resp));
           historico.formdataClasePadre = resp;
         }).catch( error =>  this.checkError(error));
    });
    }
    private persisteEntidad(alta: boolean, eventAction: MetodoDTO): Promise<PersistirEntidadResponse> {

      return new Promise<PersistirEntidadResponse>( (resolve) => {
        const historico = this.stack.tail as Historico;
       // this.loadSpinner.show();

        const user = JSON.parse(localStorage.getItem('currentUser'));

        const data = {} as PersistirEntidadRequest;
        data.nueva = alta;
        data.reporte = historico.containerABM.reportePadre;
        if (eventAction.buttonVolverYguardar) {
          data.vista = FrontEndConstants.BUTTON_GUARDARYVOLVER + historico.containerABM.vistaPadre;
        } else {
          data.vista = historico.containerABM.vistaPadre;
        }
        data.Entidad = historico.containerABM.clasePadre;
        if (eventAction.chequeaExisteHijo) {
          data.checkHijo = 1;
        }
        // console.log('historico.containerABM');
        // console.log(historico.containerABM);
        if (eventAction.chequeaExisteHijo) {
          data.checkHijo = 1;
        }
        data.valorPK = historico.containerABM.id;
        data.camposPersistirDTO = this.formRepordef.list;
        // console.log('data.camposPersistirDTO');
        // console.log(data.camposPersistirDTO);
        this.reportdefService.persistirModificarEntidad(user, data).subscribe
        (result => {
          // this.loadSpinner.hide();
          if (result.mensajeLogica) {
            this.messageService.add({severity:'success', summary: 'Exito', detail: result.mensajeLogica});

          } else {
            this.messageService.add({severity:'success', summary: 'Exito', detail: 'Entidad persistida'});
          }
            // historico.formdataClasePadre.valueNew = result.idClasePersistida;
            // historico.formdataClasePadre.value = result.idClasePersistida;
          // console.log('PERSISTO ENTIDAD');
          // console.log(result);
          // vuelvo al historico
          // veo si tiene que mostrar los hijos
          resolve(result);
        },
        (err: HttpErrorResponse) => {
          // this.loadSpinner.hide();
          // console.log('un error al intentar persistir');
          // console.log(err);
          this.checkError(err);
          reject(err);
        });


      });
      }


    private persistirmodificarEntidad(alta: boolean, eventAction: MetodoDTO) {

      const historico = this.stack.tail as Historico;

      this.persisteEntidad(alta, eventAction).
      then( (result) => {
        historico.containerABM.id = result.idClasePersistida;
        if (historico.containerABM.tieneHijoAlta) {
          this.obtenerParametroClasePadre(result).then( (resp) =>
           console.log('exito'));
        } else if (historico.repordef.formHijo && historico.repordef.formAbmEdit &&
          eventAction.tipoMetodo !== FrontEndConstants.MODIFICAR_ABM_VOLVER) {
         } else {
          this.backHistory();
        }
          }).catch
          (
            (error) => { console.log(error);
            });
    }
    private generarMethodForm(metadata: MetodoDTO, listRequest: FormdataReportdef[] ) {
      const data = {} as ParametrosExecuteMethodRequestDTO;
      // tslint:disable-next-line:prefer-const
     // this.loadSpinner.show();
      data.pdf = false;
      data.metodo = metadata.methodName;
      for (const b of listRequest) {
        if ( b.buttom) {
          b.valueNew = null;
          if ( b.buttomDTO.metodoDTO.id === metadata.id) {
            b.valueNew = 1;
          }
        }
      }
      data.list = listRequest;
      const user = JSON.parse(localStorage.getItem('currentUser'));
      this.reportdefService.postExecuteMethodForm(user, data).subscribe
        ((m: FormReportdef) => {
          this.limpiarreporte();
          // this.loadSpinner.hide();
          console.log('retorno del  formmetodo');
          console.log(m);
          if (this.deviceService.isMobile) {
            console.log('*************************es android******************************************');
            //const context = JSON.parse(applicacionContext());
            console.log('********************************context****************************************');
            //console.log(context);
            /*
            for ( const p of m.list) {
              console.log('***************p.name*********************');
              console.log(p.name);
              console.log(p.metodo);
              console.log('p.propiedad');
              console.log(p.propiedad);
              if ( p.metodo !== null && p.propiedad !== null) {
                  const value = context.location[p.propiedad];
                  console.log('****************value***************');
                  console.log(value);
                  p.valueNew = value;
              }
            }
            */
          }
          
          if (m.metodoDTOs !== null && m.metodoDTOs.length > 0 && m.parametro !== null && !m.dinamycForm ) {
            // se va a otro lado
            const list = [] as FormdataReportdef[];
            for (const clave of Object.keys(m.metodoDTOs[0].paramsPasar)) {
                if (clave === m.parametro.name) {
                  list.push(m.parametro);
                } else {
                  let encontrado = false;
                  for (const p of listRequest) {
                    if (p.name === clave) {
                      list.push(p);
                      encontrado = true;
                      break;
                    }
                  }
                  if (!encontrado) {
                    const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
                    const formdata: FormdataReportdef[]  =  buscarParametro(clave, this.stack, formdataGlobales);
                    for (const c of formdata) {
                      list.push(c);
                    }
                }
              }
            }
            const historico = this.stack.tail as Historico;
              this.continuarProcesandoForm(m.metodoDTOs[0], list, historico);
            return;
          } else if (m.metodoDTOs !== null && m.metodoDTOs.length > 0 && m.parametro !== null && m.dinamycForm) {

            this.reloadTree();
            const dataReportdef = new ReportdefData(true, false, false, false, false, false, false, false, user.mostrarInfoArea, false);
            this.dataReportdef = dataReportdef;
            this.dataReportdefAux.form = true;
            this.dataReportdefAux.menu = false;
              this.labelReporte = 'RECOMENDACIONES';
            this.formRepordef = m;
            const historico = {} as Historico;
            // metadata.tipoMetodo = FrontEndConstants.FORM ;
            inicializarHistorico(historico, metadata, dataReportdef, listRequest, m.list, true, null, null);
            this.stack.append(historico);
            // dibujo el form con lo que tengo

          } else {
            this.reloadTree();
            const dataReportdef = new ReportdefData(true, false, false, false, false, false, false, false, user.mostrarInfoArea, false);
            this.dataReportdef = dataReportdef;
            this.dataReportdefAux.form = true;
            this.dataReportdefAux.menu = false;
            if (m.labelDescripcion) {
              this.labelReporte = m.labelDescripcion;
            }
            this.formRepordef = m;
            const historico = {} as Historico;
            // metadata.tipoMetodo = FrontEndConstants.FORM ;
            inicializarHistorico(historico, metadata, dataReportdef, listRequest, m.list, true, null, null);
            this.stack.append(historico);
          }
      },
       (err: HttpErrorResponse) => {
         this.checkError(err);
   });
    }
    private generarMethod(pdf: boolean, metadata: MetodoDTO, listRequest: FormdataReportdef[] ) {
      const data = {} as ParametrosExecuteMethodRequestDTO;
      // tslint:disable-next-line:prefer-const
      // this.loadSpinner.show();
      data.list = listRequest;
      data.pdf = pdf;
      data.metodo = metadata.methodName;
      const user = JSON.parse(localStorage.getItem('currentUser'));
      data.b64 = true;
      // console.log('data');
      // console.log(data);
      this.reportdefService.postExecuteMethod(user, data).subscribe
      ((result: ReportMethodResponseDTO) => {
        // this.loadSpinner.hide();

        // console.log('result');
        // console.log(result);
        if (pdf) {

          const byteString = window.atob(result.arch);
          const arrayBuffer = new ArrayBuffer(byteString.length);
          const int8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([int8Array]);    

        saveAs(blob, result.nameArch);

            this.messageService.add({severity:'success', summary: 'Exito', detail: 'Archivo PDF generado con exito'});
        } else {
          this.messageService.add({severity:'success', summary: 'Exito', detail: 'Accion ejecuta exitosamente'});
        }
        // console.log('metadata');
        // console.log(metadata);

        if ( metadata.tipoMetodo ===  FrontEndConstants.SETEXTERNALPARAMGLOBAL) {
          // seteo el parametro global
          const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
          const listParam: FormdataReportdef[] = [];
          for (const p of formdataGlobales ) {
            if (p.name === metadata.retasigparam  ) {
              p.valueNew = result.valor;
              listParam.push(p);
              this.actualizarInfoArea(listParam);
              break;
            }

          }
          localStorage.setItem('paramGlobal', JSON.stringify(formdataGlobales));


          // ACTUALIZO EL TABINFORMATIONBODY

          this.backHistory();
          return;
        }

        if (metadata.metodoDTO) {
          metadata.metodoDTO.tipoReportdefParent = metadata.tipoReportdefParent;
          if ( metadata.retasigparam !== null && metadata.retasigparam !== undefined ) {

            const paramRequest = {} as ParamRequestDTO;
            paramRequest.nombre = metadata.retasigparam;
            this.reportdefService.consultarParamByName(user, paramRequest).subscribe
            ((p: FormdataReportdef) => {
              p.valueNew = result.valor;
              p.value = result.valor;
              metadata.metodoDTO.objeto = p;
              metadata.metodoDTO.objetoEvento = metadata.objetoEvento;
              this.processActions(metadata.metodoDTO);
              return;
            },
             (err: HttpErrorResponse) => {
               this.checkError(err);
         });

          } else {
            if (result.valor) {

              for (const clave of Object.keys(metadata.metodoDTO.paramsPasar)) {
                result.nombre = clave.toString();
                break;
              }

              metadata.metodoDTO.objeto = result;
             // si tiene un valor lo meto en un objeto, sino quiere decir que es un metodo void
            }
            if (metadata.metodoDTO.tipoMetodo === FrontEndConstants.REFRESCAR_TABULAR) {
              // esto es para saber si es un ABM o un tabular el que debo refrescar
               metadata.metodoDTO.tipoReportdefParent = metadata.tipoReportdefParent;

            }
            this.processActions(metadata.metodoDTO);
          }
        } else {
          if (metadata.tipoReportdefParent === FrontEndConstants.FORM_ABM ) {
            this.backHistory();
        }

        }
          },
       (err: HttpErrorResponse) => {
         this.checkError(err);
   });

    }
    async actualizarInfoArea(list: FormdataReportdef []) {
      this.setearToStringEntidad(list).then( (resp) => {
        const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
        for (const p of formdataGlobales ) {

          for (const f of list ) {
            if (p.name === f.name  ) {
              p.busquedaGenericaDTO.mostrarToStringLupa = f.busquedaGenericaDTO.mostrarToStringLupa;
              this.nameService.setearNameGlobal(f.busquedaGenericaDTO.mostrarToStringLupa, null);
              break;
            }
        }
      }
      // ahora debo ejecutar el metodo que obtiene la info
        localStorage.setItem('paramGlobal', JSON.stringify(formdataGlobales));
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user['metodo'] !== null && user['metodo'] !== undefined) {
             const pos =  user.metodo.indexOf('(');
             const listAux = [];
             const metodo =  user.metodo.substring(0, pos);
             const param = user.metodo.substring(pos + 1, (user.metodo.length - 1 ));
             const params = param.split(',');
             for (const p of params) {
               for ( const g of formdataGlobales ) {
                 if (g.name === p) {
                   listAux.push(g);
                 }
               }
             }
             const dataMetodo = {} as ParametrosExecuteMethodRequestDTO;
             // tslint:disable-next-line:prefer-const
             dataMetodo.list = listAux;
             dataMetodo.pdf = false;
             dataMetodo.metodo = metodo;
              this.reportdefService.postExecuteMethod(user, dataMetodo).subscribe(
                 (mensaje: any) => {
                   localStorage.setItem('tabInformationBody', mensaje.valor);
              });
         }


       }).catch(() =>
          console.log('no se puede mostrar informacion del usuario')
      );

    }

// metodo que ejecuta un metodo y que luego va preguntando al usuario
    private generarMethodTypeQuestion(data: ParametrosExecuteMethodRequestDTO, metadata: MetodoDTO) {
    const user = JSON.parse(localStorage.getItem('currentUser'));

      this.reportdefService.postExecuteMethod(user, data).subscribe
      ((result: ReportMethodResponseDTO) => {
       // this.loadSpinner.hide();
       this.messageService.add({severity:'success', summary: 'Exito', detail: 'Accion ejecuta exitosamente'});


        if (metadata.metodoDTO) {
          if ( metadata.retasigparam !== null && metadata.retasigparam !== undefined ) {

            const paramRequest = {} as ParamRequestDTO;
            paramRequest.nombre = metadata.retasigparam;
            this.reportdefService.consultarParamByName(user, paramRequest).subscribe
            ((p: FormdataReportdef) => {
              p.valueNew = result.valor;
              p.value = result.valor;
              metadata.metodoDTO.objeto = p;
            },
             (err: HttpErrorResponse) => {
                  this.checkError(err);
         });

          } else {
            if (result.valor) {

              for (const clave of Object.keys(metadata.metodoDTO.paramsPasar)) {
                result.nombre = clave.toString();
                break;
              }

              metadata.metodoDTO.objeto = result;
             // si tiene un valor lo meto en un objeto, sino quiere decir que es un metodo void
            }
          }
          this.processActions(metadata.metodoDTO);
        } else {
          if (metadata.tipoReportdefParent === FrontEndConstants.FORM_ABM ) {
            this.backHistory();
        }

        }
          },
       (err: HttpErrorResponse) => {
        if (this.checkQuestion(err)) {
          // this.loadSpinner.hide();

            this.ejecutarBucleQuestion(data, err, metadata);
        } else {

         this.checkError(err);
        }
   });

    }



    ejecutarBucleQuestion(data: ParametrosExecuteMethodRequestDTO, err: any, metadata: MetodoDTO) {
      this.confirmationDialogService.confirm(true, err.mensaje,
      'Atencion')
    .then((confirmed) => {
     if (confirmed) {
      for (const p of data.list) {
          if (p.name === err.parametroCondicional) {
              p.valueNew = err.opcionValueOne;
          }
          break;
      }

    } else {
      for (const p of data.list) {
        if (p.name === err.parametroCondicional) {
            p.valueNew = err.opcionValueTwo;
        }
        break;
    }
      this.generarMethodTypeQuestion(data, metadata);
     }

    }).catch(() => console.log('salio)'));
    }

    backFirstHistoryAndRefresh() {
       if (this.stack.length > 1) {

         while (this.stack.length > 1) {
          this.stack.removeTail();
        }
       }
       const historico = this.stack.tail as Historico;
       if (historico.repordef.form) {
         this.generarForm(historico.repordef.menu, historico.metadata, true, null);
       }
       if (historico.repordef.tabularAbm) {
         this.generarTabularAbm(historico.repordef.menu, historico.metadata, historico.finderRequestABM, false, true, false);
       }
       if (historico.repordef.tabular) {
          this.generarTabular(historico.repordef.menu, historico.metadata, historico.listRequest, true);
       }
    }

    backHistory() {
      // evento emitido que sirve para ir para atras en una pantalla, todas las pantallas generan historico
      // menos el metodo de logica y el metodo pdf
      this.stack.removeTail();

      const historico = this.stack.tail as Historico;
      if (historico.repordef.form) {
        this.generarForm(historico.repordef.menu, historico.metadata, true, null);
      }
      if (historico.repordef.tabularAbm) {
        this.generarTabularAbm(historico.repordef.menu, historico.metadata, historico.finderRequestABM, false, true, false);
      }
      if (historico.repordef.tabular) {
        this.generarTabular(historico.repordef.menu, historico.metadata, historico.listRequest, true);
     }
     if (historico.repordef.formAbmEdit) {
       const data = {alta: false, id: historico.containerABM.id, reporte: historico.containerABM.reportePadre
        , vista: historico.containerABM.vistaPadre};
      this.editarABM(data, true);
      return;
   }
}
  private checkError(error: any ) {
    // this.loadSpinner.hide();
    this.spinnerSfs.hide('reportdef')
    // console.log('esto es un error');
    // console.log(error);
    if (error !== undefined && error !== null) {
      if ((error.hasOwnProperty('tokenError') &&  error.tokenError) || (error.hasOwnProperty('tokenExpired') && error.tokenExpired)) {
         this.router.navigate(['/token']);
        return;
      } else if (error.errorBusiness) {
        this.messageService.add({severity:'error', summary: 'Error', detail: error.mensaje});

      } else {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'error inesperado'});
      }
      }
  }
  private checkQuestion(error: any ) {
    if (error) {
      if (error.ErrorQuestion) {
        return true;
      }
    }
    return false;


  }
  private setearHistorico(menu: boolean, metadata: MetodoDTO, formdataReportdefOwner: FormdataReportdef[],
    formdataReportdefrequest: FormdataReportdef[], finder: FinderRequestDTO, reportdefData: ReportdefData,
     paramListABM: FormdataReportdef[] ) {
    const historico = {} as Historico;
    inicializarHistorico(historico, metadata, reportdefData, formdataReportdefrequest, formdataReportdefOwner, menu, finder, paramListABM);
    this.stack.append(historico);
  }
  private limpiarHistorico() {
    if (this.stack === null || this.stack.length === 0 ) {
      return;
    }
    this.stack = null;
    this.stack = new LinkedList<Historico>();

  }
  private limpiarreporte() {
    this.dataReportdefAux.form = false;
    this.dataReportdefAux.formAbmEdit = false;
    this.dataReportdefAux.formAbmNew = false;
    this.dataReportdefAux.formHijo = false;
    this.dataReportdefAux.tabular = false;
    this.dataReportdefAux.tabularAbm = false;
  }
  editarABM(data: any, backHistorico: boolean) {
    // this.loadSpinner.show();

    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (data.alta) {
      const enviaParametrosDTO = {} as ObtenerPropiedadDTO;
      enviaParametrosDTO.tipoVista = FrontEndConstants.PROPIEDAD_FORMDATA;
      enviaParametrosDTO.propiedad = FrontEndConstants.PROPIEDAD_FORMDATA_ENVIA_PARAMETROS;
      enviaParametrosDTO.vista = data.vista;
      enviaParametrosDTO.entidad = data.reporte;
      this.reportdefService.obtenerPropiedadReportdef(user, enviaParametrosDTO).subscribe
      ((m: any) => {
        // aca viene si debo mandar parametros a la logica;
       // console.log(m.respuestagenerica);
       if (m.respuestagenerica) {
        const parametros = m.respuestagenerica.split(',');
        const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
        const count = this.stack.length;
        const listParam: FormdataReportdef[] = buscarParametrosEnHistoricos(count, parametros, this.stack, formdataGlobales);
        this.getABM(data, listParam, backHistorico);
      } else {
        this.getABM(data, null, backHistorico);
      }
      },
      (err: HttpErrorResponse) => {
        this.checkError(err);
        this.getABM(data, null, backHistorico);
  });

} else {
  this.getABM(data, null, backHistorico);
}
}
 private getABM(data: any, listParam: FormdataReportdef[], backHistorico: boolean) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const abmEdit = {} as AltaEdicionABMDTO;
  abmEdit.alta = data.alta;
    const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
   abmEdit.global = formdataGlobales;
 abmEdit.id = data.id;
 this.idEntidad = data.id;
 abmEdit.reportName = data.reporte;
 abmEdit.viewName = data.vista;

 abmEdit.onlyOwner = data.onlyOwner;
 abmEdit.idOnlyOwner = data.idOwner;
 abmEdit.onlyOwnerDay = data.onlyOwnerDay;
 abmEdit.campoOnlyOwner = data.onlyOwnerField;
 abmEdit.campoDayOnlyOwner = data.onlyOwnerDayField;
 abmEdit.list = listParam;
this.dataHijos = null;
this.reportdefService.getNewEditAbm(user, abmEdit).subscribe
 ((m: ContainerAbmNuevoDTO) => {
  // this.loadSpinner.hide();
   this.limpiarreporte();
   if (this.formRepordef === undefined || this.formRepordef === null) {
     this.formRepordef = {} as FormReportdef;
   }
   this.formRepordef.list = m.list;
   this.formRepordef.camposAgrupados = m.componentesAgrupados;
   this.formRepordef.tabs = m.tabs;
   this.formRepordef.fieldsTab = m.fieldsTab;
   this.formRepordef.list.concat( m.listBotones);
   console.log('formulario con Tabs');
   console.log(this.formRepordef);
   if (m.tituloForm) {
     this.labelReporte = (abmEdit.alta ? 'Alta: ' : 'Edición: ') + m.tituloForm;
   } else {
     this.labelReporte = (abmEdit.alta ? 'Alta: ' : 'Edición: ' ) + this.reporte;
   }
   let tieneHijo = false;
   m.id = data.id;
   const dataReportdef = new ReportdefData(false, false, false, data.alta, !data.alta, tieneHijo, false, false,
     user.mostrarInfoArea, false);
   this.dataReportdef = dataReportdef;
   this.dataReportdefAux.formAbmNew = data.alta;
   this.dataReportdefAux.formAbmEdit = !data.alta;
   this.dataReportdefAux.formHijo = tieneHijo;
   const historico = {} as Historico;
   if (!backHistorico) {
    const metadata = {} as MetodoDTO;
    metadata.tipoMetodo = FrontEndConstants.ABMEDICION ;
    historico.containerABM = m;
    inicializarHistorico(historico, metadata, dataReportdef, null, this.formRepordef.list, false, null, null);
    this.stack.append(historico);

   }
   // console.log('historico');
   // console.log(historico);
   const paramRequest = {} as ParamRequestDTO;
   if (m.abmParams && m.abmParams.tieneHijos) {
     tieneHijo = true;
     paramRequest.nombre = m.abmParams.entidadPadre;
     if (!abmEdit.alta) {
      // this.getSettings(m.tableDTO.columns);
      this.dataTabular =  getData(m.tableDTO.data, m.tableDTO.columns);
       this.dataHijos = m.tableDTO;
       this.dataReportdefAux.formHijo = tieneHijo;
       historico.repordef.formHijo = true;
       this.abmParams = m.abmParams;
       consultarParametroByClase(paramRequest, this.reportdefService).
       then( (resp) => {
       resp.valueNew = data.id;
       resp.value = data.id;
       localStorage.removeItem('paramParent');
       localStorage.setItem('paramParent', JSON.stringify(resp));
        historico.formdataClasePadre = resp;
      }).catch( error =>  this.checkError(error));
     }
   } else {
      localStorage.removeItem('paramParent');
      paramRequest.nombre = historico.containerABM.clasePadre;
      consultarParametroByClase(paramRequest, this.reportdefService).
      then( (resp) => {
       historico.formdataClasePadre = resp;
     }).catch( error =>  console.log('error al buscar un parametro asociado a la entidad'));
   }

    // this.tieneHijoAlta = m.tieneHijoAlta;
 },
   (err: HttpErrorResponse) => {
     this.checkError(err);
});

}


generarExcel() {
  this.processFind(this.datosBusquedaTabular, true);
}
reloadTree() {
  this.dataReportdefAux.cargando = true;
  // now notify angular to check for updates
  this.changeDetector.detectChanges();
  // change detection should remove the component now
  // then we can enable it again to create a new instance
  this.dataReportdefAux.cargando = false;
}

}
