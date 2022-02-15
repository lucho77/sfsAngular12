import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenericFinderComponent } from './pages/genericFinder/genericFinder.component';
import { BusquedaGenericaComponent } from './_controls/busquedaGenerica';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, NgbModule, ProgressSpinnerModule
    ],
    declarations: [
        BusquedaGenericaComponent, GenericFinderComponent,
    ],
    entryComponents: [  GenericFinderComponent ],
    exports: [BusquedaGenericaComponent]

  })
  export class BusquedaGenericaModule {
  }
