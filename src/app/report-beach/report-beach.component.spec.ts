import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBeachComponent } from './report-beach.component';

describe('ReportBeachComponent', () => {
  let component: ReportBeachComponent;
  let fixture: ComponentFixture<ReportBeachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportBeachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportBeachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
