import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormioModule, FormioService } from '@formio/angular';
import { FormioGrid } from '@formio/angular/grid';
import { ReactiveFormsModule } from '@angular/forms';

import { SheetRoutingModule } from './sheet-routing.module';
import { SheetComponent } from './sheet.component';
import { FindFormComponent } from './find-form/find-form.component';
import { DisplayFormComponent } from './display-form/display-form.component';
import { FormManagerConfig, FormManagerService } from '@formio/angular/manager';
// import { FilterFormPipe } from './filter-form.pipe';

@NgModule({
  declarations: [SheetComponent, FindFormComponent, DisplayFormComponent],
  imports: [
    CommonModule,
    SheetRoutingModule,
    FormioModule,
    FormioGrid,
    ReactiveFormsModule,
  ],
  providers: [
  // FormioService,
  /*  {
    provide: FormioService,
      useValue: {
        url: 'http://localhost:3001',
        name: 'event',
        form: 'event',
      },
    },
 */
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
export class SheetModule {}
