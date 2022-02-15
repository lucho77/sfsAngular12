import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { ReportdefService } from '../_services/reportdef.service';
import { configurarMenu, configurarParamnetrosGlobales, ejecutarMetodoArea, obtenerReporteInicio } from './loginUtils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, AfterViewInit {
  msg = '';
  loginForm: FormGroup;

  constructor(private authenticationService: AuthenticationService,private routes: Router, private formBuilder: FormBuilder, private reportdefService: ReportdefService) { }
  ngAfterViewInit(): void {
    this.ponerFocus();
  }
  ngOnInit(): void {
    this.cargarForm();
  }

  loginform = true;
  recoverform = false;

  showRecoverForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
  }
  check(uname: string, p: string) {
  }

  ponerFocus() {
    const el = document.querySelector('input[formcontrolname=username]');
    const el1 = <HTMLInputElement>el;
    el1.focus();
  }
  private cargarForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.compose([Validators.required,Validators.minLength(4), Validators.maxLength(24)])]
    });
  }
  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
  }
  localStorage.removeItem('paramGlobal');
  localStorage.removeItem('tabInformationName');
  localStorage.removeItem('tabInformationBody');

  const user  = await this.login();
  await obtenerReporteInicio(user, this.authenticationService);
  await configurarMenu(user, this.authenticationService);
  const p = await configurarParamnetrosGlobales(user, this.authenticationService, null, false, null);
  if (user['metodo'] !== null && user['metodo'] !== undefined) {
   await ejecutarMetodoArea(user, p, this.reportdefService);
  }
  this.routes.navigate(['/home']);

  }
  get f() { return this.loginForm.controls; }


  login() {
    return new Promise(resolve => {
    this.authenticationService.login(this.f.username.value, this.f.password.value).subscribe
    (user => {

                 if (user.errorBusiness) {
                     // es un error
                     console.log('ERRORRRRRRRRRRRRRRRRRRR');
                     console.log('error metodo login');
                     this.msg = user.mensaje;
                    return;
                 }
                 // this.loadSpinner = false;
                 if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                // limpio la cache local
                  localStorage.setItem('currentUser', null);
                  console.log('despues del localstorage');

                  this.authenticationService.logout();
                 }
                 localStorage.setItem('currentUser', JSON.stringify(user));
                 // this.cargarChat(user);
                  resolve(user);
    },
    (err: HttpErrorResponse) => {
      console.log('error metodo login');
      console.log(err);
        if (err['errorBusiness']) {
            // es un error
            this.msg = err['mensaje'];

            return;
        } else {
            this.msg = 'error grave al tratar de loguearse, vuelva a intentarlo';
            return;

        }
      }
    );
  });
  }

}
