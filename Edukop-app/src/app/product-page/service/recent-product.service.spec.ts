import { TestBed } from '@angular/core/testing';

import { RecentProductService } from './recent-product.service';

describe('RecentProductService', () => {
  let service: RecentProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
