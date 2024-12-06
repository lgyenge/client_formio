import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeoViewComponent } from './meo-view.component';

describe('MeoViewComponent', () => {
  let component: MeoViewComponent;
  let fixture: ComponentFixture<MeoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeoViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
