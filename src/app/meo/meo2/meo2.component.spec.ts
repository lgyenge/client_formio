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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Meo2Component } from './meo2.component';
import { Router, ActivatedRoute, provideRouter } from '@angular/router';
import { FormioService, FormioAppConfig } from '@formio/angular';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';


/** Router outlet stub, hogy a template ne dobjon NG0304 hibát */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStub {}

/** Mock FormioService */
class MockFormioService {
  loadForms(query: any) {
    return of([
      { _id: '123', name: 'TestFormA' },
      { _id: '456', name: 'TestFormB' }
    ]);
  }
}

/** Mock FormioService hiba teszthez */
class MockFormioServiceError {
  loadForms(query: any) {
    return throwError(() => new Error('mock error'));
  }
}

describe('Meo2Component', () => {
  let component: Meo2Component;
  let fixture: ComponentFixture<Meo2Component>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Meo2Component, RouterOutletStub],
      imports: [ReactiveFormsModule],
      providers: [
        provideRouter([]), // modern router
        { provide: ActivatedRoute, useValue: { snapshot: {}, root: {} } },
        { provide: FormioAppConfig, useValue: { appUrl: 'http://mock-api' } },
        { provide: FormioService, useClass: MockFormioService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Meo2Component);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should navigate to first form when forms are returned', (done) => {
    // Spy a router.navigate-re
    spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    
    component.FindStep({ _id: 'dummy' } as any);

    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(
        ['step', '123'], // a MockFormioService első form _id-ja
        { relativeTo: activatedRoute }
      );
      done();
    }, 0);
  });

  it('should alert when no forms are returned', () => {
    const alertSpy = spyOn(window, 'alert');
    // Mock FormioService, ami üres tömböt ad
    component['formService'] = {
      loadForms: () => of([])
    } as any;

    component.FindStep({ _id: 'dummy' } as any);
    expect(alertSpy).toHaveBeenCalledWith('No Product found!');
  });

  it('should alert on error', () => {
    const alertSpy = spyOn(window, 'alert');
    // Mock FormioService, ami hibát ad
    component['formService'] = new MockFormioServiceError() as any;

    component.FindStep({ _id: 'dummy' } as any);
    expect(alertSpy).toHaveBeenCalledWith('Error loading forms: Error: mock error');
  });
});

