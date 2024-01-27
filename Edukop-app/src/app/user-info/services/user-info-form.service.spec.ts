import { TestBed } from '@angular/core/testing';

import { UserInfoFormService } from './user-info-form.service';

describe('UserInfoFormService', () => {
  let service: UserInfoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInfoFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
