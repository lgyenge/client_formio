import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioAppConfig, FormioForm, FormioService } from '@formio/angular';
import { debounceTime, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { DinetFormioForm } from '../../dinet_common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meo',
  templateUrl: './meo.component.html',
  styleUrl: './meo.component.scss',
})
export class MeoComponent implements OnInit, OnDestroy {
  userSearchResults: DinetFormioForm[] = [];
  userDisplayResults: DinetFormioForm[] = [];

  searchForm!: FormGroup;
  service: FormioService;
  form_ids: string[] = [];
  loadFormsSubscription: Subscription = new Subscription();
  searchFormSubscription: Subscription = new Subscription();

  constructor(
    public appConfig: FormioAppConfig,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.service = new FormioService(this.appConfig.appUrl);
  }

  ClickedRow(i: number, form: DinetFormioForm) {
    localStorage.setItem('form_id', this.userDisplayResults[i]._id ?? '');
    this.FindStep(1, form);
  }
  FindStep(i: number, form: DinetFormioForm) {
    let name = form.name;
    //console.log(form)
    let query = {
      params: {
        //todo: regex pontosítás
        name__regex: '/' + name + '/i',
        tags__eq: ['common'],
        type: 'form',
      },
    };
    //console.log('query:', query);
    this.loadFormsSubscription = this.service
      .loadForms(query)
      .subscribe((results) => {
        /* type error in formio */
        //console.log('results:', results);
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
        dinetResults.forEach((element) => {
          if (element._id) {
          this.form_ids.push(element._id);
          }
        });
        localStorage.setItem('forms', JSON.stringify(dinetResults));
        //console.log('form_ids', this.form_ids);
        this.router.navigate(['lot'], { relativeTo: this.route });

      });
  }

  ngOnDestroy() {
    this.loadFormsSubscription.unsubscribe();
    this.searchFormSubscription.unsubscribe();
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      name: [''],
    });
    localStorage.setItem('forms', '');
    this.searchFormSubscription = this.searchForm
      .get('name')!
      .valueChanges.pipe(
        debounceTime(400),
        filter((value) => value.length > 2),
        tap({
          next: (value: any) => {
            localStorage.setItem(
              'meo_query',
              JSON.stringify({
                params: {
                  title__regex: '/' + value + '/i',
                  tags__eq: ['common'],
                  type: 'form',
                },
              })
            );
            // kell ez?
            localStorage.setItem('meo_searchInput', value);
          },
        }),
        //tap((value: any) => console.log(value),
        //switchMap((value: any) => this.service.loadForms({params:{ title__regex:   value , tags__eq: ['common'], type: 'form' }})),
        //switchMap((value: any) => this.service.loadForms({params:{ title__regex: '/' + value + '/i', tags__eq: ['common'], type: 'form' }})),
        switchMap((value: any) =>
          this.service.loadForms(
            JSON.parse(localStorage.getItem('meo_query') || '{}')
          )
        )
        //takeUntil(this.destroy$)
      )
      .subscribe((results) => {
        //console.log('Results in ngOnInit', results);
        this.userSearchResults = results as DinetFormioForm[];

        this.userDisplayResults = (results as DinetFormioForm[]).filter(
          checkSuffix
        );
        //console.log(this.userSearchResults);

        function checkSuffix(form: FormioForm) {
          if (form.name) {
            // console.log(form.name.substring(form.name.length - 2, form.name.length));
          }
          return (
            form.name &&
            !(
              form.name.substring(form.name.length - 2, form.name.length) ===
                'x1' ||
              form.name.substring(form.name.length - 2, form.name.length) ===
                'x2' ||
              form.name.substring(form.name.length - 2, form.name.length) ===
                'x3'
            )
          );
        }
      });
  }
}
