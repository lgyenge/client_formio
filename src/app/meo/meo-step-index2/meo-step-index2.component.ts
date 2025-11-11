import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormioAppConfig, FormioService } from '@formio/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  Subject,
  switchMap,
  takeUntil,
  tap,
  EMPTY,
  map,
  filter,
  catchError,
} from 'rxjs';
import { DataService } from '../../data.service';
import {
  DinetFormioForm,
  Submission,
  Limit,
  TableData,
  Suffix,
} from '../../dinet_common';
import { FormioServiceFactoryService } from '../../formio-service-factory.service';
import { FormioAuthService } from '@formio/angular/auth';

@Component({
  selector: 'app-meo-step-index2',
  templateUrl: './meo-step-index2.component.html',
  styleUrls: ['./meo-step-index2.component.scss'],
})
export class MeoStepIndex2Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  lot_no = localStorage.getItem('lot_no');
  prod_no = localStorage.getItem('prod_no');
  initial_quantity = localStorage.getItem('initial_quantity');

  //query = { 'data.lot1__eq': this.lot_no };
  query = {
    'data.lot1__eq': this.lot_no,
    limit: 100,
    sort: 'data.serial',
    skip: 0,
  };

  forms = JSON.parse(
    localStorage.getItem('forms') ?? '[]'
  ) as DinetFormioForm[];
  form!: DinetFormioForm;
  formId = localStorage.getItem('formId');
  url = '';
  service?: FormioService;
  limits: Limit[] = [];
  submissions: Submission[] = [];
  tableRows: TableData[][] = [];
  tableHeader: string[] = [];
  formioUser = JSON.parse(localStorage.getItem('formioUser') ?? '{}');
  inOutForm!: FormGroup;
  headerForm?: DinetFormioForm;
  headerFormservice: FormioService;
  headerSubmission: any;
  suffix: Suffix = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private appConfig: FormioAppConfig,
    private fb: FormBuilder,
    private formioFactory: FormioServiceFactoryService,
    public auth: FormioAuthService
  ) {
    // Default header form service (will be updated later if a header form is found)
    this.headerFormservice = this.formioFactory.create(this.appConfig.appUrl);
  }

  ngOnInit(): void {
    this.inOutForm = this.fb.group({
      inCnt: [''],
      outCnt: [''],
    });

    this.initHeaderForm();

    this.dataService.message$
      .pipe(
        takeUntil(this.destroy$),
        tap((msg) => console.log('Message received:', msg)),
        // Validate and extract formId + foundForm
        map((msg: Suffix | string | null) => {
          if (!msg || typeof msg === 'string') {
            console.error('Invalid or null message type received:', msg);
            return null;
          }

          const foundForm = this.forms.find((form) => form._id === msg.formId);
          if (!msg.formId || !foundForm) {
            console.error(
              'Form not found or formId is undefined for msg:',
              msg?.formId
            );
            return null;
          }

          // ✅ Safe state mutations outside switchMap
          this.suffix = msg;
          this.form = foundForm;
          this.limits = this.setLimits(this.form);

          const url = `${this.appConfig.appUrl}/form/${msg.formId}/submission`;
          this.service = this.formioFactory.create(url);

          return {
            service: this.service,
            query: this.query as { 'data.lot1__eq': string | null },
          };
        }),
        filter(
          (
            ctx
          ): ctx is {
            service: FormioService;
            query: { 'data.lot1__eq': string | null };
          } => ctx !== null
        ),
        switchMap((ctx) =>
          ctx.service.loadSubmissions({ params: ctx.query }).pipe(
            catchError((err) => {
              this.handleError(err);
              // ✅ Prevent stream termination
              return EMPTY;
            })
          )
        )
      )
      .subscribe({
        next: (results: any) => this.handleSubmissions(results as Submission[]),
        complete: () => console.info('complete'),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initHeaderForm(): void {
    const foundHeaderForm = this.forms.find(
      (form) => form.name && form.name.includes('xxH')
    );

    if (foundHeaderForm) {
      console.log('foundHeaderForm:', foundHeaderForm);
      const headerUrl = `${this.appConfig.appUrl}/form/${foundHeaderForm._id}/submission`;
      this.headerFormservice = this.formioFactory.create(headerUrl);
    } else {
      console.error('Header form not found!');
    }
  }

  private handleSubmissions(results: Submission[]): void {
    this.headerSubmission = this.suffix?.headerSubmission;

    this.inOutForm.patchValue({
      inCnt: this.suffix?.inCnt ?? '',
      outCnt: this.suffix?.outCnt ?? '',
    });

    this.submissions = results;
    this.createTableRows(this.form, this.submissions);
    this.createTableHeader(this.form);
  }

  private handleError(err: unknown): void {
    console.error('Error loading forms:', err);
    // replace with better UI (snackbar/toast)
    alert('Error loading forms. Please try again later.');
  }

  onSubmit(): void {
    if (!this.headerFormservice) return;
    this.suffix.inCnt = this.inOutForm.value.inCnt;
    this.suffix.outCnt = this.inOutForm.value.outCnt;

    if (!this.headerFormservice) return;

    if (!this.headerSubmission) {
      this.headerSubmission = {
        data: {
          lot1: this.lot_no,
          serial: 0,
          user: this.formioUser?.data?.email,
        },
      };
    }

    this.headerSubmission.data[`In${this.suffix?.name}`] = this.suffix.inCnt;
    this.headerSubmission.data[`Out${this.suffix?.name}`] = this.suffix.outCnt;

    this.headerFormservice
      .saveSubmission(this.headerSubmission)
      .pipe(takeUntil(this.destroy$))
      .subscribe((headerSaved: any) => console.log('headerSaved', headerSaved));
  }

  private setLimits(form: DinetFormioForm): Limit[] {
    const limits: Limit[] = [];
    form.components?.forEach((component: any) => {
      if (component.type === 'number' && component['properties']) {
        const nominal = +component['properties']?.nominalValue || 0;
        const tolMin = +component['properties']?.toleranceMin || 0;
        const tolMax = +component['properties']?.toleranceMax || 0;
        //console.log('nominal, tolMin, tolMax:', nominal, tolMin, tolMax);
        /* limits.push({
          key: component.key ?? '',
          nominalValue: nominal,
          lowerRedLimit: nominal - tolMin,
          upperRedLimit: nominal + tolMax,
          lowerYellowLimit: nominal - 0.7 * tolMin,
          upperYellowLimit: nominal + 0.7 * tolMax,
        }); */
        /** round the limits */
        limits.push({
          key: component.key ?? '',
          nominalValue: nominal,
          lowerRedLimit: Math.round((nominal - tolMin + Number.EPSILON) * 100) / 100,
          upperRedLimit: Math.round((nominal + tolMax + Number.EPSILON) * 100) / 100,
          lowerYellowLimit: Math.round((nominal - 0.7 * tolMin + Number.EPSILON) * 100) / 100,
          upperYellowLimit: Math.round((nominal + 0.7 * tolMax + Number.EPSILON) * 100) / 100,
        });
      }
    });
    console.log('Limits set:', limits);

    return limits;
  }

  private createTableRows(
    form: DinetFormioForm,
    submissions: Submission[]
  ): void {
    this.tableRows = submissions.map((submission) => {
      const row: TableData[] = [];
      form.components?.forEach((component: any) => {
        const type = component.type ?? ''; // ensure string
        if (!['number', 'checkbox'].includes(type)) return;

        const tableData: TableData = {
          data: NaN,
          componentType: type, // always string
          limit: {
            key: '',
            nominalValue: 0,
            lowerRedLimit: NaN,
            upperRedLimit: NaN,
            lowerYellowLimit: NaN,
            upperYellowLimit: NaN,
          },
        };

        if (
          component.key &&
          (submission.data[component.key] ??
            submission.data[component.key] === 0)
        ) {
          tableData.data = +submission.data[component.key];
        }

        if (type === 'number') {
          const foundLimit = this.limits.find((l) => l.key === component.key);
          if (foundLimit) tableData.limit = foundLimit;
        }

        row.push(tableData);
      });

      return row;
    });
    console.log('tableRows', this.tableRows);
  }

  private createTableHeader(form: DinetFormioForm): void {
    this.tableHeader =
      form.components
        ?.filter((c: any) => ['number', 'checkbox'].includes(c.type ?? ''))
        .map((c: any) => c.label ?? '')
        .filter((label: string) => !!label) ?? [];
  }

  valueIsNaN(value: any): boolean {
    return isNaN(value);
  }

  ClickedRow(i: number): void {
    const id = this.submissions[i]?._id;
    if (id) {
      this.router.navigate([id, 'view'], { relativeTo: this.route });
    }
  }
}
