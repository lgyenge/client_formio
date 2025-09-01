/** eredeti */
/*
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module'; // Adjust the path as necessary


import { Meo2Component } from './meo2.component';

describe('Meo2Component', () => {
  let component: Meo2Component;
  let fixture: ComponentFixture<Meo2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Meo2Component],
      imports: [AppModule],

    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Meo2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/

/** gpt5 generated test code, fixed */
/** meo2.component.spec.ts - modern Angular 16+ */


import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Meo2Component } from './meo2.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormioAppConfig, FormioService } from '@formio/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('Meo2Component', () => {
  let component: Meo2Component;
  let fixture: ComponentFixture<Meo2Component>;

  // Spies
  let routerSpy: jasmine.SpyObj<Router>;
  let formioServiceSpy: jasmine.SpyObj<FormioService>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    formioServiceSpy = jasmine.createSpyObj('FormioService', [
      'loadForms',
      'loadSubmissions'
    ]);

    activatedRouteStub = {
      snapshot: {} as any,
      params: of({})
    };

    await TestBed.configureTestingModule({
      declarations: [Meo2Component],
      imports: [ReactiveFormsModule,  RouterTestingModule ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: FormioAppConfig, useValue: { appUrl: 'http://test.url' } },
        { provide: FormioService, useValue: formioServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Meo2Component);
    component = fixture.componentInstance;

    // Default spies with proper casting
    formioServiceSpy.loadForms.and.returnValue(of([] as any));
    formioServiceSpy.loadSubmissions.and.returnValue(of([] as any));

    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // -------------------------
  // ClickedRow
  // -------------------------
  describe('ClickedRow', () => {
    it('should not set localStorage if row data is missing', () => {
      component.userDisplayResults = [{} as any];
      component.ClickedRow(0, {} as any);

      expect(localStorage.getItem('prod_no')).toBeNull();
      expect(localStorage.getItem('lot_no')).toBeNull();
    });

    it('should set localStorage and call FindStep if data exists', () => {
      spyOn(component, 'FindStep');
      component.userDisplayResults = [
        { data: { productNo: 'P1', lot: 'L1', initialQuantity: '10' } } as any
      ];

      component.ClickedRow(0, { name: 'form1' } as any);

      expect(localStorage.getItem('prod_no')).toBe('P1');
      expect(localStorage.getItem('lot_no')).toBe('L1');
      expect(localStorage.getItem('initial_quantity')).toBe('10');
      expect(component.FindStep).toHaveBeenCalled();
    });
  });

  // -------------------------
  // FindStep
  // -------------------------
  describe('FindStep', () => {
    beforeEach(() => {
      localStorage.setItem('prod_no', 'P1');
    });

    it('should navigate to first result when forms returned', () => {
      const forms = [{ _id: '123', name: 'A' }] as any;
      formioServiceSpy.loadForms.and.returnValue(of(forms));

      component.FindStep({} as any);

      expect(routerSpy.navigate).toHaveBeenCalledWith(['step', '123'], {
        relativeTo: TestBed.inject(ActivatedRoute)
      });
      expect(localStorage.getItem('forms')).toContain('123');
    });

    it('should alert when no forms returned', () => {
      spyOn(window, 'alert');
      formioServiceSpy.loadForms.and.returnValue(of([] as any));

      component.FindStep({} as any);

      expect(window.alert).toHaveBeenCalledWith('No Product found!');
    });

    it('should alert on error', () => {
      spyOn(window, 'alert');
      formioServiceSpy.loadForms.and.returnValue(throwError(() => 'err'));

      component.FindStep({} as any);

      expect(window.alert).toHaveBeenCalledWith('Error loading forms: err');
    });

    it('should do nothing if prod_no is missing', () => {
      localStorage.removeItem('prod_no');
      spyOn(formioServiceSpy, 'loadForms');

      component.FindStep({} as any);

      expect(formioServiceSpy.loadForms).not.toHaveBeenCalled();
    });
  });

  // -------------------------
  // ngOnInit
  // -------------------------
  describe('ngOnInit', () => {
    it('should set lotUrl when lot form exists', () => {
      formioServiceSpy.loadForms.and.returnValue(of([{ _id: 'lot1' }] as any));

      component.ngOnInit();

      expect(component.lotUrl).toBe(
        'http://test.url/form/lot1/submission'
      );
    });

    it('should keep lotUrl unchanged when no lot forms', () => {
      formioServiceSpy.loadForms.and.returnValue(of([] as any));

      const beforeUrl = component.lotUrl;
      component.ngOnInit();

      expect(component.lotUrl).toBe(beforeUrl);
    });

    it('should update userDisplayResults when lot search returns results', fakeAsync(() => {
      const searchResults = [{ data: { lot: 'L2' } }] as any;
      formioServiceSpy.loadSubmissions.and.returnValue(of(searchResults));

      component.ngOnInit();
      component.searchForm.get('lot')!.setValue('L2');
      tick(500); // simulate debounce

      expect(component.userDisplayResults).toEqual(searchResults);
    }));

    it('should remove forms from localStorage', () => {
      localStorage.setItem('forms', 'something');
      component.ngOnInit();

      expect(localStorage.getItem('forms')).toBeNull();
    });
  });

  // -------------------------
  // ngOnDestroy
  // -------------------------
  describe('ngOnDestroy', () => {
    it('should complete destroy$', () => {
      const completeSpy = spyOn(component['destroy$'], 'complete').and.callThrough();
      component.ngOnDestroy();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});





