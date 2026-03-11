import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncompingcallComponent } from './incompingcall.component';

describe('IncompingcallComponent', () => {
  let component: IncompingcallComponent;
  let fixture: ComponentFixture<IncompingcallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncompingcallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncompingcallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
