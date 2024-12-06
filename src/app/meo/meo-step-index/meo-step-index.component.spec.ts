import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeoStepIndexComponent } from './meo-step-index.component';

describe('MeoStepIndexComponent', () => {
  let component: MeoStepIndexComponent;
  let fixture: ComponentFixture<MeoStepIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeoStepIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeoStepIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
