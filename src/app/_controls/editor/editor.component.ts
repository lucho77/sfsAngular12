import { Component, ViewEncapsulation, Input, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent  {

  @Input() field: any = {};
  @Input() form: FormGroup;


  constructor() {
 

  }
}
