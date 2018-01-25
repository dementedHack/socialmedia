import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bottom-recommended-videos',
  templateUrl: './bottom-recommended-videos.component.html',
  styleUrls: ['./bottom-recommended-videos.component.css']
})
export class BottomRecommendedVideosComponent implements OnInit {
  bottomRecommendedVideos = [
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png",
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png",
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png",
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png",
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png",
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png"
  ]
  videos = [1, 2, 3, 4, 5, 6]
  constructor() { }

  ngOnInit() {
  }

}
