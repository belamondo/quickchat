import { CashFlowModule } from './cash-flow.module';

describe('CashFlowModule', () => {
  let cashFlowModule: CashFlowModule;

  beforeEach(() => {
    cashFlowModule = new CashFlowModule();
  });

  it('should create an instance', () => {
    expect(cashFlowModule).toBeTruthy();
  });
});
