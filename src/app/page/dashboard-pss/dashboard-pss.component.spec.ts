import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPssComponent } from './dashboard-pss.component';

describe('DashboardPssComponent', () => {
  let component: DashboardPssComponent;
  let fixture: ComponentFixture<DashboardPssComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPssComponent]
    });
    fixture = TestBed.createComponent(DashboardPssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
