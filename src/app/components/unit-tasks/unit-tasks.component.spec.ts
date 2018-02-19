import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTasksComponent } from './unit-tasks.component';

describe('UnitTasksComponent', () => {
  let component: UnitTasksComponent;
  let fixture: ComponentFixture<UnitTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
