import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormioAppConfig } from '@formio/angular';
import { MeoExcelComponent } from './meo-excel.component';

// --- Mock providers ---
class MockFormioAppConfig {
  appUrl = 'http://localhost:3001';
  apiUrl = 'http://localhost:3001';
}

describe('MeoExcelComponent', () => {
  let component: MeoExcelComponent;
  let fixture: ComponentFixture<MeoExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeoExcelComponent],
      providers: [{ provide: FormioAppConfig, useClass: MockFormioAppConfig }],
    }).compileComponents();

    fixture = TestBed.createComponent(MeoExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
