import { Injectable} from '@angular/core';
import * as firebase from 'firebase';
import { GenerateTimestampService} from "./generate-timestamp.service";
import { Subject} from "rxjs/Subject";
import { Video} from "../shared/video.model";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {Http} from "@angular/http";

@Injectable()
export class DatabaseService {
  valueReadFromMovieListTable = new Subject();
  valuesReceivedForMovie = new Subject();
  valuesReadFromParentTable = new Subject();
  valuesReadFromAmateurTable = new Subject();
  valuesReadFromAsianTable = new Subject();
  usernames = new Subject();
  username;
  results = new Subject();
  valuesAsObjects = new Subject();
  parentValuesAsObjects = new Subject();
  childValuesAsObjects = new Subject();
  databaseEndpoint = 'https://bpcdb-bd576.firebaseio.com/';
  objectsRemovedFromDB = new Subject();

  snapshotAsArray;
  constructor(private timestampService: GenerateTimestampService,
              private http: Http) {}
  rootRef = firebase.database().ref();

  postsObservable = Observable.create((observer: Observer<any>) => {
    observer.next('');
  });

  usersInfoObservable = Observable.create((observer: Observer<any>) => {
    observer.next([]);
  });
  // Database reads all data with a limit
  readValuesFromParentTable(tableToRead, queryParams) {
    if (queryParams) {
      return this.http.get(this.databaseEndpoint + tableToRead + '.json',
        {params: {orderBy: encodeURI('"$key"'), limitToLast: queryParams.limitToLast} });
    } else {
      return this.http.get(this.databaseEndpoint + tableToRead + '.json');
    }
  }
  // Database read with a query for the child
  // If isForIndividual is true, this indicates we're querying for a single video that the user is viewing
  // in which case we will transmit data to an observable
  readValuesFromChildTable(tableToRead, childToRead, queryParams) {
    // console.log(tableToRead, childToRead, queryParams)
    if (queryParams) {
      return this.http.get(this.databaseEndpoint + tableToRead + '/' +
        childToRead + '.json',
        {params: queryParams });
    } else {
      return this.http.get(this.databaseEndpoint + tableToRead + '/' +
        childToRead + '.json');
    }
  }

  onDataRead(table, snapshotAsArray) {
    console.log(table);
   if(table === 'AmateurMovie') {
     console.log('match')
     this.valuesReadFromAmateurTable.next(snapshotAsArray);
   } else if(table === 'AsianMovie') {
     this.valuesReadFromAsianTable.next(snapshotAsArray);
   } else if (table === 'MovieList') {
     this.valueReadFromMovieListTable.next(snapshotAsArray);
   } else {
     this.valuesReadFromParentTable.next(snapshotAsArray);
   }
  }

  onViewVideoDataReceived(snapshotAsArray) {
    console.log(snapshotAsArray);
    this.valuesReceivedForMovie.next(snapshotAsArray);
  }

