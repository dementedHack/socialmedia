import {Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Renderer2} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AuthService} from "../../services/auth.service";
import {DatabaseService} from "../../services/database.service";
import { ActivatedRoute} from "@angular/router";
import { GenerateTimestampService} from "../../services/generate-timestamp.service";
import { Post } from '../../shared/post.model';
import { setTimeout } from 'timers';
import * as firebase from 'firebase';

@Component({
  selector: 'app-video-comments',
  templateUrl: './video-comments.component.html',
  styleUrls: ['./video-comments.component.css']
})
export class VideoCommentsComponent implements OnInit, AfterViewInit {
  @ViewChildren('userCommentSocial') userCommentSocial: ElementRef;
  isLoggedIn = true;
  userId = '';
  userPost = new Post('', '', '', 0, 0);
  videoId = '';
  posts = [];
  // These are the ids for each of the posts in the comments sections
  postOwnerIds = [];
  userIDSubject = new Subject();
  postIDSubject = new Subject();
  usernames = {};
  currentVideoId = '';
  trialPosts = [];
  commentsExist = new Subject();
  userPosts = new Subject();
  userIds = {};
  postIds = {};
  currentUserInfo;
  likedPosts;
  dislikedPosts;
  existsInDB = false;

  constructor(private authService: AuthService,
              private databaseService: DatabaseService,
              private route: ActivatedRoute,
              private timestampService: GenerateTimestampService,
              private activatedRoute: ActivatedRoute,
              private renderer: Renderer2,
              private elemRef: ElementRef) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    // Looks at the URL and sets the videoId to the parameters
    this.activatedRoute.queryParams.subscribe((data) => {
      this.videoId = data.videoId;
      this.databaseService.readDataFromChild('Post', this.videoId, 6).then(
        (theData) => {
          this.convertPosts(theData);
          // Read the 'User' table and get the currently logged in user's
          // information
          this.databaseService.readDataFromChild('User', localStorage.getItem('userUID'),50).then(
            (userData) => {
              for(var i = 0; i < Object.keys(userData).length; i++) {
                if (Object.keys(userData[i])[0] === 'likedPost') {
                  this.likedPosts = Object.values(userData[i])[0];
                  this.comparePostIdsToCurrentUserLikedIds(this.postIds, this.likedPosts, true);
                } else if (Object.keys(userData[i])[0] === 'dislikedPost') {
                  this.dislikedPosts = Object.values(userData[i])[0];
                  this.comparePostIdsToCurrentUserLikedIds(this.postIds, Object.values(userData[i])[0], false);
                }
              }
            });
        });
    });

