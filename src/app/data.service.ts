import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  private message = new BehaviorSubject<string>('Initial message!!!');
  getMessage = this.message.asObservable();


  sendMessage(message: string) {
    this.message.next(message)
  }
}
