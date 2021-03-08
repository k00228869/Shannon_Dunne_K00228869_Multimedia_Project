import { TestBed } from '@angular/core/testing';

import { BusinessGuard } from './business.guard';

describe('BusinessGuard', () => {
  let guard: BusinessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BusinessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
