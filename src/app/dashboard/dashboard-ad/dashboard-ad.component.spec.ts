import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdComponent } from './dashboard-ad.component';

describe('DashboardAdComponent', () => {
  let component: DashboardAdComponent;
  let fixture: ComponentFixture<DashboardAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
