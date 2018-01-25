import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DatabaseService} from "../services/database.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  videos = [];
  urlParameters;
  constructor(private activatedRoute: ActivatedRoute,
              private databaseService: DatabaseService ) { }

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(
        (data) => {
          this.urlParameters = data;
          const parent = this.urlParameters.Media + 'Property';
          this.databaseService.readDataFromParent(parent, 25);
        }
      );
    this.databaseService.parentValuesAsObjects
      .subscribe(
        (data) => {
          for (var i = 0; i < Object.keys(data).length; i++) {
            const video = {};
            const valuesObject = (Object.values(data[i]));
            video['key'] = Object.keys(Object.values(data)[i])[0];
            video['title'] = valuesObject[0].title;
            video['thumbnail'] = valuesObject[0].thumbnailPreview;
            video['likes'] = valuesObject[0].likes;
            video['dislikes'] = valuesObject[0].dislikes;
            console.log(video);
            this.videos.push(video);
          }
        }
      );
  }
}