    // Triggers the function to retrieve the usernames
    this.userIDSubject.subscribe(
      (data) => {
        // this.postOwnerIds = data;
        this.databaseService.retrieveUserInfoFromId(data);
        this.userIds = data;
      }
    );
    // Get token
    this.authService.getToken();
    // this.databaseService.retrieveUserInfoFromId(this.userIds);
    // This responds to the observable of usernames
    this.databaseService.usernames
      .subscribe(
        (data) => {
          this.usernames = data;
        }
      );
    // retrieves the uid from the user
    this.postIDSubject
      .subscribe(
        (data) => {
          this.postIds = data;
        }
      );
    if (localStorage.getItem('userUID')) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }
  // Get the token
  onPostTyped(typedPost) {
    this.userPost.body = typedPost.value;
  }
  onPostSubmitted() {
    // Creates the parameters for the Thread table and then sends it to the DB via the DB service
    const currentTime = this.timestampService.createTimestampForNow();
        // console.log(this.videoId);
        const thread = {
          title: this.videoId + '-Movie-Thread',
          owner: this.videoId,
          lastPost: currentTime,
          numberOfViews: 0
        };
        this.userPost.timestamp = currentTime;
        this.userPost.owner = localStorage.getItem('userUID');
        this.databaseService.onPostSubmitted('Thread', this.videoId, thread, false, false, '', {});
        this.databaseService.onPostSubmitted('Post', this.videoId, this.userPost, true, false, '', {});
        this.databaseService.onPostSubmitted('User', this.userPost.owner, this.userPost,
                                          false, true, 'thread', { [this.videoId]: true });

    this.databaseService.readDataFromChild('Post', this.videoId, 6);
  }
  convertPosts(theData) {
    this.trialPosts = [];
    var userIds = [];
    var postIds = [];
    for(var i = 0; i < theData.length; i++) {
      // console.log(Object.values(theData)[i]);
      const tempObject = Object.values(theData)[i];
      // console.log(Object.values(tempObject)[0].owner);
      this.trialPosts.push(Object.values(tempObject)[0]);
      userIds.push(Object.values(tempObject)[0].owner);
      postIds.push(Object.keys(tempObject)[0]);
    }
    this.userIDSubject.next(userIds);
    this.postIDSubject.next(postIds);
  }
  onCommentLikeDislikeClicked(liked, postId) {
    this.toggleSocialIcons(liked, postId);
    this.databaseService.postLikedDisliked(liked, 'Post', this.videoId, postId, 'Post', this.existsInDB).then(
      (data) => {
        if (data) {
          this.existsInDB = !this.existsInDB;
          this.changeCount(data, liked);
        }
      }
    );
  }
  changeCount(newCount, liked) {
    const socialDiv = this.userCommentSocial;
    var querySel = '';
    if (liked) {
      querySel = '#likesCount';
    } else {
      querySel = '#dislikesCount';
    }
    const element = Object.values(socialDiv)[1][0].nativeElement.querySelector(querySel)
    console.log(newCount)
    console.log(element)
    element.innerHTML = newCount
    // console.log(Object.values(socialDiv)[1][0].nativeElement.querySelector('#dislikesCount'));
  }
  comparePostIdsToCurrentUserLikedIds(postIds, userLikesDislikes, liked) {
    if (liked) {
      this.likedPosts = userLikesDislikes;
    } else {
      this.likedPosts = userLikesDislikes;
    }
    console.log('Starting compare function of ' + userLikesDislikes);
    for (var i = 0; i < Object.keys(userLikesDislikes).length; i++) {
      for (var j = 0; j < Object.keys(this.postIds).length; j++) {
        console.log(Object.values(this.postIds)[j]);
        if (Object.keys(userLikesDislikes)[i] === Object.values(this.postIds)[j]) {
          console.log('Equal' + Object.keys(userLikesDislikes)[i] + Object.values(this.postIds)[j]);
          this.changeSocialIcons(j, liked);
        }
      }
    }
  }
  // Iteration gets the row that the comment is in. Liked indicates whether
  // the post was liked or disliked
  changeSocialIcons(iteration, liked) {
    const socialDiv = this.userCommentSocial;
    var classToChange = 'fa-thumbs-o-'
    var classToChangeTo = 'fa-thumbs-'
    if (liked) {
      classToChange = 'fa-thumbs-o-up';
      classToChangeTo = 'fa-thumbs-up';
    } else {
      classToChange = 'fa-thumbs-o-down';
      classToChangeTo = 'fa-thumbs-down';
    }
    const querySelectorForIcon = '.' + classToChange;
    const element = (Object.values(socialDiv)[1][iteration].nativeElement.querySelector(querySelectorForIcon));
    // const element = this.userCommentSocial.last.nativeElement.querySelector('.fa-thumbs-o-down');
    this.renderer.removeClass(element, classToChange);
    this.renderer.addClass(element, classToChangeTo);
  }
  // Iteration gets the row that the comment is in. Liked indicates whether
  // the post was liked or disliked
  toggleSocialIcons(liked, postId) {
    const socialDiv = this.userCommentSocial;
    var element;
    var classToChange;
    var classToChangeTo;
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
