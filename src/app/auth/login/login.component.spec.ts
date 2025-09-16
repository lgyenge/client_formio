import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormioModule, FormioAppConfig } from '@formio/angular';
import { FormioAuthService } from '@formio/angular/auth';

// --- Mock providers ---
class MockFormioAppConfig {
  appUrl = 'http://localhost:3001';
  apiUrl = 'http://localhost:3001';
}

class MockFormioAuthService {
  // you can stub methods if you need them later, e.g.:
  onLogin = jasmine.createSpy('onLogin');
  logout = jasmine.createSpy('logout');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormioModule],
      declarations: [LoginComponent],
      providers: [
        { provide: FormioAppConfig, useClass: MockFormioAppConfig },
        { provide: FormioAuthService, useClass: MockFormioAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
