import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioAppConfig, FormioForm, FormioService } from '@formio/angular';
import { debounceTime, filter, switchMap } from 'rxjs';
import { DinetFormioForm } from '../../dinet_common';
import { Subscription, map } from 'rxjs';

@Component({
  selector: 'app-meo2',
  templateUrl: './meo2.component.html',
  styleUrl: './meo2.component.scss',
})
export class Meo2Component implements OnInit, OnDestroy {
  url = this.appConfig.appUrl;
  lotUrl = this.appConfig.appUrl;

  userDisplayResults: DinetFormioForm[] = [];
  searchForm!: FormGroup;
  loadFormsSubscription: Subscription = new Subscription();
  searchFormSubscription: Subscription = new Subscription();
  loadLotSubscription: Subscription = new Subscription();
  formService = new FormioService(this.url);
  lotFormService = new FormioService(this.url);
  query = {
    params: {
      name__eq: 'lot',
      //tags__eq: ['common'],
      type: 'resource',
    },
  };

  constructor(
    public appConfig: FormioAppConfig,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /** ez a form parameter nem form, hanem a resource (lot) form selected submission!!!*/
  ClickedRow(i: number, form: DinetFormioForm) {
    localStorage.setItem(
      'prod_no',
      this.userDisplayResults[i].data.productNo ?? ''
    );
    localStorage.setItem('lot_no', this.userDisplayResults[i].data.lot ?? '');
    localStorage.setItem('initial_quantity', this.userDisplayResults[i].data.initialQuantity ?? '');

    this.FindStep(1, form);
  }
  FindStep(i: number, form: DinetFormioForm) {
    let name = localStorage.getItem('prod_no');
    //console.log(form)
    let query = {
      params: {
        name__regex: '/' + name + '/i',
        tags__eq: ['common'],
        type: 'form',
      },
    };
    /** ehhez a lekérdezéshes csak a base url kell
     * ezért a lot-ra beállított formioService-t használom
     */
    //this.formService = new FormioService(this.url);
    //console.log('FormioAppConfig:', this.appConfig);
    console.log('url:', this.url);
    console.log('formService:', this.formService);
    this.loadFormsSubscription = this.formService
      .loadForms(query)
      .subscribe({
        next: (results) => {
          /* type error in formio */
          console.log('forms:', results);
          let dinetResults = results as DinetFormioForm[];
          // reverse form order in forms
          dinetResults.sort((a, b) => {
            const nameA = (a.name ?? '').toUpperCase(); // ignore upper and lowercase
            const nameB = (b.name ?? '').toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            // names must be equal
            return 0;
          });
          localStorage.setItem('forms', JSON.stringify(dinetResults));
          //this.router.navigate(['lot'], { relativeTo: this.route });
          if (dinetResults.length > 0) {
            this.router.navigate(['step', dinetResults[0]._id], {
              relativeTo: this.route,
            });
          } else {
            alert('No Product found!');
          }
        },
        error: (e) => {
          console.error(e)
          alert('Error loading forms: ' + e);

        },
        complete: () => console.info('complete'),
      })
  }

  ngOnDestroy() {
    this.loadFormsSubscription.unsubscribe();
    this.searchFormSubscription.unsubscribe();
    this.loadLotSubscription.unsubscribe();
  }

  ngOnInit() {
    console.log('formService:', this.formService);

    this.loadLotSubscription = this.lotFormService
      .loadForms(this.query)
      .subscribe({ next: (results) => {
        console.log('lots:', results);
        if ((results as DinetFormioForm[]).length > 0) {
          const lotId = (results as DinetFormioForm[])[0]._id ?? '';
          //localStorage.setItem('lotId', JSON.stringify(lotId));
          this.lotUrl = this.appConfig.appUrl + '/form/' + lotId + '/submission';
          this.lotFormService = new FormioService(this.lotUrl);
        }
      },
        error: (e) => {
          alert('Error loading forms: ' + e);
      },
        complete: () => console.info('complete'),});

    this.searchForm = this.fb.group({ lot: [''] });
    localStorage.setItem('forms', '');
    this.searchFormSubscription = this.searchForm
      .get('lot')!
      .valueChanges.pipe(
        debounceTime(400),
        filter((value) => value.length > 1),
        map((value) => {
          return value.trim();
        }),
        switchMap((value: any) =>
          this.lotFormService.loadSubmissions({
            params: {
              'data.lot__regex': '/' + value + '/i',
              'data.inProduction': 'true',
            },
          })
        )
      )
      .subscribe((results) => {
        //console.log('Results in ngOnInit', results);
        this.userDisplayResults = results as DinetFormioForm[];
      });
  }
}
