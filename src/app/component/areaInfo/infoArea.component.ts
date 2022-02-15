import { Component, Input} from '@angular/core';
import { Subscription } from 'rxjs';
import { FormdataReportdef } from 'src/app/_models/formdata';
import { NameGlobalService } from 'src/app/_services/nameGlobalService';

@Component({
  selector: 'app-infoarea',
  templateUrl: './infoAreaComponent.html',
})
export class InfoAreaComponent   {


  public data: DataUsuario = {
    name: 'Sin Seleccion',
    info: 'no hay informacion que mostrar',
    labelButton: 'Agregar',
    dataSeleccion: false
  };
  private nameRef: Subscription = null;
  constructor(private nameGlobalService: NameGlobalService) {
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {

      this.nameRef.unsubscribe();
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {

      // this.nameGlobalService.setearNameGlobal('SIN SELECCION', '');

    const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
    console.log(formdataGlobales);
    const name = localStorage.getItem('tabInformationName');
    const body = localStorage.getItem('tabInformationBody');

    console.log('name');
    console.log('body');
    console.log(name);
    console.log(body);

    if (name && body) {
      this.data.name = name;
      this.data.info = body;
      console.log('seteo el globalSerice');
    } else {
      this.data.name = 'SIN SELECCION';
      this.data.info = 'no hay informacion que mostrar';
    }

    this.nameRef = this.nameGlobalService.nameChanged$.subscribe(() => {
      this.data.name = this.nameGlobalService.getName();
      this.data.info = this.nameGlobalService.getDetalle();
      this.data.dataSeleccion = true;
    });
  }

}
export interface DataUsuario {
  name: string;
  info: string;
  labelButton: string;
  dataSeleccion: boolean;
}
