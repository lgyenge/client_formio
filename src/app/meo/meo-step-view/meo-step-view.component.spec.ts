import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeoStepViewComponent } from './meo-step-view.component';

describe('MeoStepViewComponent', () => {
  let component: MeoStepViewComponent;
  let fixture: ComponentFixture<MeoStepViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeoStepViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeoStepViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
