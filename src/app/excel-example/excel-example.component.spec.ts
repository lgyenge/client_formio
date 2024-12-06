import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelExampleComponent } from './excel-example.component';

describe('ExcelExampleComponent', () => {
  let component: ExcelExampleComponent;
  let fixture: ComponentFixture<ExcelExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExcelExampleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExcelExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
