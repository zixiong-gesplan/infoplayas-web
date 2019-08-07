import { TestBed } from '@angular/core/testing';

import { EsriRequestService } from './esri-request.service';

describe('EsriRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EsriRequestService = TestBed.get(EsriRequestService);
    expect(service).toBeTruthy();
  });
});