  // After a file has been successfully uploaded to S3, it will get logged in our DB
  onSuccessfulUserUpload(selectedVideo: Video, uploadedBy: string, parentTable, childTable) {
    const rootRef = firebase.database().ref();
    // Determine how many categories we need to save the info to
    const categoriesArr = Object.values(selectedVideo.categories);
    const newKey = rootRef.push().key;
    for (var i = 0; i < categoriesArr.length; i ++) {
      const movieParentTable = categoriesArr[i];
      rootRef.child('MovieProperty').child(newKey).set(
            {
              title : selectedVideo.title,
              mediaType: selectedVideo.mediaType,
              thumbnailPreview: selectedVideo.thumbnail,
              duration: 0,
              resolution: '1080x560',
              uploadedBy: uploadedBy,
              talent: selectedVideo.talent,
              timesShared: 0,
              views: 0,
              URI: selectedVideo.URI,
              fileExtension: selectedVideo.fileExtension,
              timeUploaded: selectedVideo.timeUploaded,
              likes: 0,
              dislikes: 0,
              tags: selectedVideo.tags,
              thumbnails: {},
              categories: selectedVideo.categories,
              fileName: selectedVideo.fileName,
              premium: false
            }
          );
      rootRef.child('User').child(uploadedBy).child('movie').update(
        {[newKey]: true} , () => {
        })
        .then(
          () => {
            const ref = firebase.database().ref();
            for (var i = 0; i < Object.keys(selectedVideo.categories).length; i++) {
              // console.log(Object.keys(selectedVideo.categories)[i] + 'Movie', newKey);
              ref.child(Object.keys(selectedVideo.categories)[i] + 'Movie').update({[newKey]: true});
            }
          }
        );
    }
  }
  // If submitted from the video Posts section, the threadUID will be the video UID
  onPostSubmitted(parentTable, childTable, body, generateNewKey, writeThirdNode, thirdNode, itemToInsert) {
    // First we update the thread table
    const rootRef = firebase.database().ref();
    if (generateNewKey) {
      // console.log(generateNewKey)
      const newKey = rootRef.child(parentTable).push().key;
      this.rootRef.child(parentTable).child(childTable).child(newKey).update(body);
    } else if (writeThirdNode) {
      this.rootRef.child(parentTable).child(childTable).child(thirdNode).update(itemToInsert);
    } else {
      this.rootRef.child(parentTable).child(childTable).update(body);
    }
  }
  updateChildTable(parentTable, childTable, updateValue) {
    const rootRef = firebase.database().ref();
    rootRef.child(parentTable).child(childTable).update(
      updateValue , () => {
      });
  }
  updateThreeNodesDown(parentTable, childTable, thirdNode, updateValue) {
    const rootRef = firebase.database().ref();
    rootRef.child(parentTable).child(childTable).child(thirdNode).update(
      updateValue , () => {
      });
  }
  updateFourNodesDown(parentTable, childTable, thirdNode, fourthNode, updateValue) {
    const rootRef = firebase.database().ref();
    rootRef.child(parentTable).child(childTable).child(thirdNode).child(fourthNode).update(
      updateValue , () => {
      });
  }
  // Change to fit into other functions
  createUser() {
    const newKey = this.rootRef.push().key;
    this.rootRef.child('User').child(newKey).set({
      firstName: 'Kai',
      lastName: 'Perez',
      userName: 'nardDog',
      premium: false,
      admin: false,
      videos: {},
      timeCreated: this.timestampService.createTimestampForNow()
    });
  }
  retrieveUserInfoFromId(userIds) {
    const rootRef = firebase.database().ref();
    var usernames = [];
    console.log(userIds)
    for (var i = 0; i < userIds.length; i++) {
      rootRef.child('User').child(userIds[i]).once('value', (snapshot) => {
        if (snapshot.val()) {
          console.log(snapshot.val());
          usernames.push(snapshot.val().username);
        }
        if (usernames.length === userIds.length) {
          this.usernames.next(usernames);
        }
      });
    }
  }
  // Change to be a transaction
  addViewValue(tableToUpdate: string, childToUpdate: string, currentViewCount) {
    const newViewCount = currentViewCount + 1;
    return this.http.put(this.databaseEndpoint + tableToUpdate + '/' + childToUpdate + '/views' + '.json', newViewCount);
  }
  removeChild(parent, child) {
    const rootRef = firebase.database().ref();
    rootRef.child(parent).child(child).remove();
    return new Promise((resolve, reject) => {
      resolve('Successfully delete from db');
    });
  }
  removeThreeNodesDown(parent, child, thirdNode) {
    const rootRef = firebase.database().ref();
    rootRef.child(parent).child(child).child(thirdNode).remove();
    return new Promise((resolve, reject) => {
      resolve('Successfully delete from db');
    });
  }
  removeFourNodesDown(parent, child, thirdNode, fourthNode) {
    console.log(parent, child, thirdNode, fourthNode)
    const rootRef = firebase.database().ref();
    rootRef.child(parent).child(child).child(thirdNode).child(fourthNode).remove();
    return new Promise((resolve, reject) => {
      resolve('Successfully deleted from db');
    });
  }
  readDataFromChild(parent, child, readLimit) {
    const rootRef = firebase.database().ref();
    var mySnapshotValues = [];
    rootRef.child(parent).child(child).limitToLast(readLimit).once('value',
      (snapshot) => {
      if (snapshot.val()) {
        console.log(snapshot.val())
        // Formats the object key with the following schema : {key1: val, key2: val}
        for(var i = 0; i < Object.keys(snapshot.val()).length; i++) {
          const objectKey = Object.keys(snapshot.val())[i];
          const objectValues = Object.values(snapshot.val())[i];
          const myObject = {[objectKey]: [objectValues][0]};
          mySnapshotValues.push(myObject);
        }
          this.childValuesAsObjects.next(mySnapshotValues);
        } else {

        }
      });
      return new Promise((resolve, reject) => {
        this.childValuesAsObjects.subscribe(
          (data) => {
            resolve(data);
          });
      });
  }
  readDataFromParent(parent, readLimit) {
    const rootRef = firebase.database().ref();
    console.log(parent, readLimit);
    var mySnapshotValues = [];
    rootRef.child(parent).limitToLast(readLimit).once('value',
      (snapshot) => {
        if (snapshot.val()) {
          // Formats the object key with the following schema : {key1: val, key2: val}
          for(var i = 0; i < Object.keys(snapshot.val()).length; i++) {
            const objectKey = Object.keys(snapshot.val())[i];
            const objectValues = Object.values(snapshot.val())[i];
            const myObject = {[objectKey]: [objectValues][0]};
            mySnapshotValues.push(myObject);
            console.log(myObject);
          }
          this.parentValuesAsObjects.next(mySnapshotValues);

        } else {

        }
      });
      return new Promise((resolve, reject) => {
        this.parentValuesAsObjects.subscribe(
          (data) => {
            resolve(data);
          });
        });
  }
  readDataFromThirdNode(parent, child, thirdNode, readLimit) {
    const rootRef = firebase.database().ref();
    var mySnapshotValues = [];
    rootRef.child(parent).child(child).child(thirdNode).limitToLast(readLimit).once('value',
      (snapshot) => {
        if (snapshot.val()) {
          // Formats the object key with the following schema : {key1: val, key2: val}
          for(var i = 0; i < Object.keys(snapshot.val()).length; i++) {
            const objectKey = Object.keys(snapshot.val())[i];
            const objectValues = Object.values(snapshot.val())[i];
            const myObject = {[objectKey]: [objectValues][0]};
            mySnapshotValues.push(myObject);
          }
          this.valuesAsObjects.next(mySnapshotValues);
        } else {
        }
      }
    );
  }
  postLikedDisliked(liked, parent, child, thirdNode, media, exists) {
    const dataValue = new Subject();
    if (thirdNode) {
      var numberOfLikesOrDislikes = 0;
      if (liked) {
        const rootRef = firebase.database().ref().child(parent).child(child).child(thirdNode).child('likes');
        if (exists) {
          rootRef.transaction(
            (likes) => {
              if (likes > 0) {
                likes = likes - 1;
                numberOfLikesOrDislikes = likes;
              }
              this.updateThreeNodesDown('User', localStorage.getItem('userUID'), 'liked' + media, {[thirdNode]: null});
              dataValue.next(likes);
              return likes;
            });
        } else {
          rootRef.transaction(
            (likes) => {
              if (likes >= 0) {
                likes = likes + 1;
                numberOfLikesOrDislikes = likes;
              }
              this.updateThreeNodesDown('User', localStorage.getItem('userUID'), 'liked' + media, {[thirdNode]: true});
              dataValue.next(likes);
              return likes;
            });
          }
      } else {
        const rootRef = firebase.database().ref().child(parent).child(child).child(thirdNode).child('dislikes');
        if (exists) {
          rootRef.transaction(
            (dislikes) => {
              if (dislikes > 0) {
                dislikes = dislikes - 1;
                numberOfLikesOrDislikes = dislikes;
              }
              this.updateThreeNodesDown('User', localStorage.getItem('userUID'), 'disliked' + media, {[thirdNode]: null});
              dataValue.next(dislikes);
              return dislikes;
            });
        } else {
          rootRef.transaction(
            (dislikes) => {
              if (dislikes >= 0) {
                dislikes = dislikes + 1;
                numberOfLikesOrDislikes = dislikes;
              }
              this.updateThreeNodesDown('User', localStorage.getItem('userUID'), 'disliked' + media, {[thirdNode]: true});
              dataValue.next(dislikes);
              return dislikes;
            });
          }
        }
      } else {

    }
    return new Promise((resolve, reject) => {
      dataValue.subscribe(
        (data) => {
          resolve(data);
        });
    });
  }
}
