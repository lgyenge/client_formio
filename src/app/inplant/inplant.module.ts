import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormioResource,
  FormioResourceRoutes,
  FormioResourceConfig,
  FormioResourceService
} from '@formio/angular/resource';
import { InplantViewComponent } from './inplant-view/inplant-view.component';




@NgModule({
  declarations: [
    InplantViewComponent
  ],
  imports: [
    CommonModule,
    FormioResource,
    RouterModule.forChild(FormioResourceRoutes({
      view: InplantViewComponent
    }))
  ],
  providers: [
    FormioResourceService,
    {provide: FormioResourceConfig, useValue: {
      name: 'inplant',
      form: 'inplant'
    }}
  ]
})
export class InplantModule { }
