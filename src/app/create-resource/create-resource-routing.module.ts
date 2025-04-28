import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { CreateResourceComponent } from './create-resource.component';
import {
  FormioResourceRoutes,
} from '@formio/angular/resource';


@NgModule({
  imports: [RouterModule.forChild(FormioResourceRoutes({
   // view: CreateResourceComponent
  }))],
  exports: [RouterModule]
})
export class CreateResourceRoutingModule { }
