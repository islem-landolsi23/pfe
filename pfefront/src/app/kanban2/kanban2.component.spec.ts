import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kanban2Component } from './kanban2.component';

describe('Kanban2Component', () => {
  let component: Kanban2Component;
  let fixture: ComponentFixture<Kanban2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kanban2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Kanban2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
