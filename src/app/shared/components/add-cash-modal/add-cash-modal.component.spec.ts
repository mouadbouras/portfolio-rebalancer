import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCashModalComponent } from './add-cash-modal.component';

describe('AddCashModalComponent', () => {
  let component: AddCashModalComponent;
  let fixture: ComponentFixture<AddCashModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCashModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCashModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
