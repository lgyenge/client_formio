import { Component, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {

  title: string | undefined;
  message: string | undefined;
  options!: string[] ;
  answer: string = "";

  constructor(
    public bsModalRef: BsModalRef,
  ) { }

  respond(answer: string) {
    this.answer = answer;

    this.bsModalRef.hide();
  }


}
