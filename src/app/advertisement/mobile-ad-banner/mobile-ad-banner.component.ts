import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobile-ad-banner',
  templateUrl: './mobile-ad-banner.component.html',
  styleUrls: ['./mobile-ad-banner.component.css']
})
export class MobileAdBannerComponent implements OnInit {
  adLocations = ["http://www.clicxa.com/assets/themes/default/image/banner-ads.jpg"];
  constructor() { }

  ngOnInit() {
  }

}
