
/** gpt5 generated test code, fixed */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Meo2Component } from './meo2.component';
import { FormioAppConfig, FormioForm, FormioService } from '@formio/angular';
import { FormioServiceFactoryService } from '../../formio-service-factory.service';
import { DinetFormioForm } from '../../dinet_common';
import { RouterModule } from '@angular/router';
import { fakeAsync, tick } from '@angular/core/testing';

describe('Meo2Component', () => {
  let component: Meo2Component;
  let fixture: ComponentFixture<Meo2Component>;
  let formioServiceSpy: jasmine.SpyObj<FormioService>;
  let formioFactorySpy: jasmine.SpyObj<FormioServiceFactoryService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    formioServiceSpy = jasmine.createSpyObj<FormioService>('FormioService', [
      'loadForms',
      'loadSubmissions',
    ]);

    formioFactorySpy = jasmine.createSpyObj<FormioServiceFactoryService>(
      'FormioServiceFactoryService',
      ['create']
    );
    formioFactorySpy.create.and.returnValue(formioServiceSpy);

    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterModule.forRoot([]),],
      declarations: [Meo2Component],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} },
        { provide: FormioAppConfig, useValue: { appUrl: 'http://test.url' } },
        { provide: FormioServiceFactoryService, useValue: formioFactorySpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Meo2Component);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should update lotUrl when lot forms are found', () => {
    const fakeLotForms: DinetFormioForm[] = [{ _id: 'lot1' } as any];
    formioServiceSpy.loadForms.and.returnValue(of(fakeLotForms as any));

    component.ngOnInit();

    expect(component.lotUrl).toBe('http://test.url/form/lot1/submission');
    expect(formioFactorySpy.create).toHaveBeenCalledWith(
      'http://test.url/form/lot1/submission'
    );
  });

  it('ngOnInit should update userDisplayResults when search returns results', fakeAsync(() => {
    const fakeLotForms: DinetFormioForm[] = [{ _id: 'lot1' } as any];
    formioServiceSpy.loadForms.and.returnValue(of(fakeLotForms as any)); // <-- add this

    const mockSubmissions = [
      {
        _id: 's1',
        data: { productNo: 'P1', lot: 'L1', initialQuantity: '10' },
      },
    ];

    // mock loadSubmissions to return your fake results
    (formioServiceSpy.loadSubmissions as jasmine.Spy).and.returnValue(
      of(mockSubmissions)
    );

    fixture.detectChanges(); // triggers ngOnInit

    // simulate user typing into the search field
    component.searchForm.get('lot')!.setValue('L1');

    // fast-forward debounceTime(400)
    tick(400);

    // now Angular runs the subscription
    expect(component.userDisplayResults.length).toBe(1);
    expect(component.userDisplayResults[0].data.lot).toBe('L1');
  }));

  it('FindStep should navigate to first matching form', () => {
    const fakeForms: DinetFormioForm[] = [
      { _id: 'form1', name: 'ABC' } as any,
      { _id: 'form2', name: 'XYZ' } as any,
    ];
    formioServiceSpy.loadForms.and.returnValue(of(fakeForms as any));
    localStorage.setItem('prod_no', 'ABC');

    component['formService'] = formioServiceSpy;
    component.FindStep({} as any);

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['step', 'form1'],
      jasmine.anything()
    );
  });

  it('FindStep should alert when no forms found', () => {
    spyOn(window, 'alert');
    formioServiceSpy.loadForms.and.returnValue(of([]) as any);
    localStorage.setItem('prod_no', 'UNKNOWN');

    component['formService'] = formioServiceSpy;
    component.FindStep({} as any);

    expect(window.alert).toHaveBeenCalledWith('No Product found!');
  });

  it('FindStep should alert on error', () => {
    spyOn(window, 'alert');
    formioServiceSpy.loadForms.and.returnValue(
      throwError(() => new Error('boom'))
    );
    localStorage.setItem('prod_no', 'XYZ');

    component['formService'] = formioServiceSpy;
    component.FindStep({} as any);

    expect(window.alert).toHaveBeenCalledWith(
      'Error loading forms: Error: boom'
    );
  });
});
