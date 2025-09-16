import { TestBed } from '@angular/core/testing';
import { FormioServiceFactoryService } from './formio-service-factory.service';
import { FormioAppConfig } from '@formio/angular';

describe('FormioServiceFactoryService', () => {
  let service: FormioServiceFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormioServiceFactoryService,
        { provide: FormioAppConfig, useValue: { appUrl: 'http://localhost', apiUrl: 'http://localhost/api' } }
      ]
    });
    service = TestBed.inject(FormioServiceFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
