import { TestBed } from '@angular/core/testing';

import { FormioServiceFactoryService } from './formio-service-factory.service';

describe('FormioServiceFactoryService', () => {
  let service: FormioServiceFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormioServiceFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
