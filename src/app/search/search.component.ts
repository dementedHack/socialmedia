import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs/Subject";
import {ActivatedRoute} from "@angular/router";
import {DatabaseService} from "../services/database.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  videos = [];
  myData = [];
  urlParameters;
  constructor(private activatedRoute: ActivatedRoute,
              private databaseService: DatabaseService) {}

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(
        (data) => {
          const myVideoData = new Subject();
          this.urlParameters = data;
          const parent = this.urlParameters.Media + 'Property';
          const child = this.urlParameters.Category + 'Property';
          if (this.urlParameters.Category === 'My_Likes') {
            console.log(localStorage.getItem('userUID'))
            this.databaseService.readDataFromChild('User', localStorage.getItem('userUID'), 1).then(
              (data) => {
                // Go through the snapshot to find the liked Videos
                const valueToParse = this.parseDataAndReturnArray(data);
                for (var i = 0; i < valueToParse.length; i++) {
                  const currentMovieId = valueToParse[i];
                  const videoObject = {}
                  this.databaseService.readDataFromChild('MovieProperty', valueToParse[i], 1).then(
                    (data) => {
                      const objectData = Object.values(data);
                      for(var j = 0; j < Object.values(data).length; j++) {
                        videoObject['key'] = currentMovieId;
                        if (objectData[j].title) {
                          videoObject['title'] = objectData[j].title;
                        }
                        if (objectData[j].thumbnailPreview) {
                          videoObject['thumbnail'] = objectData[j].thumbnailPreview;
                        }
                        if (objectData[j].likes) {
                          videoObject['likes'] = objectData[j].likes;
                        }
                        if (objectData[j].dislikes) {
                          videoObject['dislikes'] = objectData[j].dislikes;
                        }
                        // this.videos.push();
                      }
                      console.log(videoObject);
                      this.videos.push(videoObject);
                    });
                }
              }
            );
          }
          else {
              this.databaseService.readDataFromParent(parent, 25).then(
                (data) => {
                  this.parseDataIntoVideoObjectsArray(data);
                });
          }
      });
    }
      parseDataIntoVideoObjectsArray(data) {
        for (var i = 0; i < Object.keys(data).length; i++) {
          const video = {};
          const valuesObject = (Object.values(data[i]));
          video['key'] = Object.keys(Object.values(data)[i])[0];
          video['title'] = valuesObject[0].title;
          video['thumbnail'] = valuesObject[0].thumbnailPreview;
          video['likes'] = valuesObject[0].likes;
          video['dislikes'] = valuesObject[0].dislikes;
          this.videos.push(video);
        }
      }
      parseDataAndReturnArray(data) {
        var returnValue = [];
        for (var i = 0; i < Object.keys(data).length; i++) {
          if (Object.values(data)[i].likedVideo) {
            const returnValueAsObject = Object.values(data)[i].likedVideo;
            returnValue = Object.keys(returnValueAsObject);
          }
        }
        return returnValue;
      }
}
