import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
    selector: 'app-button-cancel',
    templateUrl: './buttonCancel.html'

})
export class ButtonCancelComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;
    @Output()acciones = new EventEmitter<any>();

    constructor() {

    }
    executeAction() {
        console.log( 'ejecuto un boton');
        this.acciones.emit(this.field);

    }
}
