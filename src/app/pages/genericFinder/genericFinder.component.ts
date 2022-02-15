
import { Component, Input, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FinderParamsDTO } from '../../_models/finderParamsDTO';
import { FinderGenericDTO } from 'src/app/_models/finderGenericDTO';
import { FrontEndConstants } from 'src/app/constans/frontEndConstants';
import { AbmService } from 'src/app/_services/abmService';
import { getData} from './utilFinder';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AvisaSeteoService } from 'src/app/_services/avisaSeteoService';
import { Pagination } from 'src/app/_models/pagination';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-generic-finder',
  templateUrl: './genericFinder.component.html',
  providers: [MessageService]

})
export class GenericFinderComponent implements OnInit {

  @Input() title: string;
  @Input('data') data: any;
  @Input('column') column: any;
  @Input('finder') finder: FinderParamsDTO;
  @Input('comboFinder') comboFinder: FinderGenericDTO;
  @Input('settings') settings: any;
  @Input('entidad') entidad: string;
  @Input('vista') vista: string;
  @Input('value') value: string;
  @Input('findByEqual') findByEqual: boolean;
  @ViewChild('find') find: ElementRef;
  pagination: Pagination;
  dataSeleccionada: any;

  finderTabular = {
    busqueda: '',
    campoBusqueda: null,
    modoMetodo: false
  };
  lastClickTime = 0;
  rowSelected: any;
  constructor(private activeModal: NgbActiveModal, private renderer: Renderer2, private avisaSeteo: AvisaSeteoService,
    private abmservice: AbmService, private messageService: MessageService, private router: Router
    ) { }

  ngOnInit() {
    this.finderTabular.modoMetodo = this.finder.typeMethodFinder;
    if (this.comboFinder) {
      this.finderTabular.campoBusqueda = this.comboFinder[0];
    }
    if (this.value) {
      this.finderTabular.busqueda = this.value;
    }
    //this.dataTabular =  getData(this.tabular.data, this.tabular.columns);
    //this.getFinder(null);
     this.pagination = {} as Pagination;
     this.pagination.activa = true;
     this.pagination.page = 1;
     this.pagination.cantidadRegistrosxPagina = 10;
     this.pagination.previousPage = 1;
     this.pagination.maxBotones = 1;
     this.pagination.cantColVis = 0;
    if (this.data.length <=  this.pagination.cantidadRegistrosxPagina ) {
      this.pagination.activa = false;
    } else {
      this.pagination.maxBotones =  this.data.length / this.pagination.cantidadRegistrosxPagina;
    }


    }
    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit(): void {
      // console.log(this.find.nativeElement);
      // console.log(this.finder);
      if (!this.finder.typeMethodFinder) {
        this.renderer.selectRootElement(this.find.nativeElement).focus();
      }
      // this.find.nativeElement.focus();
    }

    // LEO-INICIA 11-04-2019 13:18
    /*
    buscarSeleccionado(eleSel) {
      if (this.data.length > 0) {
        this.data.forEach(element => {
          if (eleSel === element) {
            this.dataSeleccionada = element;
          }
        });
      }
    }
    */
    // LEO-TERMINA 11-04-2019 13:18


    onRowSelect(event) {

    console.log('this.lastClickTime');
    console.log(this.lastClickTime);
    if (this.lastClickTime === 0) {
      this.lastClickTime = new Date().getTime();
     this.dataSeleccionada = event;
    //  this.buscarSeleccionado(event.data);
    } else {

        const change = (new Date().getTime()) - this.lastClickTime;
        console.log('change');
        console.log(change);

      if (change < 20000) {
        console.log(event);

       this.onDoubleClick(event);

      } else {
        this.lastClickTime = 0;
      }
    }
  }

  onDoubleClick(data) {
    // this.buscarSeleccionado(data);
    console.log('Ha dado Dobleclick');
    // console.log(this.dataSeleccionada);

    if (this.dataSeleccionada.length >= 1 ) {
      this.avisaSeteo.setVisivilidad(true);
    } else {
      this.avisaSeteo.setVisivilidad(false);
    }
     // this.avisaSeteo.getVisivilidad();

    this.activeModal.close(data);
    // this.activeModal.close(true);
  }
  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    if (this.dataSeleccionada.length >= 1 ) {
      this.avisaSeteo.setVisivilidad(true);
    } else {
      this.avisaSeteo.setVisivilidad(false);
    }

   // this.avisaSeteo.getVisivilidad();
    this.activeModal.close(this.dataSeleccionada);
  }

  public dismiss() {
    this.activeModal.dismiss(false);
  }

  public sinSeleccion(event) {
    // tslint:disable-next-line:prefer-const
    let data = {
       sinSeleccion: true,
    };
    this.activeModal.close(data);
  }
  public buscar(event) {

    if (this.finderTabular.busqueda !== null && this.finderTabular.busqueda.trim() !== '' ) {
      this.finder.finderGenericDTO.atribute = this.finderTabular.campoBusqueda.atribute;
      this.finder.finderGenericDTO.type = this.finderTabular.campoBusqueda.type;
      if (this.finder.finderGenericDTO.type === FrontEndConstants.JAVA_LANG_LONG) {
        this.finder.finderGenericDTO.value = this.finderTabular.busqueda;
      } else {
              if (this.findByEqual) {
                this.finder.finderGenericDTO.value = this.finderTabular.busqueda;
              } else {
                this.finder.finderGenericDTO.value = '%' + this.finderTabular.busqueda + '%';
              }
      }
  } else {
    this.finder.finderGenericDTO.atribute = null;
    this.finder.finderGenericDTO.type = null;
    this.finder.finderGenericDTO.value = null;
  }
  const user = JSON.parse(localStorage.getItem('currentUser'));
  this.abmservice.consultarAbmGeneric(user, this.finder).subscribe(
    result => {
      this.data = getData(result['data'], result['columns']);
    },
    (err: HttpErrorResponse) => {
      this.checkError(err);
    }
  );
}
muestraCantidadPorPaginayPagina(noPage, $event) {
  let noRegistrosLoc = 0; // $event.target.value;
    if ($event == null) {
      noRegistrosLoc = this.data.length;
    } else {
      noRegistrosLoc = $event.target.value;
    }
  //this.pagination.listaPaginacion = listaPagLoc;
  this.pagination.cantidadRegistrosxPagina =  noRegistrosLoc;
  this.pagination.page =  noPage;
}
private checkError(error: any ) {
 if (error !== undefined && error !== null) {
    if ((error.hasOwnProperty('tokenError') &&  error.tokenError) || (error.hasOwnProperty('tokenExpired') && error.tokenExpired)) {
       this.router.navigate(['/token']);
      return;
    } else {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'error inesperado'});
    }
  }
 }
}
