import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewerDrowningsComponent } from './map-viewer-drownings.component';

describe('MapViewerDrowningsComponent', () => {
  let component: MapViewerDrowningsComponent;
  let fixture: ComponentFixture<MapViewerDrowningsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapViewerDrowningsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewerDrowningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
