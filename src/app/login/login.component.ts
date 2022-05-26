import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegistroDTO } from '../_models/registroDTO';
import { AuthenticationService } from '../_services';
import { AppConfigService } from '../_services/AppConfigService';
import { ReportdefService } from '../_services/reportdef.service';
import { configurarMenu, configurarParamnetrosGlobales, ejecutarMetodoArea, obtenerReporteInicio } from './loginUtils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, AfterViewInit {
  msg = '';
  loginForm: FormGroup;
  validarusuario:boolean;
  versionFront:string;
  constructor(private authenticationService: AuthenticationService,private routes: Router, 
    private formBuilder: FormBuilder, private reportdefService: ReportdefService, 
    private appConfig:AppConfigService, private swUpdate: SwUpdate,private spinner: NgxSpinnerService) {
      this.updateClient();
     }
  ngAfterViewInit(): void {
    this.ponerFocus();
  }
  ngOnInit(): void {
    this.cargarForm();
    this.validarusuario = false;
    this.versionFront = this.appConfig.getConfig().version;
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
  //await obtenerReporteInicio(user, this.authenticationService);
  //await configurarMenu(user, this.authenticationService);
  //const p = await configurarParamnetrosGlobales(user, this.authenticationService, null, false, null);
  this.routes.navigate(['/full/home']);

  }
  get f() { return this.loginForm.controls; }

  updateClient(){
    if(!this.swUpdate.isEnabled){
        console.log('service worker not available');
        alert('service worker not available');
        return;
    }
    alert('service worker available');
    this.swUpdate.available.subscribe((event)=>{
      console.log(`current`,event.current,`available`,event.available);  
      if(confirm('Existen cambios en la Aplicacion, por favor confirme')){
        this.swUpdate.activateUpdate().then(()=>location.reload())
      }
    })
    this.swUpdate.activated.subscribe((event)=>{
      console.log(`current`,event.previous,`available`,event.current)  
    })
      
  }

  login() {
    this.spinner.show('login');
    return new Promise(resolve => {
      console.log(this.appConfig.getConfig())
    this.authenticationService.login(this.f.username.value, this.f.password.value, 
    this.appConfig.getConfig().novalidaHabilitado).subscribe
    (user => {

      this.spinner.hide('login');
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
                 localStorage.setItem('paramGlobal', JSON.stringify(user.listGlobales));
                 localStorage.setItem('userMenu', JSON.stringify(user.menues));
                 localStorage.setItem('reporte', user.reporteInicio);

                 if (user['metodo'] !== null && user['metodo'] !== undefined) {
                   ejecutarMetodoArea(user, user.listGlobales, this.reportdefService);
                 }
               
                 // this.cargarChat(user);
                  resolve(user);
    },
    (err: HttpErrorResponse) => {
      console.log('error metodo login');
      console.log(err);
      this.spinner.hide('login');

        if (err['errorBusiness']) {
            // es un error
              this.msg = err['mensaje'];
              if(err['confirmoMail']){
                //debe confirmar mail
                this.validarusuario = true;
                let paramRegister = {} as RegistroDTO;
                paramRegister.username = this.f.username.value;
                localStorage.setItem('userAdd', JSON.stringify(paramRegister));
              }
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
