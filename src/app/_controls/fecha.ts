import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-fecha',
    templateUrl: './fecha.html',
    styleUrls: ['./fecha.scss'],

})
export class FechaComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;
    @Input() elindex: any;
    @Input() esambula: number;
    constructor() {

    }
}
