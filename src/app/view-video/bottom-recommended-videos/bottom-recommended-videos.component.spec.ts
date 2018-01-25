import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomRecommendedVideosComponent } from './bottom-recommended-videos.component';

describe('BottomRecommendedVideosComponent', () => {
  let component: BottomRecommendedVideosComponent;
  let fixture: ComponentFixture<BottomRecommendedVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomRecommendedVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomRecommendedVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
