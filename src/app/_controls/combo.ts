import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormdataReportdef } from '../_models/formdata';
import { AbmService } from '../_services/abmService';
import { FinderParamsDTO } from '../_models/finderParamsDTO';
import { inicializarFinder } from '../pages/genericFinder/utilFinder';
import { HttpErrorResponse } from '@angular/common/http';
import { ItemComboBoxDTO } from '../_models/itemComboBoxDTO';
import { ParametrosExecuteMethodRequestDTO } from '../_models/parametrosExecuteMethodRequestDTO';


@Component({
    selector: 'app-combo',
    templateUrl: './combo.html'


})
export class ComboComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;
    @Input() elindex: any;
    @Input() esambula: number;
    @Input() dataForm: FormdataReportdef[];

    constructor(private abmService: AbmService) {
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        console.log('combo inicilializado');
    }


    preseteoCampos(metodo: string, campos: string []) {
        // este metodo lo que hace es setear otros campos del formulario
        const listParam = [];
        const user = JSON.parse(localStorage.getItem('currentUser'));

        for (const p of campos) {
            if (p === this.field.name) {
                this.field.valueNew = this.form.controls[p].value;

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
            this.abmService.preseteoCampos(user, dataMetodo).subscribe(
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
                    console.log('error actualizando combo');
              }
            );

        }

    }



    onChange(event) {

        if (this.field.busquedaGenericaDTO.metodoNombrePostFinder) {
            this.preseteoCampos( this.field.busquedaGenericaDTO.metodoNombrePostFinder,
                this.field.busquedaGenericaDTO.parametrosLlamadaPostMetodo);
        }

        if (this.field.dependenciaComboDTO && this.field.dependenciaComboDTO.nombreParam) {
            // si es asi debo llamar al metodo que hace cambiar al combo relacionado
            const listParam: FormdataReportdef[] = [];
            for (const p of this.field.dependenciaComboDTO.parametrosLlamadaMetodo) {
                for (const param of this.dataForm) {
                   if (p === param.name) {
                        if (p === this.field.name) {
                            param.valueNew = this.form.controls[p].value;
                            listParam.push(param);
                            continue;
                        } else {
                            listParam.push(param);
                        }
                   }
                }
            }
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const finder = {} as FinderParamsDTO;
            inicializarFinder(finder);
            finder.methodName = this.field.dependenciaComboDTO.metodo;
            finder.finderGenericDTO.parametrosFinderMetodo = listParam;
            finder.typeMethodFinder = true;
            this.abmService.consultarAbmGeneric(user, finder).subscribe(
                result => {
                    console.log(result);
                    for (const param of this.dataForm) {
                        if (this.field.dependenciaComboDTO.nombreParam === param.name) {
                            param.comboDTO.comboBoxDTO = [];

                            if (result['data'] && result['data'].length > 0) {
                                let i = 0;
                                for (const ite of result['data']) {
                                    const item = {} as ItemComboBoxDTO;
                                    item.id = ite[0].value;
                                    item.value = ite[1].value;
                                    param.comboDTO.comboBoxDTO.push(item);
                                    if (param.comboDTO.posicionCombo != null && param.comboDTO.posicionCombo !== undefined
                                        && i === param.comboDTO.posicionCombo ) {
                                        this.form.controls[param.name].setValue(item.id);
                                    }
                                    console.log(item);
                                    i++;
                                }
                            }
                            break;
                        }
                    }
                },
                (err: HttpErrorResponse) => {
                    console.log('error actualizando combo');
              }
              );
      }
    }

}
