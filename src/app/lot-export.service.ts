import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SheetData } from './dinet_common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LotExportService {

private readonly API_URL = 'https://alfresco-elsig-app.localhost/api/generate-lot-pdf'; // 'https://yourdomain.com/api/generate-lot-pdf';

  constructor(private http: HttpClient) {}

exportLotToAlfresco(lotData: any): Observable<Blob> { 
  return this.http.post(this.API_URL, lotData, { responseType: 'blob' }); 
}}
