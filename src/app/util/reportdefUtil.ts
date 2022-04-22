import { FinderRequestDTO } from "../_models/finderRequestDTO";
import { FormdataReportdef } from "../_models/formdata";
import { Historico } from "../_models/historico";
import { MetodoDTO } from "../_models/metodoDTO";
import { ReportdefData } from "../_models/reportdefData";
import { LinkedList } from 'linked-list-typescript';
import { FrontEndConstants } from "../constans/frontEndConstants";
import { NameGlobalService } from "../_services/nameGlobalService";
import { FormReportdef } from "../_models/form";
import { ReportdefService } from "../_services/reportdef.service";
import { ParametrosExecuteMethodRequestDTO } from "../_models/parametrosExecuteMethodRequestDTO";
import { ReportMethodResponseDTO } from "../_models/reportMethodResponseDTO";
import { ParamAllRequestDTO } from "../_models/paramAllRequestDTO";
import { NameParamDTO } from "../_models/nameParamDTO";
import { HttpErrorResponse } from "@angular/common/http";
import { ParamRequestDTO } from "../_models/paramRequestDTO";

export function inicializarHistorico(historico: Historico, metadata: MetodoDTO,
    repordef: ReportdefData, listRequest: FormdataReportdef[], listParamOwner: FormdataReportdef[], menu: boolean,
    finder: FinderRequestDTO, paramListABM: FormdataReportdef[]) {
    historico.metadata = metadata;
    historico.repordef = repordef;
    historico.listRequest = listRequest;
    historico.listParamOwner = listParamOwner;
    historico.menu = menu;
    historico.finderRequestABM = finder;
    historico.listParamABM = paramListABM;
}

export function actualizaDatosGlobales(datos: FormdataReportdef[], parametroGlobalInfo: string) {
  let g = localStorage.getItem('paramGlobal');

  if(g){
    const formdataGlobales = <FormdataReportdef[]>JSON.parse(g);
    let resultado = 'sin selección';
    console.log('datos');
    console.log(datos);
    for (const f of datos) {
      for (const global of formdataGlobales) {
        if ((f.name === global.name)  && global.name === parametroGlobalInfo) {
          global.value = f.valueNew;
          global.valueNew = f.valueNew;
          global.busquedaGenericaDTO.mostrarToStringLupa = f.busquedaGenericaDTO.mostrarToStringLupa;
          if (global.busquedaGenericaDTO.mostrarToStringLupa) {
            resultado =  global.busquedaGenericaDTO.mostrarToStringLupa;
          }
        } else if (f.name === global.name &&  global.name !== parametroGlobalInfo) {
          console.log(f.name + 'actualizado');
          global.value = f.valueNew;
          global.valueNew = f.valueNew;
          if (f.entity) {
              global.busquedaGenericaDTO.mostrarToStringLupa = f.busquedaGenericaDTO.mostrarToStringLupa;
          }
      }
  }

  }

  console.log('formdataGlobales actualizado');
  console.log(formdataGlobales);

  localStorage.setItem('paramGlobal', JSON.stringify(formdataGlobales));
  console.log('FINNNNNNNNNNNNNNNNN');
  return resultado;
}
}

