import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableReceivableComponent } from './payable-receivable.component';

describe('PayableReceivableComponent', () => {
  let component: PayableReceivableComponent;
  let fixture: ComponentFixture<PayableReceivableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayableReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayableReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
