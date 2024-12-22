import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component';
import { BsModalService, BsModalRef,  ModalDirective } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    UploadComponent
  ],
  imports: [
    CommonModule,
    UploadRoutingModule,
  ]
})
export class UploadModule { }
