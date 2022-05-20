import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-filtros',
    templateUrl: './filtros.html'

})
export class FiltroComponent {
    @Input() listRequest: any;
}
