import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateResourceRoutingModule } from './create-resource-routing.module';
import { CreateResourceComponent } from './create-resource.component';

import {
  //FormioResource,
  //FormioResourceRoutes,
  FormioResourceConfig,
  FormioResourceService
} from '@formio/angular/resource';
//import { CreateResourceViewComponent } from './create-resource-view/create-resource-view.component';


@NgModule({
  declarations: [
    CreateResourceComponent
  ],
  imports: [
    CommonModule,
    CreateResourceRoutingModule
  ],
  providers: [
    FormioResourceService,
    {provide: FormioResourceConfig, useValue: {
      name: 'lot',
      form: 'lot'
    }}
  ]
})
export class CreateResourceModule { }
