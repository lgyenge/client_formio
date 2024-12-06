import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeoStepEditComponent } from './meo-step-edit.component';

describe('MeoStepEditComponent', () => {
  let component: MeoStepEditComponent;
  let fixture: ComponentFixture<MeoStepEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeoStepEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeoStepEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
