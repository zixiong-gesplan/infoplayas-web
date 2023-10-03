import { TestBed } from '@angular/core/testing';

import { ReportProvider } from './report';

describe('ReportService', () => {
  let service: ReportProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
