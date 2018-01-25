import { Component, OnInit, Pipe, PipeTransform, ViewChildren } from '@angular/core';
import { DatabaseService} from "../services/database.service";
import {ActivatedRoute} from "@angular/router";
import {CleanUrlService} from '../services/clean-url.service';
import {Video} from "../shared/video.model";
import {Renderer2} from "@angular/core";


@Component({
  selector: 'app-view-video',
  templateUrl: './view-video.component.html',
  styleUrls: ['./view-video.component.css']
})
export class ViewVideoComponent implements OnInit {
  @ViewChildren('videoInfoContainer') videoInfoContainer;
  id;
  existsInDB = false;
  currentVideo = new Video('', '', null, {}, {}, {}, '', '', '', '', '', 0, 0, 0) ;
  video_location =  ('https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif');
  currentViewCount;
  constructor(private databaseService: DatabaseService,
              private route: ActivatedRoute,
              private cleanURL: CleanUrlService,
              private renderer: Renderer2
  ) { }
  ngOnInit() {
    // Assign the query parameters from the url to a variable
    this.id = this.route.snapshot.queryParams.videoId;
    // Next go to the movieList and select the current videoId to see the category
    // this.getVideoCategoryFromDatabase();
     console.log(this.id);
    // Retrieves values from the MovieList
    this.databaseService.readValuesFromChildTable('MovieList', this.id, 1)
      .subscribe(
        (response) => {
          const data = response;
          const mediaCategory = Object.values(response)[0].split('"')[1];
          console.log('Id ' + this.id);
          this.databaseService.readValuesFromChildTable('MovieProperty', this.id, 1)
            .subscribe(
              (videoResponse) => {
                const videoData = videoResponse.json();
                this.currentVideo = videoData;
                console.log(videoData);
                // console.log(videoData);
                this.databaseService.addViewValue('MovieProperty', this.id, videoData.views)
                  .subscribe (
                    (addViewResponse) => {
                      console.log(addViewResponse);
                    }
                  );
              }
            );
        }
      );
  }
  onVideoLikeDislikeClicked(liked) {
    // this.databaseService.postLikedDisliked(liked, 'MovieProperty', this.id);
  }
  changeCount(newCount, liked) {
    const socialDiv = this.videoInfoContainer;
    var querySel = '';
    if (liked) {
      querySel = '#likesCount';
    } else {
      querySel = '#dislikesCount';
    }
    const element = Object.values(socialDiv)[1][0].nativeElement.querySelector(querySel)
    console.log(newCount)
    element.innerHTML = newCount
    // console.log(Object.values(socialDiv)[1][0].nativeElement.querySelector('#dislikesCount'));
  }
  toggleSocialIcons(liked, postId) {
    const socialDiv = this.videoInfoContainer;
    var classToChange;
    var classToChangeTo;
    var element;
    if (liked) {
      if (Object.values(socialDiv)[1][0].nativeElement.querySelector('.fa-thumbs-up')) {
        element = Object.values(socialDiv)[1][0].nativeElement.querySelector('.fa-thumbs-up');
        classToChange = 'fa-thumbs-up';
        classToChangeTo = 'fa-thumbs-o-up';
        this.existsInDB = true;
      } else {
        element = Object.values(socialDiv)[1][0].nativeElement.querySelector('.fa-thumbs-o-up');
        classToChange = 'fa-thumbs-o-up';
        classToChangeTo = 'fa-thumbs-up';
      }
    } else {
      if (Object.values(socialDiv)[1][0].nativeElement.querySelector('.fa-thumbs-down')) {
        element = Object.values(socialDiv)[1][0].nativeElement.querySelector('.fa-thumbs-down');
        classToChange = 'fa-thumbs-down';
        classToChangeTo = 'fa-thumbs-o-down';
        this.existsInDB = true;
      } else {
        element = Object.values(socialDiv)[1][0].nativeElement.querySelector('.fa-thumbs-o-down');
        classToChange = 'fa-thumbs-o-down';
        classToChangeTo = 'fa-thumbs-down';
      }
    }
    this.renderer.removeClass(element, classToChange);
    this.renderer.addClass(element, classToChangeTo);
  }
}
