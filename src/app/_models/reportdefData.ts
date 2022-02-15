
export class ReportdefData {
   form: boolean;
   tabular: boolean;
   tabularAbm: boolean;
   formAbmNew: boolean;
   formAbmEdit: boolean;
   formHijo: boolean;
   menu: boolean;
   cargando: boolean;
   mostrarInfoArea: boolean;
   responsive: boolean;
   constructor(form: boolean, tabular: boolean, tabularAbm: boolean,
      formAbmNew: boolean, formAbmEdit: boolean, formHijo: boolean,  menu: boolean, cargando: boolean, mostrarInfoArea: boolean,
       responsive: boolean) {
       this.form = form;
       this.tabular = tabular;
       this.tabularAbm = tabularAbm;
       this.formAbmNew = formAbmNew;
       this.formAbmEdit = formAbmEdit;
       this.formHijo = formHijo;
       this.menu = menu;
       this.cargando = cargando;
       this.mostrarInfoArea = mostrarInfoArea;
       this.responsive = responsive;
   }
}
