import { Component, OnInit } from '@angular/core';
import {
  FormioAppConfig,
  FormioForm,
  FormioService,
  FormioSubmission,
} from '@formio/angular';
import { ExcelService } from '../../excel.service';
import { DinetFormioForm, SheetData } from '../../dinet_common';

@Component({
  selector: 'app-meo-excel',
  templateUrl: './meo-excel.component.html',
  styleUrl: './meo-excel.component.scss',
})
export class MeoExcelComponent implements OnInit {
  services: FormioService[] = [] // | undefined;
  forms: DinetFormioForm[] = JSON.parse(localStorage.getItem('forms') ?? '[]');
  keys: (string | undefined)[] = [];
  labels: (string | undefined)[] = [];
  row: string[] = [];
  rows: string[][] = [];
  lot: string = localStorage.getItem('lot_no') || 'noLot';
  query = {
    params: {
     'data.lot1__eq': this.lot,
     'limit': 100,
     'sort': 'data.serial',
     'skip': 0
    },
  };

  sheetData: SheetData[] = [];
  constructor(
    public appConfig: FormioAppConfig,
    private excelService: ExcelService
  ) {
    this.forms.forEach((form) => {
      //console.log(form);
      let formio = new FormioService(
        this.appConfig.appUrl + '/form/' + form._id
      );
      this.services.push(formio);
    });
    //console.log(this.services);
  }

  CreateTable(
    form: DinetFormioForm,
    submissions: FormioSubmission[]
  ): SheetData {
    let keys: string[] = [];
    let labels: string[] = [];
    let rows: string[][] = [];
    let sd: SheetData;
    form.components?.forEach((component) => {
      if (component.type !== 'button' && component.key !== 'lot1') {
        keys.push(component.key ?? '');
        labels.push(component.label ?? '');
      }
    });
    //console.log('keys:' + keys);
    //console.log('labels:' + labels);
    submissions.forEach((submission) => {
      let row: any[] = [];
      /* key never undefined */
      keys.forEach((key) => {
        if (key !== undefined && key !== 'lot1') {
          /* pushed value undefined if data[key] not exist  */
          row.push(submission.data[key]);
        }
      });
      //console.log(row);
      rows.push(row);
    });
    sd = {
      lot: this.lot,
      file_name: form.name || '',
      keys: keys,
      labels: labels,
      rows: rows,
    };
    //console.log(sd);
    return sd;
  }

  ngOnInit(): void {
    this.services.forEach((service, index) => {
      service.loadSubmissions(this.query).subscribe((results) => {
        //console.log(results)
        //console.log(this.forms[index])
        this.sheetData.push(
          this.CreateTable(this.forms[index], results as FormioSubmission[])
        );
      });
    });
  }
  exportToExcel(): void {
    this.sheetData.sort((a, b) => {
      const nameA = (a.file_name ?? '').toUpperCase(); // ignore upper and lowercase
      const nameB = (b.file_name ?? '').toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
    this.excelService.generateExcel(this.sheetData);
    //console.log(this.sheetData)
  }
}
