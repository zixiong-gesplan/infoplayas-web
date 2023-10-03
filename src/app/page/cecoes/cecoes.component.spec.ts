import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CecoesComponent } from './cecoes.component';

describe('CecoesComponent', () => {
  let component: CecoesComponent;
  let fixture: ComponentFixture<CecoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CecoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CecoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
