import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioAppConfig, FormioService } from '@formio/angular';
import { debounceTime, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { LotConfig } from '../../../config ';
import { DinetFormioForm } from '../../dinet_common';
@Component({
  selector: 'app-meo-lot',
  templateUrl: './meo-lot.component.html',
  styleUrl: './meo-lot.component.scss',
})
export class MeoLotComponent implements OnInit {
  //userSearchResults: FormioForm[] = [];
  userSearchResults: any = [];
  searchForm!: FormGroup;
  service: FormioService;
  form_id: string | null = '';

  url = this.appConfig.appUrl + '/form/' + LotConfig.lotId + '/submission';
  private destroy$ = new Subject<void>();

  constructor(
    public appConfig: FormioAppConfig,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.service = new FormioService(this.url);
  }

  ClickedRow(i: number, form: DinetFormioForm) {
    localStorage.setItem('lot_no', this.userSearchResults[i].data.lot);
    //console.log(i, this.userSearchResults[i].title);
    this.form_id = localStorage.getItem('form_id');
    this.router.navigate(['step', this.form_id], { relativeTo: this.route });
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      lot: [''],
    });
    this.searchForm
      .get('lot')
      ?.valueChanges.pipe(
        debounceTime(400),
        filter((value) => value.length > 1),
        tap({
          next: (value: any) => {
            localStorage.setItem(
              'meo_lot_query',
              JSON.stringify({
                params: {
                  'data.lot__regex': '/' + value + '/i',
                  'data.inproduction': 'true',
                  type: 'resource',
                },
              })
            );
            localStorage.setItem('meo_lot_searchInput', value);
          },
        }),
        switchMap((value: any) =>
          this.service.loadSubmissions(
            JSON.parse(localStorage.getItem('meo_lot_query') || '{}')
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((results) => {
        this.userSearchResults = results;
      });
  }
}
