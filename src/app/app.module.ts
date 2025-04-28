import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { FormioModule, FormioAppConfig } from '@formio/angular';
import { FormManagerService, FormManagerConfig } from '@formio/angular/manager';
import { FormioAuthService, FormioAuthConfig } from '@formio/angular/auth';
import { FormioResources } from '@formio/angular/resource';
import { AuthConfig, AppConfig } from '../config ';
import { HeroComponent } from './hero/hero.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
//import { AuthService } from './gylAuth.service';

import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';

// különben nem ismeri fel a formio-grid komponenst
import { FormioGrid } from '@formio/angular/grid';
import { ExcelExampleComponent } from './excel-example/excel-example.component';
/* import {
  BsModalService,
  BsModalRef,
  ModalDirective,
  ModalModule,
} from 'ngx-bootstrap/modal'; */
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

//import { DataService } from './data.service';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    HeroComponent,
    HomeComponent,
    HeaderComponent,
    ExcelExampleComponent,
    ConfirmModalComponent,
  ],
  imports: [
    BrowserModule,
    FormioModule,
    FormioGrid,
    AppRoutingModule,
    HttpClientModule,
//    ModalModule.forRoot(), //<<======
  ],
  exports: [ConfirmModalComponent],
  providers: [
    //BsModalService,
    //DataService,
    FormioResources,
    FormioAuthService,
    FormManagerService,
    //AuthService,
    {
      provide: FormManagerConfig,
      useValue: {
        tag: 'common',
        includeSearch: true,
      },
    },
    { provide: FormioAuthConfig, useValue: AuthConfig },
    { provide: FormioAppConfig, useValue: AppConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
