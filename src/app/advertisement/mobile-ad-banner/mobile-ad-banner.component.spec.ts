import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAdBannerComponent } from './mobile-ad-banner.component';

describe('MobileAdBannerComponent', () => {
  let component: MobileAdBannerComponent;
  let fixture: ComponentFixture<MobileAdBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileAdBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAdBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
