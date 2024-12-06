import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeoStepComponent } from './meo-step.component';

describe('MeoStepComponent', () => {
  let component: MeoStepComponent;
  let fixture: ComponentFixture<MeoStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeoStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeoStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
