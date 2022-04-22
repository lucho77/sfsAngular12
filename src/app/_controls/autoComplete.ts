import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormdataReportdef } from '../_models/formdata';
import { AbmService } from '../_services/abmService';
import { Router } from '@angular/router';
import { FinderParamsDTO } from '../_models/finderParamsDTO';
import { inicializarFinder } from '../pages/genericFinder/utilFinder';
import { FrontEndConstants } from '../constans/frontEndConstants';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-autocomplete',
    templateUrl: './autoComplete.html',
    styleUrls: ['./autoComplete.scss'],

    providers: [MessageService]

})
export class AutocompleteComponent {

    @Input() field: FormdataReportdef;
    @Input() form: FormGroup;
    @Input() dataForm: FormdataReportdef[];
    results: any[];
    name: string;
    spinner:boolean;

    get isValid() { return this.form.controls[this.field.name].valid; }
    get isDirty() { return this.form.controls[this.field.name].dirty; }
    constructor(
        private abmservice: AbmService, private messageService: MessageService,
        private  router: Router) {
            this.spinner = false;
        }
    public buscar(event) {
        this.spinner = true;

        let valor = '';
        console.log('buscar');
        const user = JSON.parse(localStorage.getItem('currentUser'));
        // console.log(this.form.controls[this.field.name].value.trim());
        const finder = {} as FinderParamsDTO;
        inicializarFinder(finder);
        finder.entityClass = this.field.type;
        finder.viewName = this.field.busquedaGenericaDTO.view;
        if (this.field.busquedaGenericaDTO.metodoNombre !== null) {
            finder.typeMethodFinder = true;
            finder.methodName = this.field.busquedaGenericaDTO.metodoNombre;
            if (this.field.busquedaGenericaDTO.parametrosLlamadaMetodo &&
                this.field.busquedaGenericaDTO.parametrosLlamadaMetodo.length > 0 ) {
                    console.log('busco los parametros');
                    console.log(this.dataForm);
                for (const s of  this.field.busquedaGenericaDTO.parametrosLlamadaMetodo) {
                    console.log('s');
                    console.log(s);
                    if (s.toUpperCase() ===  FrontEndConstants.PARENT) {
                        // esto es hay que buscar el parametro padre
                        const pParent = JSON.parse(localStorage.getItem('paramParent')) as FormdataReportdef;
                        finder.finderGenericDTO.parametrosFinderMetodo.push(pParent);
                        continue;
                    }
                    if (s.toUpperCase() ===  FrontEndConstants.CONTENIDO) {
                        const paramContenido = {} as FormdataReportdef;
                      paramContenido.name = 'P1';
                      paramContenido.text = true;
                      paramContenido.type = FrontEndConstants.JAVA_LANG_STRING;
                      const value = event.query;
                      paramContenido.valueNew = value ? value : '';
                      finder.finderGenericDTO.parametrosFinderMetodo.push(paramContenido);
                    } else {
                        // busco en el dataFORM
                        let encontrado = false;
                        for (const p of  this.dataForm) {
                            if (!p.buttom &&  (s.toUpperCase() ===  p.name.toUpperCase()
                             || s.toUpperCase() ===  p.attribute.toUpperCase()) ) {
                                finder.finderGenericDTO.parametrosFinderMetodo.push(p);
                                encontrado = true;
                                break;
                            }
                        }
                        if (!encontrado) {
                            // busco en los globales
                            // tslint:disable-next-line:no-shadowed-variable
                            const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
                            console.log('formdataGlobales');
                            console.log(formdataGlobales);
                            for (const g of  formdataGlobales) {
                                if (!g.buttom && s.toUpperCase() ===  g.name.toUpperCase()) {
                                    finder.finderGenericDTO.parametrosFinderMetodo.push(g);
                                    encontrado = true;
                                    break;
                                }
                            }
                        }
                    }
            }
            // meto los parametros
            console.log('finder.finderGenericDTO.parametrosFinderMetodo');
            console.log(finder.finderGenericDTO.parametrosFinderMetodo);
        }
        }
        finder.nameParam = this.field.name;
        finder.globalParam = this.field.busquedaGenericaDTO.globalParam;
        if (event.query !== null && event.query !== '' ) {
            finder.finderGenericDTO.atribute = this.field.busquedaGenericaDTO.typeFindBy;
            finder.finderGenericDTO.type = this.field.busquedaGenericaDTO.typeFindByType;
            if (finder.finderGenericDTO.type === FrontEndConstants.JAVA_LANG_LONG) {
                finder.finderGenericDTO.value = event.query;
            } else {
                    if (this.field.busquedaGenericaDTO.findStringEqual) {
                        finder.finderGenericDTO.value = event.query;
                    } else {
                        finder.finderGenericDTO.value = '%' + event.query + '%';
                    }
            }
        } else {
            finder.finderGenericDTO.atribute = null;
            finder.finderGenericDTO.type = null;
            finder.finderGenericDTO.value = null;
        }


        this.abmservice.consultarAbmGeneric(user, finder).subscribe(
            (result: any) =>  {
                this.spinner = false;

                console.log(result);
                this.results = [];
                const pos = result['pkColIndex'];
                const rowLabel = result['rowLabel'];
                const labelArray = rowLabel.split(',');

                for (const i in result.data) {

                    const value = result.data[i][pos].value;
                    let cont = 0;
                    let pos2 = 0;
                    // tslint:disable-next-line:forin
                    for (const j in labelArray) {
                        for ( const h in result['columns']) {
                            if (result['columns'][h].name === labelArray[j] ) {
                                // tslint:disable-next-line:radix
                                pos2 = parseInt(h);
                                break;
                            }
                        }
                        const l = result.data[i][pos2].value;
                            valor = value.toString() + '-' + l.toString();
                        cont++;
                    }
                    this.results.push(valor);

                    // this.results.push(valor);
                }
                console.log(this.results);
        },
        (err: HttpErrorResponse) => {

            this.checkError(err);
      }

        );

        // this.spinner.emit(true);
         console.log(event);
    }

    public onSelect(event) {
        const valueAutocomplete = event.split('-');
         // la primera parte es el id de la entidad
         this.field.valueNew = valueAutocomplete[0];
    }

    private checkError(error: any ) {
        this.spinner = false;

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
