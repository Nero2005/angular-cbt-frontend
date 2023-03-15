import { TestBed } from '@angular/core/testing';

import { UseRequestService } from './use-request.service';

describe('UseRequestService', () => {
  let service: UseRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UseRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
