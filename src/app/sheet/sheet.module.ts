import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormioModule } from '@formio/angular';
import { FormioGrid } from '@formio/angular/grid';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SheetRoutingModule } from './sheet-routing.module';
import { FindFormComponent } from './find-form/find-form.component';
import { DisplayFormComponent } from './display-form/display-form.component';
import { SheetComponent } from './sheet/sheet.component';
// import { SubmissionOldComponent } from './submission_old/submission_old.component';
import { SheetNewComponent } from './sheet-new/sheet-new.component';
import { SubmissionIndexComponent } from './submission/index/index.component';
import { SubmissionEditComponent } from './submission/edit/edit.component';
import { SubmissionDeleteComponent } from './submission/delete/delete.component';
import { SubmissionComponent2 } from './submission/submission/submission.component';
import { SubmissionViewComponent } from './submission/view/view.component';

// import { FormManagerConfig, FormManagerService } from '@formio/angular/manager';
//import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormManagerViewComponent } from './view/view.component';

@NgModule({
  declarations: [
    FindFormComponent,
    DisplayFormComponent,
    SheetComponent,
    SubmissionComponent2,
    // SubmissionOldComponent,
    SheetNewComponent,
    SubmissionIndexComponent,
    SubmissionEditComponent,
    SubmissionDeleteComponent,
    SubmissionViewComponent,
    FormManagerViewComponent
  ],
  imports: [
    CommonModule,
    SheetRoutingModule,
    FormioModule,
    FormioGrid,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    //BsModalService,
    /*  FormManagerService,
    {
      provide: FormManagerConfig,
      useValue: {
       // tag: 'common',
        includeSearch: true
      },
    }, */
  ],
})
export class SheetModule {}
