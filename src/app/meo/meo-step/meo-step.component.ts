/** Original meo-step component refactored by gemini */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormioAppConfig, FormioService } from '@formio/angular';
import { FormManagerService } from '@formio/angular/manager';
import { FormioAuthService } from '@formio/angular/auth';
import { DataService } from '../../data.service';
import { DinetFormioForm, Suffix } from '../../dinet_common';
import { Subscription, switchMap } from 'rxjs';

const FORMS_KEY = 'forms';
const SUFFIXES_KEY = 'suffixes';
const LOT_NO_KEY = 'lot_no';
const FORM_ID_KEY = 'formId';
const XX_MARKER = 'xx';
const XXH_MARKER = 'xxH';
const NH_SUFFIX = 'NH';

@Component({
  selector: 'app-meo-step',
  templateUrl: './meo-step.component.html',
  styleUrl: './meo-step.component.scss',
})
export class MeoStepComponent implements OnInit, OnDestroy {
  params: any;

  updateForm(suffix: Suffix | undefined) {
    console.log('send suffix', suffix);
    this.dataService.sendMessage(suffix ?? { formId: '', name: '' });
  }
  headerFormservice: FormioService = new FormioService(this.appConfig.appUrl);

  forms: DinetFormioForm[] = JSON.parse(localStorage.getItem(FORMS_KEY) ?? '[]');
  suffixes: Suffix[] = [];
  suffix: Suffix | undefined = undefined;
  query = { 'data.lot1__eq': localStorage.getItem(LOT_NO_KEY) };
  subscription!: Subscription;

  constructor(
    public service: FormManagerService,
    public auth: FormioAuthService,
    public route: ActivatedRoute,
    public appConfig: FormioAppConfig,
    public router: Router,
    private dataService: DataService
  ) {}
  ngOnDestroy(): void {
    // Perform any necessary cleanup here
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    console.log('MeoStepComponent is being destroyed');
  }

  private initializeSuffixes(
    forms: DinetFormioForm[],
    formId: string
  ): Suffix | undefined {
    const suffixes: Suffix[] = [];
    let currentSuffix: Suffix | undefined;

    forms.forEach((form) => {
      if (form.name) {
        let suffix: Suffix;
        if (form.name.includes(XX_MARKER)) {
          suffix = {
            formId: form._id,
            name: form.name.substring(
              form.name.indexOf(XX_MARKER) + 2,
              form.name.length
            ),
          };
        } else {
          suffix = { formId: form._id ?? '', name: NH_SUFFIX };
        }
        suffixes.push(suffix);
        if (form._id === formId) {
          currentSuffix = suffix;
        }
      }
    });

    this.suffixes = suffixes;
    localStorage.setItem(SUFFIXES_KEY, JSON.stringify(this.suffixes));
    return currentSuffix;
  }

  private initializeHeaderFormService(forms: DinetFormioForm[]) {
    const foundHeaderForm = forms.find((form) => form.name?.includes(XXH_MARKER));
    if (foundHeaderForm) {
      const headerUrl = `${this.appConfig.appUrl}/form/${foundHeaderForm._id}/submission`;
      this.headerFormservice = new FormioService(headerUrl);
    }
    console.log('this.headerFormservice', this.headerFormservice);
  }

  ngOnInit() {
    this.subscription = this.route.params
      .pipe(
        switchMap((params) => {
          this.suffix = this.initializeSuffixes(this.forms, params['id']);
          this.params = params;
          this.initializeHeaderFormService(this.forms);
          return this.headerFormservice.loadSubmissions({ params: this.query });
        })
      )
      .subscribe((subs: any) => {
        console.log('subs', subs);
        if (subs.length !== 0) {
          /** set In Out quantities for Header form */
          this.suffix!.headerSubmission = subs[0];
          this.suffix!.inCnt = subs[0].data['In' + this.suffix?.name!];
          this.suffix!.outCnt = subs[0].data['Out' + this.suffix?.name!];
        }
        /* send suffix to meo-step-index2 component */
        this.updateForm(this.suffix);
        localStorage.setItem(FORM_ID_KEY, this.params['id']);
      });
    this.service.reset(this.route);
    console.log(this.service);
    //console.log(this.auth)
  }
}
