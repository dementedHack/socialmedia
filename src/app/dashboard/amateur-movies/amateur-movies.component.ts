import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {Video} from "../../shared/video.model";
import {Subscription} from "rxjs/Subscription";

import 'rxjs/add/operator/take';

@Component({
  selector: 'app-amateur-movies',
  templateUrl: './amateur-movies.component.html',
  styleUrls: ['./amateur-movies.component.css']
})
export class AmateurMoviesComponent implements OnInit {
  mostViewedVideos = [];
  getRecommendedVideos: Subscription;
  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.databaseService.readValuesFromParentTable( 'AmateurMovie', 4);

    // this.getRecommendedVideos = this.databaseService.valuesReadFromAmateurTable.subscribe((video: Video) => {
    //   this.addDBValuesToVideoArray(video);
    // });
  }
  onThumbnailClick() {
    console.log('Thumbnail clicked');
  }
}
