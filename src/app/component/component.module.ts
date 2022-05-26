import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NotifierModule } from 'angular-notifier';
import { ComponentsRoutes } from './component.routing';
import { BusquedaGenericaModule } from '../busquedaGenericaModule';
import { ReportdefComponent } from './reportdef.component';
import {  NgbdSortableHeader, TabularComponent } from '../pages/reportdef/tabular.component';
import { FormularioComponent } from '../pages/reportdef/formulario.component';
import { ConfirmDialogComponent } from '../pages/confirmDialog/confirmDialog.component';
import { CheckBoxComponent } from '../_controls/checkBox';
import { ComboComponent } from '../_controls/combo';
import { TextBoxComponent } from '../_controls/textBox';
import { RadioComponent } from '../_controls/radio';
import { FieldBuilderComponent } from '../pages/reportdef/fieldBuilder';
import { TextAreaComponent } from '../_controls/textArea';
import { BusquedaGenericaTextComponent } from '../_controls/busquedaGenericaText';
import { FechaComponent } from '../_controls/fecha';
import { ButtonComponent } from '../_controls/button';
import { ButtonCancelComponent } from '../_controls/buttonCancel';
import { InfoAreaComponent } from './areaInfo/infoArea.component';
import { CardsComponent } from '../_controls/cards';
import { LabelComponent } from '../_controls/label';
import { InfoNotificationComponent } from './infoNotification/infoNotification.component';
import { LinkComponent } from '../_controls/link';
import { ConfirmationDialogService } from '../pages/confirmDialog/confirmDialog.service';
import { GenericFinderService } from '../pages/genericFinder/genericFinder.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from '../_helpers';
import { TabularABMFinderComponent } from '../pages/reportdef/tabularabmfinder.component.';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToolbarModule} from 'primeng/toolbar';

import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import {AccordionModule} from 'primeng/accordion';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { SpinnerComponent } from './spinner/spinner.components';
import {ToastModule} from 'primeng/toast';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { AutocompleteComponent } from '../_controls/autoComplete';
import {EditorModule} from 'primeng/editor';
import { EditorComponent } from '../_controls/editor/editor.component';
import { FileUploaderComponent } from '../_controls/fileUpload/file-uploader.component';
import {CalendarModule} from 'primeng/calendar';
import { NgbDateCustomParserFormatter } from '../_controls/adapter/datePicker';
import {FieldsetModule} from 'primeng/fieldset';
import {PanelModule} from 'primeng/panel';
import { PipeKeyobject } from '../pages/reportdef/pibeObjectToArray';
import { FechaCustomComponent } from '../_controls/fechaCustom';
import {TableModule} from 'primeng/table';
import {DividerModule} from 'primeng/divider';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NotifierModule,
    BusquedaGenericaModule,
    MessagesModule,ToolbarModule,
     MessageModule,  ButtonModule,
     SplitButtonModule,AccordionModule,ProgressSpinnerModule,ToastModule, 
     InputTextareaModule, AutoCompleteModule, EditorModule, CalendarModule,
     FieldsetModule,PanelModule,TableModule,DividerModule,NgxSpinnerModule
  ],
  declarations: [
    ReportdefComponent, TabularComponent, FormularioComponent, ConfirmDialogComponent,NgbdSortableHeader,TabularABMFinderComponent,
     CheckBoxComponent, ComboComponent, TextBoxComponent, RadioComponent,PipeKeyobject, 
    FieldBuilderComponent, TextAreaComponent,  BusquedaGenericaTextComponent, FechaComponent, ButtonComponent,
    ButtonCancelComponent,  InfoAreaComponent ,SpinnerComponent,FechaCustomComponent,
     CardsComponent, LabelComponent, InfoNotificationComponent, LinkComponent,
      AutocompleteComponent, EditorComponent, FileUploaderComponent
  ],
  providers: [
    ConfirmationDialogService, GenericFinderService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter},


    // { provide: OWL_DATE_TIME_FORMATS, useValue: MY_NATIVE_FORMATS},

  
  ],

  entryComponents: [ ConfirmDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],


})
export class ComponentsModule {}
