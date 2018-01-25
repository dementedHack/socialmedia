import { Component, OnInit, AfterViewInit } from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import * as firebase from "firebase";
import {Video} from "../../shared/video.model";
import {Subscription} from "rxjs/Subscription";
import {Observer} from "rxjs/Observer";
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";

@Component({
  selector: 'app-black-movies',
  templateUrl: './black-movies.component.html',
  styleUrls: ['./black-movies.component.css']
})

export class BlackMoviesComponent implements OnInit, AfterViewInit {
  hotRightNowVideos = [];
  items: Observable<any[]>;
  // getVideos: Subscription;
  constructor(private databaseService: DatabaseService,
              private http: Http) {
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.databaseService.readValuesFromParentTable('BlackMovie', 6)
      .subscribe(
        (response) => {
          const data = response.json();
          const objectLength = Object.keys(data).length;
          for (var i = 0; i < objectLength; i++) {
            this.hotRightNowVideos.push(Object.values(data)[i]);
            this.hotRightNowVideos[i].key = (Object.keys(data)[i]);
            // console.log((Object.keys(data)[i]))
          }
          this.hotRightNowVideos = this.hotRightNowVideos.reverse();
        }
      );
  }
  getData () {
    return this.http.get('https://projectp-bf4f6.firebaseio.com/BlackMovie.json');
  }
}
