import { TestBed } from '@angular/core/testing';

import { LotExportService } from './lot-export.service';

describe('LotExportService', () => {
  let service: LotExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LotExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
