import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeoExcelComponent } from './meo-excel.component';

describe('MeoExcelComponent', () => {
  let component: MeoExcelComponent;
  let fixture: ComponentFixture<MeoExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeoExcelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeoExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
