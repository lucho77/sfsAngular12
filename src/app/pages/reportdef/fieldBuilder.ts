import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormdataReportdef } from 'src/app/_models/formdata';


@Component({
  selector: 'app-field-builder',
  templateUrl: './fieldBuilder.html',
  styleUrls: ['./fieldBuilder.scss'],


})
export class FieldBuilderComponent implements OnInit {
  @Input() field: any;
  @Input() form: any;
  @Input() mobile: boolean;
  @Output()accionesDina = new EventEmitter<any>();

  @Input() dataForm: FormdataReportdef[];
  loading: boolean;

  constructor() { }

  ngOnInit() {
    this.loading = false;
  }
  processSpinner(event) {
    this.loading = event;
 }

 processActions(event) {
  this.accionesDina.emit(event);
}

}
