import { Component, OnInit, Input } from '@angular/core';
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-dashboard-movies-list-normal',
  templateUrl: './dashboard-movies-list-normal.component.html',
  styleUrls: ['./dashboard-movies-list-normal.component.css']
})
export class DashboardMoviesListNormalComponent implements OnInit {
  @Input() movieType: string;
  constructor(private databaseService: DatabaseService) { }
  videos = [];

  ngOnInit() {
    const queryMovieType = this.movieType + 'Movie';
    const queryMovieProperty = 'MovieProperty';
    this.databaseService.readValuesFromParentTable(queryMovieType, { orderBy: "timeUploaded", limitToLast: 4 })
      .subscribe(
        (response) => {
          const data = response;
          console.log(response);
          const objectLength =  Object.keys(response.json()).length;
          for (var i = 0; i < objectLength; i++) {
            const mediaKey = Object.keys(data.json())[i];
            // console.log('Media key is ' + mediaKey);
            // console.log('Response  is ' + response);
            this.databaseService.readValuesFromChildTable(queryMovieProperty,
                                                           mediaKey, null)
              .subscribe(
                (movieResponse) => {
                  console.log(movieResponse);
                  // // Get the current length of the videos array
                  const videosArrayLength = this.videos.length;
                  // // The body of the response is in the following iterating of the object value
                  const individualMediaObject = movieResponse.json();
                  // // console.log(movieResponse)
                  this.videos.push(individualMediaObject);
                  this.videos[videosArrayLength].key = mediaKey;
                }
              );
          }
        }
      );
  }
}
