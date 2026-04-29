import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SheetData } from './dinet_common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LotExportService {
  //private readonly API_URL = 'http://localhost:3100/api/generate-pdf';
  private readonly API_URL = 'http://localhost:3100/api/complete-lot-archive';

  
  constructor(private http: HttpClient) {}

  exportLotToAlfresco(lotData: any): Observable<Blob> {
    return this.http.post(this.API_URL, lotData, { responseType: 'blob' });
  }
}
