import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitCommentsComponent } from './unit-comments.component';

describe('UnitCommentsComponent', () => {
  let component: UnitCommentsComponent;
  let fixture: ComponentFixture<UnitCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
