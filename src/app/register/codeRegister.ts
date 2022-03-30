import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationDialogService } from "../pages/confirmDialog/confirmDialog.service";
import { RegistroDTO } from "../_models/registroDTO";
import { SemillaDTO } from "../_models/semillaDTO";
import { AuthenticationService } from "../_services";

@Component({
    selector: 'app-codeRegister',
    templateUrl: './codeRegister.html',
    encapsulation: ViewEncapsulation.None
  })
  export class CodeRegisterComponent  {
  
    public formValida: FormGroup;
    error = '';
    paramRegister = {} as RegistroDTO;

    constructor(private router: Router,  fbValida: FormBuilder, private authenticationService: AuthenticationService,
        private confirmationDialogService: ConfirmationDialogService) {
    
        this.formValida = fbValida.group({
            semilla: ['', Validators.compose([Validators.required])],
             userName2: ['']
        });
    }

    solicitarNuevoCodigo() {
        this.error = '';
        const semillaDTO = {} as SemillaDTO;
            semillaDTO.usernameGeneric = 'citassgd';
            semillaDTO.usernameGenericProd = 'citassg';
        const p =  JSON.parse(localStorage.getItem('userAdd'));
        this.paramRegister = p;

        semillaDTO.usernameNuevo  = this.paramRegister.username.trim();
        semillaDTO.email = this.paramRegister.email;
        semillaDTO.name = this.paramRegister.name;
        this.authenticationService.getNuevaSemilla(semillaDTO).subscribe
        ( register => {
            this.confirmationDialogService.confirm(true, 'Atencion!',
            // tslint:disable-next-line:max-line-length

            'se ha generado con exito el codigo de validacion, verifique en su celular o en su casilla de correo')
            .then((confirmed) => {
            if (confirmed) {
            }
            }).catch(() => this.router.navigate(['/login']));
            console.log(register);
        },
            (err: HttpErrorResponse) => {
                console.log(err);
          if (err['errorBusiness']) {
              // es un error
              this.error = err['mensaje'];
              return;
          } else {
            this.error = 'error grave al intentar obtener un nuevo codigo de validacion';
              return;
          }
        });
    }


    public onSubmit(): void {
        this.error = '';
            if (this.formValida.valid) {
                const semillaDTO = {} as SemillaDTO;
                    semillaDTO.usernameGeneric = 'citassgd';
                    semillaDTO.usernameGenericProd = 'citassg';
                const p =  JSON.parse(localStorage.getItem('userAdd'));
                this.paramRegister = p;
                semillaDTO.semilla = this.formValida.controls['semilla'].value;
                if (this.paramRegister.username === undefined || this.paramRegister.username === null ||
                    this.paramRegister.username.trim() === '' ) {
                        this.error = 'no existe el usuario';
                        return ;

                }
                semillaDTO.usernameNuevo  = this.paramRegister.username.trim();
                this.authenticationService.getChequearSemilla(semillaDTO).subscribe
                ( register => {
                    this.confirmationDialogService.confirm(true, 'Atencion!',
                    // tslint:disable-next-line:max-line-length
                    'feclicitaciones!, ha verificado su cuenta con exito su cuenta, ya puede utilizar la aplicacion. Gracias por elegirnos')
                    .then((confirmed) => {
                    if (confirmed) {
                         this.router.navigate(['/login']);
                    }
                    }).catch(() => this.router.navigate(['/login']));
                    console.log(register);
                  },
                    (err: HttpErrorResponse) => {
                      console.log(err);

                      if (err['errorBusiness']) {
                          // es un error
                          this.error = err['mensaje'];
                          return;
                      } else {
                        this.error = 'error grave al tratar de registrarse, vuelva a intentarlo';
                          return;
                      }
                    });
            }
            return;
        }

    }


