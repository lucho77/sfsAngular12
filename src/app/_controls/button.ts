import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AvisaSeteoService } from '../_services/avisaSeteoService';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-button',
    templateUrl: './button.html'

})
export class ButtonComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;
    @Output()acciones = new EventEmitter<any>();

    @Input() flecha = false;
    private suscRef: Subscription = null;

    public data: DatoVisible = {
        flechaBotonSetear: false,
        cantidadBotones : 0
      };

    constructor(private avisoSeweteo: AvisaSeteoService) {
        this.data.flechaBotonSetear = false;
        this.data.cantidadBotones = 0;
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {
        this.data.flechaBotonSetear = false;
        this.data.cantidadBotones = 0;
        this.suscRef.unsubscribe();
      }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        this.data.flechaBotonSetear = false;
        this.suscRef = this.avisoSeweteo.sujetoComoObservable$.subscribe(() => {
            this.data.flechaBotonSetear = this.avisoSeweteo.getVisivilidad() ;
            this.data.cantidadBotones = this.avisoSeweteo.getCantidadBotones();
            // Primera vez
            if (this.data.flechaBotonSetear === undefined) {
                this.data.flechaBotonSetear = true;
            }
        });
    }
     executeAction() {
        console.log( 'ejecuto un boton');
        this.data.flechaBotonSetear === true ? this.data.flechaBotonSetear = false : this.data.flechaBotonSetear = true;
        this.acciones.emit(this.field);
    }
}

export interface DatoVisible {
    flechaBotonSetear: boolean;
    cantidadBotones: number;
}
