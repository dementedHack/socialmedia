import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-recommended-videos',
  templateUrl: './sidebar-recommended-videos.component.html',
  styleUrls: ['./sidebar-recommended-videos.component.css']
})
export class SidebarRecommendedVideosComponent implements OnInit {
  recommendedSidebarVideos = [
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png",
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png",
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png",
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png",
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png",
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png",
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png",
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png",
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png",
    "http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png"
  ]
  constructor() { }

  ngOnInit() {
  }

}
