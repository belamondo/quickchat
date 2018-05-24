import { TestBed, async, inject } from '@angular/core/testing';

import { CrmGuard } from './crm.guard';

describe('CrmGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrmGuard]
    });
  });

  it('should ...', inject([CrmGuard], (guard: CrmGuard) => {
    expect(guard).toBeTruthy();
  }));
});
