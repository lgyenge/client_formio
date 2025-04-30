import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormioGrid  } from '@formio/angular/grid';
import { FormioModule } from '@formio/angular';
import { MeoRoutingModule } from './meo-routing.module';
import { MeoComponent } from './meo/meo.component';
import { MeoStepComponent } from './meo-step/meo-step.component';
import { MeoStepViewComponent } from './meo-step-view/meo-step-view.component';
import { MeoStepEditComponent } from './meo-step-edit/meo-step-edit.component';
import { MeoStepIndexComponent } from './meo-step-index/meo-step-index.component';
import { MeoStepHeaderComponent } from './meo-step-header/meo-step-header.component';
import { MeoViewComponent } from './meo-view/meo-view.component';
import { MeoExcelComponent } from './meo-excel/meo-excel.component';
import { Meo2Component } from './meo2/meo2.component';
import { MeoStepIndex2Component } from './meo-step-index2/meo-step-index2.component';


@NgModule({
  declarations: [
    MeoComponent,
    MeoStepComponent,
    MeoStepViewComponent,
    MeoStepEditComponent,
    MeoStepIndexComponent,
    MeoStepHeaderComponent,
    MeoViewComponent,
    MeoExcelComponent,
    Meo2Component,
    MeoStepIndex2Component,
  ],
  imports: [
    CommonModule,
    MeoRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FormioGrid,
    FormioModule
  ]
})
export class MeoModule { }
