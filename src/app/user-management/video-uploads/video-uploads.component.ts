import { Component, OnInit } from '@angular/core';
import {Video} from "../../shared/video.model";
import {DatabaseService} from "../../services/database.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-video-uploads',
  templateUrl: './video-uploads.component.html',
  styleUrls: ['./video-uploads.component.css']
})
export class VideoUploadsComponent implements OnInit {
  videos = [];
  id = localStorage.getItem('userUID');
  constructor(
    private databaseService: DatabaseService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log(this.id)
    this.databaseService.readValuesFromChildTable('User', this.id, null)
      .subscribe(
        (data) => {
          // Grab the ids from the database and pushes them into an array.
          // We then iterate through that array to look up the video properties
          console.log('Data ' + Object.values(data.json()));

          console.log('Data ' + Object.values(data.json()['movie']));
          // The movie keys
          const movieKeyArr = Object.keys(data.json()['movie']);
          const movies = Object.keys(data.json()['movie']);
          console.log(movies);
          // const moviesAsArray = Object.keys(movies);
          for (var i = 0; i < movieKeyArr.length; i++) {
            const movieObject = movieKeyArr[i];
            // this.videos.push(movieObject);
            this.databaseService.readValuesFromChildTable('MovieProperty', movieObject, 1)
              .subscribe(
                (moviesData) => {
                  var newItem = moviesData.json();
                  newItem.key = movieObject;
                  this.videos.unshift(newItem);
                }
              );
          }
        }
      );
  }

}
