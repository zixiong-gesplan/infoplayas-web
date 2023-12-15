import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CecoesFallecidosAcumulativosComponent } from './cecoes-fallecidos-acumulativos.component';

describe('CecoesFallecidosAcumulativosComponent', () => {
  let component: CecoesFallecidosAcumulativosComponent;
  let fixture: ComponentFixture<CecoesFallecidosAcumulativosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CecoesFallecidosAcumulativosComponent]
    });
    fixture = TestBed.createComponent(CecoesFallecidosAcumulativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
