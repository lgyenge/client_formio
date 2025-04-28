import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Suffix } from './dinet_common';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private message: BehaviorSubject<Suffix | null> = new BehaviorSubject<Suffix | null>(null);
  public readonly message$: Observable<Suffix | null> = this.message.asObservable();
  sendMessage(message: Suffix) {
    console.log('sendMessage', message);
    this.message.next(message);
  }
}
