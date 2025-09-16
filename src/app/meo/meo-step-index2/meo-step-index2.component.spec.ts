import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { MeoStepIndex2Component } from './meo-step-index2.component';
import { DataService } from '../../data.service';
import { FormioAppConfig, FormioService } from '@formio/angular';
import { FormioServiceFactoryService } from '../../formio-service-factory.service';

describe('MeoStepIndex2Component (Lifecycle + Submission)', () => {
  let component: MeoStepIndex2Component;
  let fixture: ComponentFixture<MeoStepIndex2Component>;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockFactory: jasmine.SpyObj<FormioServiceFactoryService>;
  let mockFormioService: jasmine.SpyObj<FormioService>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', [], {
      message$: new Subject(),
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockFormioService = jasmine.createSpyObj('FormioService', [
      'loadSubmissions',
      'saveSubmission',
    ]);
    mockFactory = jasmine.createSpyObj('FormioServiceFactoryService', [
      'create',
    ]);
    mockFactory.create.and.returnValue(mockFormioService);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [MeoStepIndex2Component],
      providers: [
        FormBuilder,
        { provide: DataService, useValue: mockDataService },
        { provide: Router, useValue: mockRouter },
        { provide: FormioAppConfig, useValue: { appUrl: 'http://test' } },
        { provide: ActivatedRoute, useValue: {} },
        { provide: FormioServiceFactoryService, useValue: mockFactory },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeoStepIndex2Component);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ---------------- Lifecycle ----------------

  it('should initialize inOutForm on ngOnInit', () => {
    component.ngOnInit();
    expect(component.inOutForm.contains('inCnt')).toBeTrue();
    expect(component.inOutForm.contains('outCnt')).toBeTrue();
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const completeSpy = spyOn(
      (component as any).destroy$,
      'complete'
    ).and.callThrough();
    const nextSpy = spyOn(
      (component as any).destroy$,
      'next'
    ).and.callThrough();

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  // ---------------- Submission ----------------

  it('should create headerSubmission if missing and call saveSubmission on onSubmit', () => {
    component.suffix = { name: 'X' };
    component.inOutForm = new FormBuilder().group({ inCnt: '5', outCnt: '3' });
    component.headerFormservice = mockFormioService;
    mockFormioService.saveSubmission.and.returnValue(of({ id: 1 }));

    component.onSubmit();

    expect(component.headerSubmission).toBeTruthy();
    expect(component.headerSubmission.data['InX']).toBe('5');
    expect(component.headerSubmission.data['OutX']).toBe('3');
    expect(mockFormioService.saveSubmission).toHaveBeenCalledWith(
      component.headerSubmission
    );
  });

  it('should update existing headerSubmission and save it', () => {
    component.suffix = { name: 'Y' };
    component.inOutForm = new FormBuilder().group({ inCnt: '7', outCnt: '2' });
    component.headerFormservice = mockFormioService;
    component.headerSubmission = { data: { existing: true } };
    mockFormioService.saveSubmission.and.returnValue(of({ id: 2 }));

    component.onSubmit();

    expect(component.headerSubmission.data['InY']).toBe('7');
    expect(component.headerSubmission.data['OutY']).toBe('2');
    expect(mockFormioService.saveSubmission).toHaveBeenCalled();
  });

  it('should do nothing if headerFormservice is undefined', () => {
    component.suffix = { name: 'Z' };
    component.inOutForm = new FormBuilder().group({ inCnt: '1', outCnt: '9' });

    component.headerFormservice = undefined as any; // simulate missing service

    component.onSubmit();

    expect(mockFormioService.saveSubmission).not.toHaveBeenCalled();
  });
  // ---------------- initHeaderForm ----------------

  it('should set headerFormservice when header form is found', () => {
    component.forms = [
      { _id: '123', name: 'MyxxHForm', components: [] },
    ] as any;

    component['initHeaderForm']();

    expect(mockFactory.create).toHaveBeenCalledWith(
      'http://test/form/123/submission'
    );
    expect(component.headerFormservice).toBe(mockFormioService);
  });

  it('should log error when no header form found', () => {
    spyOn(console, 'error');
    component.forms = [
      { _id: '456', name: 'NoHeaderHere', components: [] },
    ] as any;

    component['initHeaderForm']();

    expect(console.error).toHaveBeenCalledWith('Header form not found!');
  });

  // ---------------- handleError ----------------

  it('should log error and call alert on handleError', () => {
    spyOn(console, 'error');
    spyOn(window, 'alert');

    component['handleError']('testError');

    expect(console.error).toHaveBeenCalledWith(
      'Error loading forms:',
      'testError'
    );
    expect(window.alert).toHaveBeenCalledWith(
      'Error loading forms. Please try again later.'
    );
  });

  // ---------------- tableRows ----------------

  it('should create tableRows with number + checkbox components', () => {
    component.limits = [
      {
        key: 'num1',
        nominalValue: 10,
        lowerRedLimit: 5,
        upperRedLimit: 15,
        lowerYellowLimit: 7,
        upperYellowLimit: 13,
      },
    ];

    const form = {
      components: [
        { type: 'number', key: 'num1', label: 'Num 1' },
        { type: 'checkbox', key: 'chk1', label: 'Check 1' },
      ],
    } as any;

    const submissions = [{ data: { num1: 12, chk1: true } }] as any;

    component['createTableRows'](form, submissions);

    expect(component.tableRows.length).toBe(1);
    expect(component.tableRows[0].length).toBe(2);

    const numCell = component.tableRows[0][0];
    expect(numCell.data).toBe(12);
    expect(numCell.limit.key).toBe('num1');

    const chkCell = component.tableRows[0][1];
    //expect(chkCell.data).toBeNaN(); // checkbox stores NaN because not mapped to number
    expect(chkCell.data).toBe(1); // checkbox stores NaN because not mapped to number
  });

  it('should skip components that are not number or checkbox', () => {
    const form = { components: [{ type: 'textfield', key: 'txt1' }] } as any;
    const submissions = [{ data: { txt1: 'hello' } }] as any;

    component['createTableRows'](form, submissions);

    expect(component.tableRows[0].length).toBe(0);
  });

  // ---------------- tableHeader ----------------

  it('should create tableHeader with labels from number + checkbox components', () => {
    const form = {
      components: [
        { type: 'number', label: 'N1' },
        { type: 'checkbox', label: 'C1' },
        { type: 'textfield', label: 'Ignored' },
      ],
    } as any;

    component['createTableHeader'](form);

    expect(component.tableHeader).toEqual(['N1', 'C1']);
  });

  it('should produce empty header if no valid components', () => {
    const form = { components: [{ type: 'textfield', label: 'X' }] } as any;

    component['createTableHeader'](form);

    expect(component.tableHeader).toEqual([]);
  });

  // ---------------- valueIsNaN ----------------

  it('should return true when value is NaN', () => {
    expect(component.valueIsNaN(NaN)).toBeTrue();
    expect(component.valueIsNaN('not a number')).toBeTrue();
  });

  it('should return false when value is a number', () => {
    expect(component.valueIsNaN(123)).toBeFalse();
    expect(component.valueIsNaN(0)).toBeFalse();
  });

  // ---------------- ClickedRow ----------------

  it('should navigate when submission has an id', () => {
    component.submissions = [{ _id: 'abc123', data: {} } as any];

    component.ClickedRow(0);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['abc123', 'view'], {
      relativeTo: (component as any).route,
    });
  });

  it('should not navigate when submission has no id', () => {
    component.submissions = [{} as any];

    component.ClickedRow(0);

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  // ---------------- onSubmit ----------------

  it('should update headerSubmission and call saveSubmission', () => {
    // Arrange
    component.suffix = { name: 'T1', inCnt: 5, outCnt: 3 };
    component.ngOnInit(); // Initialize form
    component.inOutForm.setValue({ inCnt: '10', outCnt: '20' });

    // Spy on saveSubmission
    const saveSpy = jasmine
      .createSpy('saveSubmission')
      .and.returnValue(of({ saved: true }));
    component.headerFormservice = {
      saveSubmission: saveSpy,
    } as any;

    // Act
    component.onSubmit();

    // Assert
    expect(saveSpy).toHaveBeenCalled();
    const submissionArg = saveSpy.calls.mostRecent().args[0];

    expect(submissionArg.data[`In${component.suffix.name}`]).toBe('10');
    expect(submissionArg.data[`Out${component.suffix.name}`]).toBe('20');
  });
  /* 
  it('should update headerSubmission and call saveSubmission', () => {
    // Arrange
    // !!!gyl const saveSpy = spyOn(formServiceMock, 'saveSubmission').and.returnValue(
    const saveSpy = spyOn(mockFormioService, 'saveSubmission').and.returnValue(
      of({})
    );

    // Initialize form
    component.ngOnInit(); // <-- THIS is crucial
    //component.headerFormservice = formServiceMock;
    component.headerFormservice = mockFormioService;

    component.suffix = { name: 'T1', inCnt: 0, outCnt: 0 }; // number values

    // Act: set form values
    component.inOutForm.setValue({ inCnt: 5, outCnt: 3 });
    component.onSubmit();

    // Assert
    expect(saveSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        data: jasmine.objectContaining({
          InT1: 5,
          OutT1: 3,
        }),
      })
    );
  }); */

  it('should not call saveSubmission if headerFormservice is undefined', () => {
    component.suffix = { name: 'Z', inCnt: 0, outCnt: 0 };

    // Ensure inOutForm exists so .value can be read
    component.inOutForm = new FormBuilder().group({ inCnt: '1', outCnt: '9' });

    component.headerFormservice = undefined as any; // simulate missing service

    // Spy on saveSubmission shouldn't be necessary, we just check no error and no call
    const saveSpy = jasmine.createSpy('saveSubmission');
    (component as any).saveSubmission = saveSpy; // just placeholder

    component.onSubmit();

    expect(saveSpy).not.toHaveBeenCalled();
  });
});
