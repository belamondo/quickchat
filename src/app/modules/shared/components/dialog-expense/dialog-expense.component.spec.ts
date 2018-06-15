import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExpenseComponent } from './dialog-expense.component';

describe('DialogExpenseComponent', () => {
  let component: DialogExpenseComponent;
  let fixture: ComponentFixture<DialogExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
