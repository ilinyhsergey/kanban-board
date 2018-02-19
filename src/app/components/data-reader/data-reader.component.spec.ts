import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataReaderComponent } from './data-reader.component';

describe('DataReaderComponent', () => {
  let component: DataReaderComponent;
  let fixture: ComponentFixture<DataReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataReaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
