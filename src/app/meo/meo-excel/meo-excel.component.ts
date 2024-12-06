import { Component, OnInit } from '@angular/core';
import {
  FormioAppConfig,
  FormioForm,
  FormioService,
  FormioSubmission,
} from '@formio/angular';
import { ExcelService } from '../../excel.service';
import { DinetFormioForm } from '../../dinet_common';

@Component({
  selector: 'app-meo-excel',
  templateUrl: './meo-excel.component.html',
  styleUrl: './meo-excel.component.scss',
})
export class MeoExcelComponent implements OnInit {
  service: FormioService;
  //userSearchResults: any = [];

 /*  data = [
    { Name: 'John Doe', Age: 30, City: 'New York' },
    { Name: 'Jane Smith', Age: 25, City: 'San Francisco' },
    // Add more data as needed
  ];
 */
  query = JSON.parse(localStorage.getItem('meo_query') || '{}');
  formIds = JSON.parse(localStorage.getItem('form_ids') ?? '[]');
  forms: DinetFormioForm[] = JSON.parse(localStorage.getItem('forms') ?? '[]');
  keys: (string | undefined)[] = [];
  labels: (string | undefined)[] = [];
  raw: string[] = [];
  raws: string[][] = [];
  lot: string = localStorage.getItem('lot_no') || 'noLot';
  file_name: string = this.forms[0].name || 'noFilename';

  constructor(
    public appConfig: FormioAppConfig,
    private excelService: ExcelService
  ) {
    this.service = new FormioService(
      this.appConfig.appUrl + '/form/' + this.formIds[0]
    );
    //this.service = new FormioService(this.appConfig.appUrl);
    //this.service = new FormioService(this.appConfig.appUrl + '/form/' + msg);
    //this.service.loadForms(this.query);
  }

  CreateTable(form: DinetFormioForm, submissions: FormioSubmission[]) {
    //console.log('form:' + form);
    let keys: (string | undefined)[] = [];
    let labels: (string | undefined)[] = [];
    let rows: (string | undefined)[] = [];
    //console.log(`form: ${JSON.stringify(form)}`);
    //console.log(`submissions: ${JSON.stringify(submissions)}`);
    form.components?.forEach((component) => {
      if (component.type !== 'button'&& component.key !== 'lot1') {
        keys.push(component.key);
        labels.push(component.label);
      }
    });
    this.keys = keys;
    this.labels = labels;
    console.log('keys:' + keys);
    console.log('labels:' + labels);

    submissions.forEach((submission) => {
      //let raw: any[] = [];
      let raw: string[] = [];

      /* key never undefined */
      keys.forEach((key) => {
        if (key !== undefined && key !== 'lot1') {
          /* pushed value undefined is data[key] not exist  */

          raw.push(submission.data[key]);
        }
      });
      console.log(raw);
      this.raws.push(raw);
    });
  }

  ngOnInit(): void {
    this.service.loadSubmissions(this.query).subscribe((results) => {
      //this.userSearchResults = results;
      this.CreateTable(this.forms[0], results as FormioSubmission[]);
    });
  }
  exportToExcel(): void {
    this.excelService.generateExcel(
      this.lot,
      this.file_name,
      this.keys,
      this.labels,
      this.raws
    );
  }
}
