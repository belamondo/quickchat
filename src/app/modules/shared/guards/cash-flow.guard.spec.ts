import { TestBed, async, inject } from '@angular/core/testing';

import { CashFlowGuard } from './cash-flow.guard';

describe('CashFlowGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CashFlowGuard]
    });
  });

  it('should ...', inject([CashFlowGuard], (guard: CashFlowGuard) => {
    expect(guard).toBeTruthy();
  }));
});
