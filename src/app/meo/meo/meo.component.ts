import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioAppConfig, FormioForm, FormioService } from '@formio/angular';
import { debounceTime, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { DinetFormioForm } from '../../dinet_common';

@Component({
  selector: 'app-meo',
  templateUrl: './meo.component.html',
  styleUrl: './meo.component.scss',
})
export class MeoComponent implements OnInit {
  userSearchResults: DinetFormioForm[] = [];
  //userSearchResults: any = [];
  userDisplayResults: DinetFormioForm[] = [];
  //userDisplayResults: any = [];

  searchForm!: FormGroup;
  service: FormioService;
  form_ids: string[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    public appConfig: FormioAppConfig,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.service = new FormioService(this.appConfig.appUrl);
  }

  ClickedRow(i: number, form: DinetFormioForm) {
    localStorage.setItem('form_id', this.userSearchResults[i]._id);
    this.FindStep(1, form);
    this.router.navigate(['lot'], { relativeTo: this.route });
  }

  FindStep(i: number, form: DinetFormioForm) {
    //let name = form.name + '-st' + i;
    let name = form.name;
    let query = {
      params: {
        //todo: redux pontosítás
        name__regex: '/' + name + '/i',
        tags__eq: ['common'],
        type: 'form',
      },
    };
    //console.log('query:', query);
    this.service
      .loadForms(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe((results) => {
        /* type error in formio */
        let dinetResults = results as DinetFormioForm[];
        dinetResults.forEach((element) => {
          this.form_ids.push(element._id);
        });
        localStorage.setItem('form_ids', JSON.stringify(this.form_ids));
        localStorage.setItem('forms', JSON.stringify(dinetResults));
        //console.log('form_ids', this.form_ids);
      });
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      name: [''],
    });
    this.searchForm
      .get('name')
      ?.valueChanges.pipe(
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
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((results) => {
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
