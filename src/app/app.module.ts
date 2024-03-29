import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

import { VerticalNavigationComponent } from './shared/vertical-header/vertical-navigation.component';
import { VerticalSidebarComponent } from './shared/vertical-sidebar/vertical-sidebar.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { HorizontalNavigationComponent } from './shared/horizontal-header/horizontal-navigation.component';
import { HorizontalSidebarComponent } from './shared/horizontal-sidebar/horizontal-sidebar.component';


import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { FooterComponent } from './pages/footer/footer.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RegisterComponent } from './register/register.component';
import { ConfirmationDialogService } from './pages/confirmDialog/confirmDialog.service';
import { NgbDateCustomParserFormatter } from './_controls/adapter/datePicker';
import { CodeRegisterComponent } from './register/codeRegister';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfigService } from './_services/AppConfigService';

import { NgxSpinnerModule } from "ngx-spinner";
import { LoginExternalComponent } from './login/loginExternal.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20
};


@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    BlankComponent,
    VerticalNavigationComponent,
    BreadcrumbComponent,
    VerticalSidebarComponent,
    HorizontalNavigationComponent,
    HorizontalSidebarComponent,
    LoginComponent,LoginExternalComponent,
    FooterComponent,RegisterComponent, CodeRegisterComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,PanelMenuModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    NgbModule,
    RouterModule.forRoot(Approutes),
    PerfectScrollbarModule,
    FeatherModule.pick(allIcons),
    FeatherModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    ConfirmationDialogService,
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter},

      {provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG},
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
      { provide: LOCALE_ID, useValue: 'es' },
      {provide: LocationStrategy, useClass: HashLocationStrategy},
      {
        provide: APP_INITIALIZER,
        multi: true,
        deps: [AppConfigService],
        useFactory: (appConfigService: AppConfigService) => {
          return () => {
            return appConfigService.loadConfig();
          };
        }
      }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
