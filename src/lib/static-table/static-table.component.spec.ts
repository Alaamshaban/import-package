import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticTableComponent } from './static-table.component';

describe('StaticTableComponent', () => {
  let component: StaticTableComponent;
  let fixture: ComponentFixture<StaticTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaticTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('test getRowData method', () => {
    it('test string length > 15', () => {
      expect(component.getRowData('test1test2test3lk')).toBe(
        'test1test2test3 ...'
      );
    });
    it('test string length < 15', () => {
      expect(component.getRowData('test')).toBe('test');
    });
  });
  describe('test checkLength method', () => {
    it('test string length > 15', () => {
      expect(component.checkLength('test1test2test3lk')).toBeTruthy();
    });
    it('test string length < 15', () => {
      expect(component.checkLength('test')).toBeFalsy();
    });
  });
});
