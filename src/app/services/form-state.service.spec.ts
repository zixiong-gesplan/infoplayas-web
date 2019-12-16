import { TestBed } from '@angular/core/testing';

import { FormStateService } from './form-state.service';

describe('FormStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormStateService = TestBed.get(FormStateService);
    expect(service).toBeTruthy();
  });
});
