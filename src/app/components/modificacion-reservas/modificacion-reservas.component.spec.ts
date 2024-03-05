import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificacionReservasComponent } from './modificacion-reservas.component';

describe('ModificacionReservasComponent', () => {
  let component: ModificacionReservasComponent;
  let fixture: ComponentFixture<ModificacionReservasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificacionReservasComponent]
    });
    fixture = TestBed.createComponent(ModificacionReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
