import { Component, OnInit, ViewEncapsulation, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MetodoService } from 'src/app/_services/metodoService';
import { ToastService } from 'src/app/component/toast/toast.service';
import { AuthenticationService } from 'src/app/_services';
import { ChatDTO } from 'src/app/_models/chatDTO';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
registerLocaleData(es);
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class FooterComponent implements OnInit {

  msg  = '';
  consultaForm: FormGroup;
  submitted = false;
  lineaActiva = false;
  version: '';
  @ViewChild('cons') cons: ElementRef;
  

  constructor( private formBuilder: FormBuilder, private renderer: Renderer2,
    private metodoService: MetodoService, private toastService: ToastService, 
    private authenticationService: AuthenticationService,	private modalService: NgbModal) 
     {
  }

  ngOnInit() {
    this.consultaForm = this.formBuilder.group({
      consulta: ['', [Validators.required]],
      prioridad: ['baja', [Validators.required]],
    });
    this.authenticationService.version().subscribe
    (result => {
      console.log(result);
      this.version = result.respuestagenerica;
    },
    (err: HttpErrorResponse) => {
      this.toastService. show('no se ha podido obtener la version', { classname: 'bg-danger text-light', delay: 15000 });
    });
}

  consultaEnLinea() {
          // console.log(data.camposPersistirDTO);

    this.lineaActiva = true;
    this.consultaForm.controls['consulta'].setValue('');
    this.consultaForm.controls['prioridad'].setValue('baja');

    //this.ponerFocus();
  }
  mandarMensaje() {
    this.submitted = true;
    if (this.consultaForm.invalid) {
      return;
    }
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const  chatDTO = {} as ChatDTO;
    chatDTO.msg = this.f.consulta.value;
    chatDTO.prioridad = this.f.prioridad.value;
    chatDTO.de = user.username;
    chatDTO.idAplica = user.idAplica;

          // console.log(data.camposPersistirDTO);
          this.metodoService.nuevoChat(user, chatDTO).subscribe
          (result => {
            this.toastService. show('mensaje enviado con exito', { classname: 'bg-success text-light', delay: 15000 });

          },
          (err: HttpErrorResponse) => {
            this.toastService. show('no se ha podido enviar la consulta, intente más tarde', { classname: 'bg-danger text-light', delay: 15000 });
          });

  }
  get f() { return this.consultaForm.controls; }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    // this.ponerFocus();
}
ponerFocus() {
  this.renderer.selectRootElement(this.cons.nativeElement).focus();
}

private getDismissReason(reason: ModalDismissReasons): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}
open1(content1: string) {
  
  this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    
    this.consultaEnLinea();
    console.log( `Closed with: ${result}`);
  }, (reason) => {
    console.log(  `Dismissed ${this.getDismissReason(reason)}`);
  });
}


}
