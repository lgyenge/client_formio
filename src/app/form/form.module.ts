import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormioGrid } from '@formio/angular/grid';
import {
  FormManagerModule,
  FormManagerRoutes,
  FormManagerService,
  FormManagerConfig,
} from '@formio/angular/manager';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormioGrid,
    FormManagerModule,
    RouterModule.forChild(FormManagerRoutes()),
  ],
  providers: [
    FormManagerService,
    {
      provide: FormManagerConfig,
      useValue: {
       // tag: 'common',
        includeSearch: true
      },
    },
  ],
})
export class FormModule {}
