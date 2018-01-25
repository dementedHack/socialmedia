import {Directive, HostListener, Input, HostBinding, Renderer2, ElementRef, OnInit, ViewChildren} from "@angular/core";
import {DatabaseService} from "../services/database.service";
import {ActivatedRoute} from "@angular/router";
import * as firebase from 'firebase';

@Directive({
  selector: '[appHoverDelete]'
})

export class HoverDeleteDirective implements OnInit {
  @Input() posts;
  @Input() videoId;
  @ViewChildren('postBody') postBody: ElementRef;

  constructor (private renderer: Renderer2,
               private elemRef: ElementRef,
               private databaseService: DatabaseService,
               private route: ActivatedRoute) {}
  ngOnInit() {
  }
  @HostListener('mouseenter') toggleOpen() {
    const spanItem = this.renderer.createElement('span');
    this.renderer.addClass(spanItem, 'glyphicon');
    this.renderer.addClass(spanItem, 'glyphicon-remove');
    this.renderer.addClass(spanItem, 'pull-right');
    this.renderer.setProperty(spanItem, 'id', 'userCommentsSocial');
    this.renderer.listen(spanItem, 'click', this.deleteItems.bind(this));
    this.renderer.appendChild(this.elemRef.nativeElement.querySelector('div'), spanItem);
  }
  @HostListener('mouseleave') toggleClose() {
    // console.log(this.commentsTimestamp.nativeElement);
    this.renderer.removeChild(this.elemRef.nativeElement.querySelector('div'),
      this.elemRef.nativeElement.querySelector('#userCommentsSocial'));
  }
  deleteItems() {
    const myPost = [];
    myPost.push(this.posts)
    console.log(myPost)
    this.databaseService.retrieveUserInfoFromId(myPost);
    const rootRef = firebase.database().ref();
    const shouldDeleteComment = confirm('Are you sure you want to delete this comment?');
    // Variables received from the db
    var lastPostTime = '';
    var threadID = '';
    this.route.queryParams.subscribe(
      (data) => {
        threadID = data.videoId;
        var deletedPostTime = '';
        if (shouldDeleteComment) {
          const selectedPostId = this.posts;
          console.log(selectedPostId);
          console.log(threadID + ' - thread id')
          rootRef.child('Thread').child(threadID).once('value', (snapshot) => {
            lastPostTime = Object.values(snapshot.val())[0];
            // This is where the post timestamp is located
            // console.log(Object.values(snapshot.val())[0]);
          }).then(() => {
            // Retrieve the post time of the object that is about to be deleted. Change to not go to the db again
            rootRef.child('Post').child(threadID).child(selectedPostId).once('value', (snapshot) => {
              // deletedPostTime = snapshot.val().timestamp;
              console.log(Object.values(snapshot.val()));
            }).then(() => {
              rootRef.child('Post').child(threadID).child(selectedPostId).remove(
                () => {
                  // We want to see if the post we are deleting has the same post time as the last post in the database. If so,
                  // we need to update the database to have the most recent post. To do this, get the most recent child from
                  // the db and find it's current time, then write to the new value to the db
                  if (lastPostTime === deletedPostTime) {
                    console.log('Need to update last post time');
                    var postTime;
                    rootRef.child('Post').child(threadID).limitToLast(1).once('value', (snapshot2) => {
                      postTime = Object.values(snapshot2.val())[0].timestamp;
                    }).then(() => {
                      if (postTime) {
                        rootRef.child('Thread').child(threadID).update({'lastPost': postTime});
                      }
                    });
                  }
                  this.databaseService.readDataFromChild('Post', threadID, 6);
                });
            });
          });
        }
      }
    );
  }
}
