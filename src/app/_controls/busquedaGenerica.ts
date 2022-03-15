import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FinderParamsDTO } from '../_models/finderParamsDTO';
import { inicializarFinder } from '../pages/genericFinder/utilFinder';
import { FormdataReportdef } from '../_models/formdata';
import { FrontEndConstants } from '../constans/frontEndConstants';
import { AbmService } from '../_services/abmService';
import { GenericFinderService } from '../pages/genericFinder/genericFinder.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ParametrosExecuteMethodRequestDTO } from '../_models/parametrosExecuteMethodRequestDTO';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-busquedagenerica',
    templateUrl: './busquedaGenerica.html',
    styleUrls: ['./busquedaGenerica.scss'],
    styles: [
        `
        .breadcrumb{
            background-color:#ffffff;
        } `
      ],
      providers: [MessageService]

})
export class BusquedaGenericaComponent {
    @Input() field: FormdataReportdef;
    @Input() form: FormGroup;
    @Input() dataForm: FormdataReportdef[];
    @Input() mobile: boolean;
    results: any[];

    spinner:boolean;

    get isValid() { return this.form.controls[this.field.name].valid; }
    get isDirty() { return this.form.controls[this.field.name].dirty; }
    constructor(
        private abmservice: AbmService,  private messageService: MessageService,
        private genericFinderService: GenericFinderService, private router: Router
        ) {
            this.spinner = false;
    }
    public onSelect(event) {
        const valueAutocomplete = event.split('-');
         // la primera parte es el id de la entidad
         this.field.valueNew = valueAutocomplete[0];
    }

