import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeoLotComponent } from './meo-lot.component';

describe('MeoLotComponent', () => {
  let component: MeoLotComponent;
  let fixture: ComponentFixture<MeoLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeoLotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeoLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
