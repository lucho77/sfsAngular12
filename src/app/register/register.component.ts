import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { RegistroDTO } from '../_models/registroDTO';
import { AuthenticationService } from '../_services';
import { ConfirmationDialogService } from '../pages/confirmDialog/confirmDialog.service';
import { AppConfigService } from '../_services/AppConfigService';
import { useAnimation } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
    public router: Router;
    public form: FormGroup;
    public name: AbstractControl;
    public email: AbstractControl;
    public dni: AbstractControl;
    public userName: AbstractControl;
    public fecnac: AbstractControl;
    public password: AbstractControl;
    public phone: AbstractControl;
    public confirmPassword: AbstractControl;
    paramRegister = {} as RegistroDTO;
    errorLogin = false;
    error = '';
    click = false;
    clickValida = false;
    loadSpinner = false;
    version = '';
    users={userProd:'',userDesa:'',userGeneric:''};
    constructor(router: Router, fb: FormBuilder, fbValida: FormBuilder, private authenticationService: AuthenticationService,
        private confirmationDialogService: ConfirmationDialogService,
        private appConfig:AppConfigService,private spinner: NgxSpinnerService ) {
        this.router = router;
        this.form = fb.group({
            name: ['', Validators.compose([Validators.required])],
            email: ['',([Validators.required, emailValidator])],
            password: ['', Validators.required],
            phone: [''],
            dni: ['', Validators.required],
            userName: ['', Validators.compose([Validators.required, noWhitespaceValidator])],
            fecnac: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        }, {validator: matchingPasswords('password', 'confirmPassword')});

        this.name = this.form.controls['name'];
        this.dni = this.form.controls['dni'];
        this.fecnac = this.form.controls['fecnac'];
        this.email = this.form.controls['email'];
        this.password = this.form.controls['password'];
        this.confirmPassword = this.form.controls['confirmPassword'];
        this.userName = this.form.controls['userName'];
        this.phone = this.form.controls['phone'];
    }
    ngOnInit() {
        this.obtenerVersion();
        console.log(this.form);
        this.getUserProd();

    }

    obtenerVersion() {
        this.authenticationService.version().subscribe
        (result => {
          console.log(result);
          this.version = result.respuestagenerica;
        },
        (err: HttpErrorResponse) => {
          console.log('no se ha podido obtener la version');
        });
    }
    getUserProd() {
        // alert('entro al metodo que obtiene el usuario de produccion');
         this.authenticationService.getUserProd(this.appConfig.getConfig().genericUser).subscribe
         (result => {
        //   alert('obtengo el getUserProd');
           console.log(result);
        //   alert(result);
           this.users.userProd =result.usernameProd;
           this.users.userDesa =result.usernameDesa;
           this.users.userGeneric = this.appConfig.getConfig().genericUser;
           // this.version = result.respuestagenerica;
           localStorage.setItem('dataUser', JSON.stringify(this.users));

         },
         (err: HttpErrorResponse) => {
           console.log('no se ha podido obtener la version');
          // alert('errorrrrrrrrrrrrrrrr');
         });
   
       }
   
     public onSubmit(): void {
        this.spinner.show('register');

            this.error = '';
            this.click = true;
            this.loadSpinner = true;
            if (this.form.valid) {
                const email = this.form.controls['email'].value;
                const pho = this.form.controls['phone'].value;
                if ((email === undefined || email.trim() === '') && (pho === undefined || pho.trim() === '')) {
                    this.error = 'debe completar el campo mail o en su defecto el campo telefono';
                    this.click = false;
                    this.errorLogin = true;
                    this.spinner.hide('register');
                    return;
                }
                //const token = JSON.parse(localStorage.getItem('paramToken'));
                console.log('token');
                //console.log(token);
                this.paramRegister.usernameGenericDesa = this.users.userDesa;
                this.paramRegister.usernameGenericProd = this.users.userProd;
                this.paramRegister.usernameGenericUser = this.users.userGeneric;
                
                this.paramRegister.username =   this.form.controls['userName'].value;
                this.paramRegister.username = this.paramRegister.username.trim();
    
                this.paramRegister.password =   this.form.controls['password'].value;
                this.paramRegister.email =   this.form.controls['email'].value;
                this.paramRegister.dni =   this.form.controls['dni'].value;
                this.paramRegister.phone =   this.form.controls['phone'].value;
                if (this.paramRegister.email.trim() === '' && this.paramRegister.phone.trim() === '') {
                    const mensaje = 'no puede dejar vacios los campos Email y Celular, al menos debe completar uno';
                    this.click = false;
                    this.spinner.hide('register');
                    this.errorLogin = true;
                    this.error = mensaje;
                    return;
                }
                const date: NgbDate = this.form.controls['fecnac'].value;
                const fechaString = date.day + '-' + date.month + '-' + date.year;
                const now = moment(fechaString, 'DD-MM-YYYY');

                if (!now.isValid) {
                    this.click = false;
                    const mensaje = 'El formato de fecha ingresada no es valido';
                    this.error = mensaje;
                    this.spinner.hide('register');

                    return;
                }
                this.paramRegister.fecnac =  now.format('DD-MM-YYYY');
                this.paramRegister.name   =  this.form.controls['name'].value;                                
                this.authenticationService.getRegister(this.paramRegister).subscribe
                ( register => {
                    this.spinner.hide('register');
                    localStorage.setItem('userAdd', JSON.stringify(this.paramRegister));
                    this.confirmationDialogService.confirm(true, 'Atencion!',
                    // tslint:disable-next-line:max-line-length
                    'feclicitaciones!, ha creado con exito su cuenta, ahora necesita revisar su casilla de mensajes en su celular. Gracias por elegirnos')
                    .then((confirmed) => {
                        //localStorage.setItem('userAdd', JSON.stringify(this.paramRegister));

                        if (confirmed) {
                             this.router.navigate(['/checkCodigo']);            
                        }
                    }).catch(() => this.router.navigate(['/login']));

                        console.log(register);
                    },
                    (err: HttpErrorResponse) => {
                        this.spinner.hide('register');
                        console.log(err);
                        this.errorLogin = true;
                        this.click = false;
                  if (err['errorBusiness']) {
                    this.spinner.hide('register');

                      // es un error
                      this.error = err['mensaje'];
                      return;
                  } else {
                    this.spinner.hide('register');

                    this.error = 'error grave al tratar de registrarse, vuelva a intentarlo';
                      return;
                  }
                });
            }
            console.log('ok!');
     }
    }
    export function emailValidator(control: FormControl){
        const emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
        if (control.value && !emailRegexp.test(control.value.trim())) {
            return {invalidEmail: true};
        }
}
export function noWhitespaceValidator(control: FormControl) {
    const isWhitespace = control.value.trim().indexOf(' ') >= 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
        const password = group.controls[passwordKey];
        const passwordConfirmation = group.controls[passwordConfirmationKey];
        if (password.value !== passwordConfirmation.value) {
            return passwordConfirmation.setErrors({mismatchedPasswords: true});
        }
    };
}
