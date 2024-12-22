import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
@Injectable({
  providedIn: 'root'
})
export class ModalMessageService {

  bsModalRef!: BsModalRef;

  constructor(
    private bsModalService: BsModalService,
  ) { }

  confirm(title: string, message: string, options: string[]): Observable<string> {
    const initialState = {
      title: title,
      message: message,
      options: options,
      answer: "",
    };
    this.bsModalRef = this.bsModalService.show(ConfirmModalComponent, { initialState });

    return new Observable<string>(this.getConfirmSubscriber());
  }

  private getConfirmSubscriber() {
    return (observer: { next: (arg0: any) => void; complete: () => void; }) => {
      const subscription = this.bsModalService.onHidden.subscribe((reason: string) => {
        observer.next(this.bsModalRef.content.answer);
        observer.complete();
      });

      return {
        unsubscribe() {
          subscription.unsubscribe();
        }
      };
    }
  }
}
