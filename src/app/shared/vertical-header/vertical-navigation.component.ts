import { Component, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core';
import {  ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/_services';
import { ExitService } from 'src/app/_services/exitService';
import { Router } from '@angular/router';
import { User } from 'src/app/_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passValidator } from './validator';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-vertical-navigation',
  templateUrl: './vertical-navigation.component.html',
  providers: [NgbModalConfig, NgbModal, NgbActiveModal]

})
export class VerticalNavigationComponent implements AfterViewInit,OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public config: PerfectScrollbarConfigInterface = {};

  public showSearch = false;
  public  user: User;
  public display = false;
  mensaje_error  = 'Esto es un mensaje de error';
  registerForm: FormGroup;
  closeResult: string;
  errorCambioContra = false;
  submitted = false;
  esVisibleMensaje  = false;

  public dataUser:any={};
    // This is for Notifications
    notifications: Object[] = [
   /*
      {
        btn: 'btn-danger',
        icon: 'ti-link',
        title: 'Luanch Admin',
        subject: 'Just see the my new admin!',
        time: '9:30 AM'
      },
      {
        btn: 'btn-success',
        icon: 'ti-calendar',
        title: 'Event today',
        subject: 'Just a reminder that you have event',
        time: '9:10 AM'
      },
      {
        btn: 'btn-info',
        icon: 'ti-settings',
        title: 'Settings',
        subject: 'You can customize this template as you want',
        time: '9:08 AM'
      },
      {
        btn: 'btn-primary',
        icon: 'ti-user',
        title: 'Pavan kumar',
        subject: 'Just see the my admin!',
        time: '9:00 AM'
      }
      */
    ];
  
    // This is for Mymessages
    mymessages: Object[] = [
      /*
      {
        useravatar: 'assets/images/users/1.jpg',
        status: 'online',
        from: 'Pavan kumar',
        subject: 'Just see the my admin!',
        time: '9:30 AM'
      },
      {
        useravatar: 'assets/images/users/2.jpg',
        status: 'busy',
        from: 'Sonu Nigam',
        subject: 'I have sung a song! See you at',
        time: '9:10 AM'
      },
      {
        useravatar: 'assets/images/users/2.jpg',
        status: 'away',
        from: 'Arijit Sinh',
        subject: 'I am a singer!',
        time: '9:08 AM'
      },
      {
        useravatar: 'assets/images/users/4.jpg',
        status: 'offline',
        from: 'Pavan kumar',
        subject: 'Just see the my admin!',
        time: '9:00 AM'
      } */
    ];
  

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us'
  }

  public languages: any[] = [{
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us'
  },
  {
    language: 'French',
    code: 'fr',
    icon: 'fr'
  },
  {
    language: 'Spanish',
    code: 'es',
    icon: 'es'
  },
  {
    language: 'German',
    code: 'de',
    icon: 'de'
  }]

  constructor(private translate: TranslateService,private authenticationService: AuthenticationService,
      private exitService: ExitService,private router: Router, config: NgbModalConfig, private modalService: NgbModal, private formBuilder: FormBuilder,
             public activeModal: NgbActiveModal) {
    translate.setDefaultLang('en');
  }
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      contrasenaActual: ['', [Validators.required, Validators.minLength(5)]],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(5)]],
      reNuevaContrasena: ['', [Validators.required, Validators.minLength(5), passValidator]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.registerForm.controls.nuevaContrasena.valueChanges
    .subscribe(
      x => this.registerForm.controls.reNuevaContrasena.updateValueAndValidity()
    );

    //throw new Error('Method not implemented.');
  }


  ngAfterViewInit() {}

  changeLanguage(lang: any) {
    this.translate.use(lang.code)
    this.selectedLanguage = lang;
  }
  salir() {
    // this.wService.logoutWS();
    this.exitService.setearExitGlobal();
    this.authenticationService.logout();
    this.router.navigate(['/']);
   }
   open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log('CLOSE WITH');
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      console.log(reason);
      console.log('DISMIISSED');
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      console.log('SE HA PRESIOANDO EL ESC');
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log('SE HA CLICKQUEADO BACKDROP');
      return 'by clicking on a backdrop';
    } else {
      console.log('WITH REASON');
      return  `with: ${reason}`;
    }
  }
  refresh(): void {
    window.location.reload();
  }
  cerrar() {
    this.activeModal.close();
  }
  get f() { return this.registerForm.controls; }

  onSubmit() {

    this.submitted = true;
    console.log('Se ha enviado el Submit');
    console.log(this.registerForm);

    const lstUsername = JSON.parse(localStorage.getItem('currentUser'));
    const userNameAdentro = lstUsername.username;
    const iduser = lstUsername.idUsuarioUra;
    const dataSource = lstUsername.datasource;
    const token = lstUsername.token;


    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    this.dataUser = {
      username: userNameAdentro ,
      contrasenaActual : this.f.contrasenaActual.value,
      nuevaContrasena : this.f.reNuevaContrasena.value,
      idUsuarioUra : iduser,
      email: this.f.email.value,
      dataSource : dataSource,
      token : token
    };
    console.log('EL VALOR DE THIS.DATAUSER ES : ');
    console.log(this.dataUser);

    this.authenticationService.cambiarContrasena(this.dataUser).subscribe(
      data => {
                console.log(data);
                console.log('Datos que se devuelven por llamada');
                this.esVisibleMensaje = true;
                console.log(this.mensaje_error);
                if (data['mensaje'] === '-1') {
                  this.errorCambioContra = true;
                  this.mensaje_error = 'Existen datos incorrectos.';
                } else {
                this.errorCambioContra = false;
                this.mensaje_error = data['mensaje'];


                localStorage.removeItem('currentUser');
                localStorage.removeItem('paramGlobal');
                localStorage.removeItem('userMenu');

                setTimeout(() => { this.router.navigate(['/']); }, 2000);
                setTimeout(() => { this.refresh(); }, 2000);

              }
              },
              (err: HttpErrorResponse) => {
                   this.esVisibleMensaje = true;
                    console.log(err);
                    this.errorCambioContra = true;
                    this.mensaje_error = err['mensaje'];
                    if (err['errorBusiness']) {
                        console.log('Entro aca al error A');
                        return;
                    } else {
                        console.log('Entro aca al error B');
                        return;
                    }
              },
              ( ) => {

                  console.log('Se ha completado la llamada.'); // 'Se ha Cambiado Satisfactoriamente su Contraseña';
                  // setTimeout(() => { this.refresh() }, 3000);
                  // setTimeout this.refresh();

              }

           );

      }

}
