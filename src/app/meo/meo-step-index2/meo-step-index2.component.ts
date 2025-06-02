import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormioAppConfig, FormioService } from '@formio/angular';
import { forkJoin, mergeMap, skip, Subscription, switchMap, tap } from 'rxjs';
import { DataService } from '../../data.service';
import { DinetFormioForm, Limit, TableData, Suffix } from '../../dinet_common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { initial } from 'lodash';
//import { map } from 'lodash';
@Component({
  selector: 'app-meo-step-index2',
  templateUrl: './meo-step-index2.component.html',
  styleUrl: './meo-step-index2.component.scss',
})
export class MeoStepIndex2Component implements OnInit, OnDestroy {
  subscription1: Subscription | undefined;
  subscription2: Subscription | undefined;

  lot_no = localStorage.getItem('lot_no');
  prod_no = localStorage.getItem('prod_no');
  initial_quantity = localStorage.getItem('initial_quantity');

  query = { 'data.lot1__eq': this.lot_no };
  forms = JSON.parse(
    localStorage.getItem('forms') ?? '[]'
  ) as DinetFormioForm[];
  form!: DinetFormioForm;
  formId = localStorage.getItem('formId');
  url = '';
  service: FormioService | undefined;
  limits: Limit[] = [];
  submissions: any[] = [];
  tableRows: TableData[][] = [];
  tableHeader: string[] = [];
  formioUser = JSON.parse(localStorage.getItem('formioUser') ?? '{}');
  inOutForm!: FormGroup;
  //formattedMessage: string = '';
  headerForm: DinetFormioForm | undefined = undefined;
  headerFormservice: FormioService = new FormioService(this.appConfig.appUrl);
  headerSubmission: any;
  suffix: Suffix = {};

