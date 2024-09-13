import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormioResource,
  FormioResourceRoutes,
  FormioResourceConfig,
  FormioResourceService
} from '@formio/angular/resource';
import { implantViewComponent } from './implant-view/implant-view.component';




@NgModule({
  declarations: [
    implantViewComponent
  ],
  imports: [
    CommonModule,
    FormioResource,
    RouterModule.forChild(FormioResourceRoutes({
      view: implantViewComponent
    }))
  ],
  providers: [
    FormioResourceService,
    {provide: FormioResourceConfig, useValue: {
     /*  name: 'implant',
      form: 'implant' */
      name: '151-0111-6525-3',
      form: '151-0111-6525-3'
    }}
  ]
})
export class implantModule { }
