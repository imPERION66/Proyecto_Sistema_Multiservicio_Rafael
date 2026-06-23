import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoIndex } from './mantenimiento-index';

describe('MantenimientoIndex', () => {
  let component: MantenimientoIndex;
  let fixture: ComponentFixture<MantenimientoIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimientoIndex],
    }).compileComponents();

    fixture = TestBed.createComponent(MantenimientoIndex);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
