import { TestBed } from '@angular/core/testing';

import { GradesProtectionService } from './grades-protection.service';

describe('GradesProtectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GradesProtectionService = TestBed.get(GradesProtectionService);
    expect(service).toBeTruthy();
  });
});