  //suffixes = JSON.parse(localStorage.getItem('suffixes') ?? '[]')

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public dataService: DataService,
    public appConfig: FormioAppConfig,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.inOutForm = this.fb.group({
      inCnt: [''],
      outCnt: [''],
    });
    /** Load Header form service  */
    const foundHeaderForm = this.forms
      ? this.forms.find((form) => form.name && form.name.indexOf('xxH') !== -1)
      : undefined;
    if (foundHeaderForm) {
      console.log('foundHeaderForm:', foundHeaderForm);
      const headerUrl =
        this.appConfig.appUrl + '/form/' + foundHeaderForm._id + '/submission';
      this.headerFormservice = new FormioService(headerUrl);
      console.log('this.headerFormservice', this.headerFormservice);
    } else {
      console.error('Header form not found!');
    }
    this.subscription1 = this.dataService.message$
      .pipe(
        tap((msg) => {
          console.log(' message received:', msg);
        }),
        /** ha skip(1) van, akkor az edit + visszanyil után rossz
         * ha nincs, akkor a form felöltés után az először küldott message
         * még a régi formid-t tartalmazza  */
        //skip(1),
        switchMap((msg: Suffix | string | null) => {
          if (!msg || typeof msg === 'string') {
            // Handle the case where msg is null or a string
            console.error('Invalid or null message type received:', msg);
            return [];
          }
          // Check if form exist, drope if not
          if (!this.forms.find((form) => form._id === msg.formId)){
            console.error('Form not found for msg:', msg.formId);            
            return [];
          }
          
          console.log('Received message:', msg);
          this.suffix = msg;
          this.url =
            this.appConfig.appUrl + '/form/' + msg.formId + '/submission';
          this.service = new FormioService(this.url);
          console.log('this.service', this.service);

          const foundForm = this.forms
            ? this.forms.find((form) => form._id === msg.formId)
            : undefined;
          if (foundForm) {
            this.form = foundForm;
            //console.log('Form found:', this.form);
            this.limits = this.setLimits(this.form);
          } else {
            //console.error('Form not found for msg:', msg.formId);
          }
          return this.service.loadSubmissions({ params: this.query });
        })
      )
      .subscribe({
        next: (results) => {
          this.headerSubmission = this.suffix?.headerSubmission;
          console.log('headerSubmission:', this.headerSubmission);
          //console.log('suffix', this.suffix);
          //console.log('this.form._id:', this.form._id);
          if (this.suffix.inCnt) {
            this.inOutForm.patchValue({
              inCnt: this.suffix.inCnt,
              outCnt: this.suffix.outCnt,
            });
          } else {
            this.inOutForm.patchValue({
              inCnt: '',
              outCnt: '',
            });
          }
          this.submissions = results as any[];
          this.createTableRows(this.form, this.submissions);
          this.createTableHeader(this.form);
        },
         error: (err) => {
          console.log('Error loading forms:', err);
          alert('Error loading forms: ' + err);
          window.location.reload()
          return;
        }, 
        complete: () => console.info('complete'),
      });
  }

  ngOnDestroy(): void {
    this.subscription1?.unsubscribe();
    this.subscription2?.unsubscribe();
  }

  onSubmit() {
    //console.log(this.inOutForm.value);
    this.suffix.inCnt = this.inOutForm.value.inCnt;
    this.suffix.outCnt = this.inOutForm.value.outCnt;
    if (this.headerFormservice) {
      //console.log('this.suffix', this.suffix)
      if (!this.headerSubmission) {
        this.headerSubmission = {
          data: {
            lot1: this.lot_no,
            serial: +0,
            user: this.formioUser?.data.email,
          },
        };
      }
      this.headerSubmission.data['In' + this.suffix?.name!] = this.suffix.inCnt;
      this.headerSubmission.data['Out' + this.suffix?.name!] =
        this.suffix.outCnt;
      this.subscription2 = this.headerFormservice
        .saveSubmission(this.headerSubmission)
        .subscribe((headerSaved: any) => {
          console.log('headerSaved', headerSaved);
        });
      //console.log('this.headerSubmission', this.headerSubmission)
    }
  }

  setLimits(form: DinetFormioForm): Limit[] {
    const parLimits: Limit[] = [];
    form.components?.forEach((component) => {
      let key: string = '';
      //todo add more limits
      let parLimit: Limit = {
        key: '',
        nominalValue: 0,
        lowerRedLimit: 0,
        upperRedLimit: 0,
        lowerYellowLimit: 0,
        upperYellowLimit: 0,
      };
      if (component.type === 'number') {
        if (component.key) {
          parLimit.key = component.key;
        }
        if (component['properties']) {
          parLimit.nominalValue = component['properties']?.nominalValue;
          parLimit.lowerRedLimit =
            +parLimit.nominalValue + +component['properties']?.toleranceMin;
          parLimit.upperRedLimit =
            parLimit.nominalValue + +component['properties']?.toleranceMax;
          parLimit.lowerYellowLimit =
            +parLimit.nominalValue +
            0.7 * +component['properties']?.toleranceMin;
          parLimit.upperYellowLimit =
            parLimit.nominalValue +
            0.7 * +component['properties']?.toleranceMax;
          parLimits.push(parLimit);
        }
      }
    });
    //console.log('parLimits:', parLimits);
    return parLimits;
  }

  createTableRows(form: DinetFormioForm, submissins: any): void {
    let tableRow: TableData[] = [];
    let tableRows: TableData[][] = [];
    submissins.forEach(
      (submission: { data: { [x: string]: string | number | boolean } }) => {
        tableRow = [];

        // todo TableData Limit összevonható ???
        form.components?.forEach((component) => {
          let tableData: TableData = {
            data: NaN,
            componentType: '',
            limit: {
              key: '',
              nominalValue: 0,
              lowerRedLimit: 0,
              upperRedLimit: 0,
              lowerYellowLimit: 0,
              upperYellowLimit: 0,
            },
          };
          if (component.type === 'number') {
            tableData.componentType = component.type;
            if (
              (component.key && submission.data[component.key]) ||
              (component.key && submission.data[component.key] === 0)
            ) {
              tableData.data = +submission.data[component.key];
            }
            const foundLimit = this.limits.find(
              (limit) => limit.key === component.key
            );
            //todo Jó a NaN ???
            tableData.limit = foundLimit ?? {
              key: '',
              nominalValue: 0,
              lowerRedLimit: NaN,
              upperRedLimit: NaN,
              lowerYellowLimit: NaN,
              upperYellowLimit: NaN,
            };
            tableRow.push(tableData);
            //console.log('tableData', tableData);
          }
          if (component.type === 'checkbox') {
            tableData.componentType = component.type;
            if (
              (component.key && submission.data[component.key]) ||
              (component.key && submission.data[component.key] === 0)
            ) {
              tableData.data = +submission.data[component.key];
            }
            //const foundLimit = this.limits.find((limit) => limit.key === component.key);
            //todo Jó a NaN ???
            //tableData.limit = foundLimit ?? { key: '', nominalValue: 0, lowerRedLimit: NaN, upperRedLimit: NaN, lowerYellowLimit: NaN, upperYellowLimit: NaN };
            tableRow.push(tableData);
            //console.log('tableData', tableData);
          }
        });
        tableRows.push(tableRow);
      }
    );
    this.tableRows = tableRows;
    //console.log('tableRows', tableRows)
  }
  createTableHeader(form: DinetFormioForm): void {
    let tableHeader: string[] = [];
    form.components?.forEach((component) => {
      if (component.type === 'number' || component.type === 'checkbox') {
        if (component.label) tableHeader.push(component.label);
      }
    });
    this.tableHeader = tableHeader;
    //console.log('tableHeader', this.tableHeader)
  }

  valueIsNaN(value: any): boolean {
    return isNaN(value);
  }
  ClickedRow(i: number) {
    //console.log('ClickedRow', i, arg1);
    this.router.navigate([this.submissions[i]._id, 'view'], {
      relativeTo: this.route,
    });
  }
}
