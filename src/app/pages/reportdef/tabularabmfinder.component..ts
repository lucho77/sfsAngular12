import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { FinderDTO } from 'src/app/_models/finderDTO';
@Component({
    selector: 'app-tabularfinder',
    templateUrl: './tabularabmfinder.component.html',
  })

  export class TabularABMFinderComponent  implements OnInit, OnChanges {
    @Input('campos') campos: FinderDTO[];
    @Input('busquedaAlmacenada') busquedaAlmacenada: any;

    @Output()find = new EventEmitter<any>();
    @ViewChild('idTextBusqueda') input: ElementRef;

    // tslint:disable-next-line:member-ordering
    finderTabular: any;

    constructor() {
      console.log('constructor');
     }
     ngOnChanges(): void {
    }

   ngOnInit() {
    console.log('los campos del finder');
    console.log(this.campos);
    console.log('la busqueda almacenada');
    console.log(this.busquedaAlmacenada);
    const dataFilter = {} as FinderDTO;

    this.finderTabular = {'campoBusqueda': dataFilter, 'busqueda': ''};
    this.finderTabular.campoBusqueda = this.campos[0];
    this.finderTabular.busqueda = '';
    if ( this.busquedaAlmacenada.campoBusqueda) {
      this.finderTabular.busqueda = this.busquedaAlmacenada.busqueda;
      for ( const c of this.campos) {
        if (c.atribute === this.busquedaAlmacenada.campoBusqueda.atribute) {
          this.finderTabular.campoBusqueda = c;
          break;
        }

      }
     }
    //this.input.nativeElement.focus();
  }

      buscar() {
        if(this.finderTabular.campoBusqueda ===undefined){
          this.finderTabular.campoBusqueda = this.campos[0];
        }
        this.find.emit(this.finderTabular);
      }
  }
