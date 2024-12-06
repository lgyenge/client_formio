import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeoStepHeaderComponent } from './meo-step-header.component';

describe('MeoStepHeaderComponent', () => {
  let component: MeoStepHeaderComponent;
  let fixture: ComponentFixture<MeoStepHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeoStepHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeoStepHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
