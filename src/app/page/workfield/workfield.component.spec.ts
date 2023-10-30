import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkfieldComponent } from './workfield.component';

describe('WorkfieldComponent', () => {
  let component: WorkfieldComponent;
  let fixture: ComponentFixture<WorkfieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkfieldComponent]
    });
    fixture = TestBed.createComponent(WorkfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