    public buscar(event) {
        console.log('buscar');
         // this.loadSpinner.show();
         this.spinner = true;

        let unSoloRegistro = false;
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
                      const value = this.mobile?event.query:this.form.controls[this.field.name].value;
                      paramContenido.valueNew = value ? value : '';
                      finder.finderGenericDTO.parametrosFinderMetodo.push(paramContenido);
                    } else {
                        // busco en el dataFORM
                        let encontrado = false;
                        for (const p of  this.dataForm) {
                            if (p.entity && !p.buttom &&  (s.toUpperCase() ===  p.name.toUpperCase()
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
                            for (const g of  formdataGlobales['list']) {
                                if (!g.button && s.toUpperCase() ===  g.name.toUpperCase()) {
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

        let valueBG = null;
        if(this.mobile){
            valueBG = event.query; 

        }else{
            valueBG = this.form.controls[this.field.name].value; 
        }
        if (valueBG !== null && valueBG.trim() !== '' ) {
            finder.finderGenericDTO.atribute = this.field.busquedaGenericaDTO.typeFindBy;
            finder.finderGenericDTO.type = this.field.busquedaGenericaDTO.typeFindByType;
            if (finder.finderGenericDTO.type === FrontEndConstants.JAVA_LANG_LONG) {
                finder.finderGenericDTO.value = valueBG;
            } else {
                    if (this.field.busquedaGenericaDTO.findStringEqual) {
                        finder.finderGenericDTO.value = valueBG;
                    } else {
                        finder.finderGenericDTO.value = '%' + valueBG + '%';
                    }
            }
        } else {
            finder.finderGenericDTO.atribute = null;
            finder.finderGenericDTO.type = null;
            finder.finderGenericDTO.value = null;
        }
    
    const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
        finder.listGlobales =  formdataGlobales['list'];
        console.log('la dependencia');
        console.log(this.field.dependenciaDTO);
        if (this.field.dependenciaDTO && this.field.dependenciaDTO.length > 0) {
            // hay dependencia!
            for (const f of this.dataForm) {
                for (const d of this.field.dependenciaDTO) {
                    if ( d.nombreParam === f.name ) {
                        f.idNameFilterDependence = d.atributoDependiente;
                        finder.finderGenericDTO.filtrosDependencia.push(f);
                        break;
                    }
                }
            }
        }
        this.abmservice.consultarAbmGeneric(user, finder).subscribe(
            (result: any) =>{
                // this.loadSpinner.hide();
                let valor = '';

                if(this.mobile){
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
                    }
                }else{

                this.spinner = false;

                if (result['data'] && result['data'].length === 1) {
                    unSoloRegistro = true;
                    const stringLabel = this.devuelveStringLabelFila(result, result['data']);
                    this.form.controls[this.field.nameRes].setValue(stringLabel);
                    this.field.busquedaGenericaDTO.mostrarToStringLupa = stringLabel;
                     const pos = result['pkColIndex'];
                    this.field.valueNew = result['data'][0][pos].value;
                    if (this.field.busquedaGenericaDTO.metodoNombrePostFinder) {
                        this.preseteoCampos(this.field.busquedaGenericaDTO.metodoNombrePostFinder,
                            this.field.busquedaGenericaDTO.parametrosLlamadaPostMetodo);
                    }
                } else {
                        this.genericFinderService.confirm('buscar  ' + this.field.label  , result, null, null, finder,
                        result['finderDTOs'], this.field.busquedaGenericaDTO.findStringEqual, this.form.controls[this.field.name].value, result['columns'])
                    .then((fila) => {
                        if (fila === false) {
                           // apreto el boton cancelar
                           return;
                        }
                      if (fila['sinSeleccion']) {
                          this.borrar(null);
                          return;
                      }
                        const stringLabel = this.devuelveStringLabelFilaTabla(result, fila);
                        this.form.controls[this.field.nameRes].setValue(stringLabel);
                        this.field.busquedaGenericaDTO.mostrarToStringLupa = stringLabel;
                        const pos = result['pkColIndex'];
                        let j = 0;
                        // tslint:disable-next-line:forin
                        for ( const i in fila) {
                            if ( j === pos) {
                                this.field.valueNew = fila[i];
                                break;
                            }
                            j++;
                        }
                        if (this.field.busquedaGenericaDTO.metodoNombrePostFinder) {
                            this.preseteoCampos(this.field.busquedaGenericaDTO.metodoNombrePostFinder,
                                this.field.busquedaGenericaDTO.parametrosLlamadaPostMetodo);
                        }
                    });

                }
            }

        },
        (err: HttpErrorResponse) => {

            this.checkError(err);
      }
        );
    }
    public borrar(event) {
    // elimina el valor del componente
        this.form.controls[this.field.nameRes].setValue('');
        this.field.valueNew = null;
        this.field.busquedaGenericaDTO.mostrarToStringLupa = '';

    }

    private preseteoCampos(metodo: string, campos: string []) {
        // este metodo lo que hace es setear otros campos del formulario
        const listParam = [];
        const user = JSON.parse(localStorage.getItem('currentUser'));

        for (const p of campos) {
            if (p === this.field.name) {
                listParam.push(this.field);
                continue;
            }
            // falta implementar cuando paso datos que no son entidades y que fueron modificados en el formulario
            // tambien cuando son abm con hijos
            for (const param of this.dataForm) {
                if (p === param.name) {
                    listParam.push(param);
                    break;
                }
            }
            const dataMetodo = {} as ParametrosExecuteMethodRequestDTO;
            // tslint:disable-next-line:prefer-const
            dataMetodo.list = listParam;
            dataMetodo.pdf = false;
            dataMetodo.metodo = metodo;
            this.abmservice.preseteoCampos(user, dataMetodo).subscribe(
                result  => {
                    // aca preseteo los campos que correspondan
                    console.log('preseteo campos');
                    console.log(result);
                    for (const param of result['list']) {
                        if (param.name === this.field.name) {
                            continue;
                        }
                        for (const param2 of this.dataForm) {
                            if (param.name === param2.name) {
                                this.form.controls[param.name].setValue(param.value);
                                break;
                            }
                        }
                    }
                },
                (err: HttpErrorResponse) => {
                    this.checkError(err);
              }
            );

        }

    }
    private devuelveValue(pkcolindex) {
        return pkcolindex;
    }

    private devuelveStringLabelFilaTabla(data, fila) {
        let label = '';
        const rowLabel = data['rowLabel'];

        const labelArray = rowLabel.split(',');
        let encontrado = false;
        let pos = 0;
        // tslint:disable-next-line:forin
        for (const j in labelArray) {

            for ( const i in data['columns']) {
                if (data['columns'][i].name === labelArray[j] ) {
                    encontrado = true;
                    // tslint:disable-next-line:radix
                    pos = parseInt(i);
                    let pos2 = 0;
                    console.log('encontrado header:  ' + labelArray[j] );

                    // tslint:disable-next-line:forin
                    for ( const h in fila) {
                      // tslint:disable-next-line:radix
                        // tslint:disable-next-line:radix
                        if (pos === pos2) {
                            label = label + ' ' +  fila[h];
                            // console.log('retorna');
                            console.log('encontrado value:  ' + fila[h] );
                      }
                      pos2++;
                    }
                    break;
                }
            }
            if (!encontrado) {
                label = label + labelArray[j];
            }
            encontrado = false;
        }
    // tslint:disable-next-line:forin
    console.log('label final :  ' + label );

        return label;
    }

    private devuelveStringLabelFila(data, fila) {

        let label = '';
        const rowLabel = data['rowLabel'];

        const labelArray = rowLabel.split(',');
        let encontrado = false;

        let pos = 0;
        // tslint:disable-next-line:forin
        for (const j in labelArray) {
            for ( const i in data['columns']) {
                if (data['columns'][i].name === labelArray[j] ) {
                    // tslint:disable-next-line:radix
                    pos = parseInt(i);
                    encontrado = true;
                    label =  fila[0][pos].value;
                    break;
                }
            }
            if (!encontrado) {
                label = label + labelArray[j];
            }
            encontrado = false;
            return label;

        }
    }
    private checkError(error: any ) {
       //  this.loadSpinner.hide();

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
