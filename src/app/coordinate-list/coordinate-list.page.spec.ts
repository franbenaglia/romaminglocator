import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoordinateListPage } from './coordinate-list.page';

describe('CoordinateListPage', () => {
  let component: CoordinateListPage;
  let fixture: ComponentFixture<CoordinateListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinateListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
