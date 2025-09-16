import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { FormioAuthService } from '@formio/angular/auth';
import { FormioResources } from '@formio/angular/resource';
import { HeaderComponent } from './header/header.component';

// ✅ Simple mocks to replace real Formio services
class MockFormioAuthService {
  onLogin = of({});
  onLogout = of({});
  onRegister = of({});
}

class MockFormioResources {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, HeaderComponent],
      providers: [
        { provide: FormioAuthService, useClass: MockFormioAuthService },
        { provide: FormioResources, useClass: MockFormioResources },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });


  it('should set the title property', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toBe('Dinet Data Logger');
  });

 
});
