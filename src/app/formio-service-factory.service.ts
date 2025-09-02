import { Injectable } from '@angular/core';
import { FormioAppConfig, FormioService } from '@formio/angular';

@Injectable({
  providedIn: 'root'
})
export class FormioServiceFactoryService {

constructor(private appConfig: FormioAppConfig) {}

  create(url?: string) {
    return new FormioService(url ?? this.appConfig.appUrl);
  }}


