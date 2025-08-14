import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleCallComponent } from './multiple-call.component';

describe('MultipleCallComponent', () => {
  let component: MultipleCallComponent;
  let fixture: ComponentFixture<MultipleCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleCallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