export function prepararParametrosApasar(repordefData: ReportdefData, metadata: MetodoDTO,
    list: FormdataReportdef[], historicos: LinkedList<Historico>, globales: FormdataReportdef[]) {
        // tslint:disable-next-line:prefer-const
        let paramNoEncontrados: string[] = [];
        // tslint:disable-next-line:prefer-const
        let listNew: FormdataReportdef[] = [];
        let listAux: FormdataReportdef[] = [];
        let encontrado = false;
         if ( metadata.aditionalColumn) {
                // hasta ahora el aditionalColumn sirve con un solo parametro,
                // es para los tabularABm que se le quiera adosar una columna
                // ver de implementar con más de un parametro
                // Corregido 30-08-2019 --> pueden ser multiples parametros
                if (metadata.objeto) {
                  listNew.push(metadata.objeto);
                } else {
                  listNew = metadata.objetoEvento;
                }
                // los que tienen actualizar true debo buscar su valor en el historico
                if (listNew.length === 1) {
                  // si es un solo parametro lo devuelvo, se entiende que no debo buscarlo del historico
                  return listNew;
                }
                for (const p of listNew) {
                  if (p.actualizar) {
                      const paramAux: FormdataReportdef[] =  buscarParametro(p.name, historicos, globales);
                      p.valueNew = paramAux[0].valueNew;
                      p.value = paramAux[0].valueNew;
                      p.valueOld = paramAux[0].valueNew;
                  }
                }
                return listNew;
         }
         if ( metadata.clickFilaTabular) {
            for (const p of metadata.objetoEvento ) {
                listNew.push(p);
            }

         }
         if (metadata.accionParam !== null) {
          listNew.push(metadata.accionParam);
         }
        for (const clave of Object.keys(metadata.paramsPasar)) {
            // veo que no este en listNew
            encontrado = false;
            let estaEnListNew = false;
            for (const p of listNew) {
                    if (p.name === clave) {
                        estaEnListNew = true;
                        break;
                    }
            }
            if (estaEnListNew) {
                continue;
            }
            if (list !== null) {
              for (let j = 0; j < list.length; j++) {
                if (!list[j].buttom &&  clave.trim() === list[j].name.trim()) {
                    encontrado = true;
                    listNew.push(list[j]);
                            break;
                }
              }

            }
            if (!encontrado) {
                paramNoEncontrados.push(clave.trim());
            }
        }
        if ( paramNoEncontrados.length > 0 ) {
              listAux = buscarParametros(paramNoEncontrados, historicos, globales);
              listNew = listNew.concat(listAux);
              console.log('listNew Antes');
              console.log(listNew);
        }

        // me fijo en el orden

        const listOrder = [];
        for (const clave of Object.keys(metadata.paramsPasar)) {
          for (const p of listNew) {
            if (clave === p.name) {
              listOrder.push(p);
            }
          }
        }
        return listOrder;
    }
    export function prepararRequestABMedit( metadata: MetodoDTO) {
    }

    export function buscarParametro( parametro:  string, historicos: LinkedList<Historico>, globales: FormdataReportdef[] ) {
        const parametros = [];
        parametros.push(parametro);
        return buscarParametros(parametros, historicos, globales);
    }

    export function buscarParametrosEnHistoricos(count: number, parametros:  string[],
        historicos: LinkedList<Historico>, globales: FormdataReportdef[]) {

          const listNew: FormdataReportdef[] = [];
          const paramNoEcontrados = [];
          if (count > 0 ) {
            count--;
            let encontrado = false;
            const itera: any = historicos.toArray();
        // tslint:disable-next-line:forin
            for (const param in parametros) {
              encontrado = false;

                for (let j = count; j > -1; j--) {
                  if (encontrado) {
                    break;
                  }
                    // recorro la pila al revez para ir sacando los parametros
                   // tslint:disable-next-line:prefer-const
                   const historico = itera[j] as Historico;
                   if (historico.repordef.form) {
                       if (historico.listParamOwner) {
                        for (const p of historico.listParamOwner) {
                            if (p && p.name === parametros[param]) {
                                encontrado = true;
                                listNew.push(p);
                                break;
                            }
                       }
                       }
                   } else if (historico.repordef.tabular) {
                     if (historico.listRequest) {
                        for (const p of historico.listRequest) {
                            if ( p && p.name === parametros[param]) {
                                encontrado = true;
                                listNew.push(p);
                                break;
                            }
                       }

                     }
                   } else if (historico.repordef.tabularAbm) {
                    if (historico.listRequest) {
                        for (const p of historico.listRequest) {
                          if (p && p.name === parametros[param]) {
                              encontrado = true;
                              listNew.push(p);
                              break;
                          }
                        }
                    }
                  if (!encontrado) {
                      if (historico.listParamABM) {
                          for (const p of historico.listParamABM) {
                            if (p && p.name === parametros[param]) {
                                encontrado = true;
                                listNew.push(p);
                                break;
                            }
                          }
                      }
                  }
                } else if (historico.repordef.formAbmEdit || historico.repordef.formHijo ) {
                    if (historico.listParamOwner) {
                        for (const p of historico.listParamOwner) {
                        if (p && p.name === parametros[param]) {
                            encontrado = true;
                            listNew.push(p);
                            break;
                        }
                    }
                    }

                    break;
                   }
                }
                if (!encontrado) {
                  paramNoEcontrados.push(parametros[param]);
                }

            }
        } else {
          // ESTO ES horrible
          for (const p of parametros) {
            paramNoEcontrados.push(p);
           }
        }

        if (paramNoEcontrados.length > 0 ) {
            // busco en los globales
            // tslint:disable-next-line:forin
            let enc = false;
            for (const param of paramNoEcontrados) {
              enc = false;
              if (globales !== null && globales.length > 0 ) {

              for (const g of globales) {
                    console.log(g);
                    if (param === g.name) {
                        enc = true;
                        listNew.push(g);
                        break;
                    }
                }
              }
              if (!enc && param === FrontEndConstants.P_LIST_ID.toUpperCase() ) {
                          const p = crearParametro(FrontEndConstants.P_LIST_ID, FrontEndConstants.JAVA_LANG_LONG, null);
                          p.lista = true;
                          listNew.push(p);
                          console.log('listNew');
                          console.log(listNew);
                                  }

            }
        }

    return listNew;


    }

    export function buscarParametros( parametros:  string[], historicos: LinkedList<Historico>, globales: FormdataReportdef[] ) {

        // tslint:disable-next-line:forin
        const count = historicos.length - 1; // esto es porque no quiero ver el ultimo historico que ya lo procese
        return buscarParametrosEnHistoricos(count, parametros, historicos, globales);
    }
    export function seteoParamGlobal(event: MetodoDTO, reportdefService: ReportdefService,
        nameService: NameGlobalService, datos: FormReportdef, esTabular: boolean, listTabular: FormdataReportdef[]): Promise<boolean> {
        return new Promise<boolean>( (resolve, reject) => {
            // ejecuto el metodo que me trae
            const user = JSON.parse(localStorage.getItem('currentUser')||'{}');
            console.log('event.tipoMetodo.toLocaleUpperCase()');
            console.log(event.methodName.toLocaleUpperCase());

            if (event.methodName.toLocaleUpperCase() === FrontEndConstants.SETEO_COMENTARIO) {
              console.log('seteo comentario');
              console.log(listTabular);
                  actualizarSetearGlobal(event, listTabular, user, nameService, null, reportdefService, listTabular)
                .then( (resp) => resolve(true))
                .catch( error => reject(error));

                return;
            }
            const data = {} as ParametrosExecuteMethodRequestDTO;
            // tslint:disable-next-line:prefer-const
            // this.loadSpinner = true;
              data.list = [];
              if (esTabular) {
                for (const clave of Object.keys(event.paramsPasar)) {
                    for (const p of listTabular) {
                      if (p.name === clave.toString()) {
                        data.list.push(p);
                        break;
                      }
                    }
                  }
              } else {
                for (const clave of Object.keys(event.paramsPasar)) {
                    for (const p of datos.list) {
                      if (p.name === clave.toString()) {
                        data.list.push(p);
                        break;
                      }
                    }
                  }
              }
            data.pdf = false;
            data.metodo = event.methodName;

            reportdefService.postExecuteMethod(user, data).subscribe
            ((result: ReportMethodResponseDTO) => {
              // this.loadSpinner = false;
              const arrayAux: any[] = [];
              if (result.valor) {
                const parametros = result.valor.split(',');
                 for (const p of parametros ) {
                  const paramParte = p.split('=');
                  const p1 = {'name': paramParte[0], 'id': paramParte[1] };
                  arrayAux.push(p1);
                 }
              }
              const  paramRequest = {} as ParamAllRequestDTO;
              paramRequest.list = [];

              for (const p of arrayAux) {
                const  paramName = {} as NameParamDTO;
                paramName.name = p.name;
                paramRequest.list.push(paramName);
              }
              let listParam: any[] = [];
              if (esTabular) {
                listParam = listTabular.concat(listTabular);
              } else {
                listParam = datos.list.concat (datos.list);
              }
              console.log('listParam');
              console.log(listParam);
              if (arrayAux.length > 0 ) {

                  reportdefService.consultarAllParamByName(user, paramRequest).subscribe(
                    resultP=> {
                      for (const f of resultP) {
                        for (const p of arrayAux) {
                        if (p.name === f.name ) {

                          if (!p.id || p.id === '' ) {
                            f.valueNew = null;
                          } else {
                           f.valueNew = p.id;
                          }
                          listParam.push(f);
                          break;
                        }
                      }
                    }
                    actualizarSetearGlobal(event, listParam, user, nameService, datos, reportdefService, listTabular)
                .then( (resp) => resolve(true))
                .catch( error => reject(error));
              },
              (err: HttpErrorResponse) => {
                reject(err);
            });
            } else {
              actualizarSetearGlobal(event, listParam, user, nameService, datos, reportdefService, listTabular)
              .then( (resp) => resolve(true))
              .catch( error => reject(error));
            }

            }, (err: HttpErrorResponse) => {
                reject(err);
                }
               );
            });
          }
           export function actualizarSetearGlobal(event: MetodoDTO, listParam: FormdataReportdef[],
            user: any, nameService: NameGlobalService, datos: FormReportdef, reportdefService: ReportdefService,
            listTabular: FormdataReportdef[]): Promise<boolean> {
                return new Promise<boolean>( (resolve, reject) => {
                  console.log('event');
                  console.log(event);
                    actualizarDatosGlobales(listParam, nameService, event.paramSolapa);
                    // this.toastrService.success('parametro global seteado exitosamente');
            if (event.metodoDTO && event.metodoDTO.tipoMetodo) {
              // ejecuto la accion por ahora es un metodo de logica
            if (event.metodoDTO.tipoMetodo.toUpperCase() === FrontEndConstants.LOGICA.toUpperCase()) {
              const dataDetalle = {} as ParametrosExecuteMethodRequestDTO;
              // tslint:disable-next-line:prefer-const
                dataDetalle.list = [];
               for (const clave of Object.keys(event.metodoDTO.paramsPasar)) {
                let encontrado = false;
                console.log('datos');
                console.log(datos);
                if (datos) {
                    for (const p of datos.list) {
                        if (!p.buttom && p.name.trim() === clave.toString().trim()) {
                          encontrado = true;
                          dataDetalle.list.push(p);
                          break;
                        }
                      }
                } else {
                    for (const p of listTabular) {
                        if (p.name === clave.toString()) {
                          encontrado = true;
                          dataDetalle.list.push(p);
                          break;
                        }
                      }
                }
                if (!encontrado) {
                  // busco en los globales
                  console.log('clave a buscar ' + clave.toString());
                  const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
                  for (const g of formdataGlobales) {
                        if (g.name.trim() === clave.toString().trim()) {
                        encontrado = true;
                        dataDetalle.list.push(g);
                        break;
                      }
                  }
                }
              }
              dataDetalle.pdf = false;
              dataDetalle.metodo = event.metodoDTO.methodName;
              reportdefService.postExecuteMethod(user, dataDetalle).subscribe(
                (resultDetalle: ReportMethodResponseDTO) => {
                  localStorage.setItem('tabInformationBody', resultDetalle.valor);
                  nameService.setearNameGlobal(null, resultDetalle.valor);
                  resolve(true);
            }
            , (err: HttpErrorResponse) => {
                reject(err);
              }
           );


            }
        }
        });

    }

    export function actualizarDatosGlobales(data: FormdataReportdef[], nameService: NameGlobalService, parametroGlobalInfo: string) {
        console.log('antes de llamar a  actualizaDatosGlobales');
        console.log(data);
        const name =  actualizaDatosGlobales(data, parametroGlobalInfo);
        console.log('Nombre');
        console.log(name);
        localStorage.setItem('tabInformationName', name);
        nameService.setearNameGlobal(name, null);

      }

      export function crearParametro(name: string, type: string, value: any) {

        const param = {} as  FormdataReportdef;
        param.entero = true;
        param.name = name;
        param.type  = type;
        param.valueNew = value;
        param.value = value;
        return param;
      }


      export function ejecutarMetodo( methodName: string, pdf: boolean, listParam: FormdataReportdef[],
        reportdefService: ReportdefService ): Promise<ReportMethodResponseDTO> {
        return new Promise<ReportMethodResponseDTO>( (resolve, reject) => {{

          const dataMetodo = {} as ParametrosExecuteMethodRequestDTO;
          // tslint:disable-next-line:prefer-const
          dataMetodo.list = listParam;
          dataMetodo.pdf = pdf;
          dataMetodo.metodo = methodName;
          const user = JSON.parse(localStorage.getItem('currentUser'));

          reportdefService.postExecuteMethod(user, dataMetodo).subscribe
          ((result: ReportMethodResponseDTO) => {
            resolve(result);
                },
                 (err: HttpErrorResponse) => {
                  reject(err);
                });
      }
      });
    }

    export function consultarParametroByClase( paramRequest: ParamRequestDTO,
      reportdefService: ReportdefService ): Promise<FormdataReportdef> {
      return new Promise<FormdataReportdef>( (resolve, reject) => {{
        const user = JSON.parse(localStorage.getItem('currentUser'));
        reportdefService.consultarParametroByClase(user, paramRequest).subscribe
        // tslint:disable-next-line:no-shadowed-variable
        ((p: FormdataReportdef) => {
          resolve(p);
              },
               (err: HttpErrorResponse) => {
                reject(err);
              });
    }
    });
  }
    export function consultarParametroByParam( paramRequest: ParamRequestDTO,
      reportdefService: ReportdefService ): Promise<FormdataReportdef> {
      return new Promise<FormdataReportdef>( (resolve, reject) => {{
        const user = JSON.parse(localStorage.getItem('currentUser'));
        reportdefService.consultarParamByName(user, paramRequest).subscribe
        // tslint:disable-next-line:no-shadowed-variable
        ((p: FormdataReportdef) => {
          resolve(p);
              },
               (err: HttpErrorResponse) => {
                reject(err);
              });
    }
    });
  }