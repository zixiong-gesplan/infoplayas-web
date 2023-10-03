import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddIncidentComponent } from './modal-add-incident.component';

describe('ModalAddIncidentComponent', () => {
  let component: ModalAddIncidentComponent;
  let fixture: ComponentFixture<ModalAddIncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddIncidentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
