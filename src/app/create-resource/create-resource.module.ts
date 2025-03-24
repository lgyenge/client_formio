import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateResourceRoutingModule } from './create-resource-routing.module';
import { CreateResourceComponent } from './create-resource.component';


@NgModule({
  declarations: [
    CreateResourceComponent
  ],
  imports: [
    CommonModule,
    CreateResourceRoutingModule
  ]
})
export class CreateResourceModule { }
