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

  /**
   * Given a list of forms and a formId, this function initializes the suffixes
   * by looping through the forms and extracting the suffixes from the form names.
   * If the form name includes the XX_MARKER, the suffix is the substring after
   * the marker. Otherwise, the suffix is 'NH'. The suffixes are stored in the
   * component's `suffixes` array and in local storage under the key SUFFIXES_KEY.
   * The function returns the suffix object for the given formId.
   * @param forms the list of forms
   * @param formId the id of the form
   * @returns the suffix object for the given formId
   */
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

  /**
   * Initialize the header form service.
   * The header form is the one with the form name that includes the XXH_MARKER.
   * If the header form is found, a new FormioService is created with the submission
   * url for the header form.
   * @param forms the list of forms
   */
  private initializeHeaderFormService(forms: DinetFormioForm[]) {
    const foundHeaderForm = forms.find((form) => form.name?.includes(XXH_MARKER));
    if (foundHeaderForm) {
      const headerUrl = `${this.appConfig.appUrl}/form/${foundHeaderForm._id}/submission`;
      this.headerFormservice = new FormioService(headerUrl);
    }
    console.log('this.headerFormservice', this.headerFormservice);
  }

  /**
   * Called when the component is initialized.
   * Subscribes to the route parameter and:
   * 1. initializes the suffixes
   * 2. initializes the header form service
   * 3. loads the submissions for the header form
   * 4. sets the In Out quantities for the Header form
   * 5. sends the suffix to the meo-step-index2 component
   * 6. stores the form id in local storage
   * 7. resets the service with the current route
   * @returns void
   */
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
