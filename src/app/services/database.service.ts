import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {GenerateTimestampService} from "../services/generate-timestamp.service";
import {Subject} from "rxjs/Subject";
import {Video} from "../video.model";

@Injectable()
export class DatabaseService {
  valuesReadFromParentTable = new Subject();
  valuesReadFromAmateurTable = new Subject();
  valuesReadFromAsianTable = new Subject();
  username;

  snapshotAsArray;
  constructor(private timestampService: GenerateTimestampService){}
  rootRef = firebase.database().ref();
  newKey;

  // Database reads
  readValuesFromParentTable(tableToRead, readLimit) {
    this.rootRef.child(tableToRead).limitToFirst(readLimit).once('value')
      .then((snapshot) => {
         this.snapshotAsArray = Object(snapshot.val());
         return this.onDataRead(tableToRead);
      });
  }

  onDataRead(table) {
    console.log(table);
   if(table === 'AmateurMovie') {
     console.log('match')
     this.valuesReadFromAmateurTable.next(this.snapshotAsArray);
   } else if(table === 'AsianMovie'){
     this.valuesReadFromAsianTable.next(this.snapshotAsArray);
   }else {
     this.valuesReadFromParentTable.next(this.snapshotAsArray);
   }
  }



  // Database writes
  writeValueToParentTable() {
    this.newKey = this.rootRef.push().key;
    this.rootRef.child('AsianMovie').child(this.newKey).set({
      title : "Asses of fire",
      views: Math.ceil(Math.random() * 100000),
      likes: Math.ceil(Math.random() * 100000),
      dislikes: Math.ceil(Math.random() * 100000),
      location: "https://www.pornhub.com/embed/ph59d36d90c5bee",
      thumbnailPreview: 'https://ci.phncdn.com/videos/201710/03/135351981/thumbs_40/(m=eWdTGgaaaa)(mh=ceMHSWGty4sUAMgk)8.jpg"|"https://ci.phncdn.com/videos/201710/03/135351981/thumbs_40/(m=eWdTGgaaaa)(mh=ceMHSWGty4sUAMgk)1',
      timeUploaded: this.timestampService.createTimestampForNow(),
      duration: 123,
      tags: {
        fetish: true
      },
      thumbnails: 123
    })
      .then(() => {
        this.rootRef.child('AsianMovieProperty').child(this.newKey).set(
          {
            resolution: '1080x560',
            uploadedBy: null,
            director: 'Marcus Delvato',
            producer: 'Cesar',
            timesShared: 123333,
          })
            .then(() => {
              this.rootRef.child("MovieList").child(this.newKey).set("AsianMovie");
            });
      })
      .then(() => {
        if (this.username === 'admin') {
          this.rootRef.child('User').child('admin').set(
            {
              resolution: '1080x560',
              uploadedBy: 'admin',
              director: 'Marcus Delvato',
              producer: 'Cesar',
              timesShared: 123333,
            });
        }

      });
  }

  createUser() {
    this.newKey = this.rootRef.push().key;
    this.rootRef.child('User').child(this.newKey).set({
      firstName: 'Kai',
      lastName: 'Perez',
      userName: 'nardDog',
      premium: false,
      admin: false,
      videos: {},
      timeCreated: this.timestampService.createTimestampForNow()
    });
  }
}
