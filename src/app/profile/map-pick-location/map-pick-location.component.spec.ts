import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPickLocationComponent } from './map-pick-location.component';

describe('MapPickLocationComponent', () => {
  let component: MapPickLocationComponent;
  let fixture: ComponentFixture<MapPickLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPickLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPickLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
