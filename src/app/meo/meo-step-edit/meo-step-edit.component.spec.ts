import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeoStepEditComponent } from './meo-step-edit.component';
import { FormManagerService, FormManagerConfig } from '@formio/angular/manager';
import { FormioModule } from '@formio/angular';
import { AppModule } from '../../app.module'; // Adjust the path as necessary

describe('MeoStepEditComponent', () => {
  let component: MeoStepEditComponent;
  let fixture: ComponentFixture<MeoStepEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeoStepEditComponent],
      imports: [
        AppModule,
        FormioModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeoStepEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    //const formManagerService = TestBed.inject(FormManagerService);

    const formManagerService =
      fixture.debugElement.injector.get(FormManagerService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /** gyl added */
  it('should use the quoteList from the service', () => {

    fixture.detectChanges();
    //expect(formManagerService.submissionLoaded()).toEqual(component.quoteList);
  });
  /** gyl added end */
});
