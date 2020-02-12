import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrowningsComponent } from './drownings.component';

describe('DrowningsComponent', () => {
  let component: DrowningsComponent;
  let fixture: ComponentFixture<DrowningsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrowningsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrowningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
