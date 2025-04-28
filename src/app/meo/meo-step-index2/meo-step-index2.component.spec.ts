import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeoStepIndex2Component } from './meo-step-index2.component';

describe('MeoStepIndex2Component', () => {
  let component: MeoStepIndex2Component;
  let fixture: ComponentFixture<MeoStepIndex2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeoStepIndex2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeoStepIndex2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
