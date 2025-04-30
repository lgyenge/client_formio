import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormioAppConfig } from '@formio/angular';
import { DinetFormioForm } from './dinet_common';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(public appConfig: FormioAppConfig, private http: HttpClient) {}
  /*a client already authenticated */
  /* authentuicate() {
    let configUrl = this.appConfig.appUrl + '/user/login';
    const body = {
      data: {
        email: 'admin@example.com',
        password: 'CHANGEME',
      },
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    //the HTTP post request
    return this.http.post(configUrl, body, { headers });
  }
 */
  uploadForm(form: DinetFormioForm) {
    let configUrl = this.appConfig.appUrl + '/form';
    let formioToken = localStorage.getItem('formioToken') || '';
   
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-jwt-token': formioToken,
    });
    //the HTTP post request
    return this.http.post(configUrl, form, { headers });
  }
}
