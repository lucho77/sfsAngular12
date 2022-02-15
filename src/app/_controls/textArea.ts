import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-textarea',
    templateUrl: './textArea.html'

})
export class TextAreaComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;
    constructor() {

    }
}
