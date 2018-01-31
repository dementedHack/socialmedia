import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
import {DatabaseService} from "../../services/database.service";
import {NgForm} from "@angular/forms";
import {Video} from "../../shared/video.model";
import {S3Service} from "../../services/S3.service";
import {AuthService} from "../../services/auth.service";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['./edit-video.component.css']
})
export class EditVideoComponent implements OnInit {
  selectedCategories = [];
  autoCompleteCategoryItems = ['Animation', 'Comedy', 'Romance', 'Sci-Fi'];
  selectedTalentItems = [];
  selectedTagItems = [];
  categoryItemsToDeleteFromDatabase;
  categoryItemsToAddToDatabase;
  currentVideo = new Video(
    '',
    '',
    null,
    {},
    {},
    {},
    '',
    '',
    '',
    '',
    '',
    0,
    0,
    0);
  title;
  mediaType;
  categories = [];
  categoriesClean = [];
  categoriesDirty = [];
  talent = [];
  talentClean = [];
  tags = [];
  tagsClean = [];
  assetId;
  updateCount = 0;
  userId = localStorage.getItem('userUID');

  constructor(private router: Router,
              private route: ActivatedRoute,
              private databaseService: DatabaseService,
              private s3: S3Service,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.databaseService.readDataFromParent('Category', 50).then(
      (data) => {
        console.log(data);
        for (var i = 0; i < Object.keys(data).length; i++) {
          this.autoCompleteCategoryItems.push(Object.keys(data[i])[0]);
        }
        console.log(this.autoCompleteCategoryItems);
      }
    );
    // Get the videoId from the url
    this.assetId = this.route.snapshot.queryParams.videoId;
    // Get data from the DB based on the URL
    this.databaseService.readValuesFromChildTable('MovieProperty', this.assetId, 1)
      .subscribe(
        (data) => {
          this.currentVideo = data.json();
          // Assign values to the tag items -- Create function
          if (this.currentVideo.tags) {
            for (var i = 0; i < Object.keys(this.currentVideo.tags).length; i++) {
              this.tags.push(Object.keys(this.currentVideo.tags)[i]);
            }
          }
          if (this.currentVideo.talent) {
            for (var i = 0; i < Object.keys(this.currentVideo.talent).length; i++) {
              this.talent.push(Object.keys(this.currentVideo.talent)[i]);
            }
          }
          for (var i = 0; i < Object.keys(this.currentVideo.categories).length; i++) {
            this.categories.push(Object.keys(this.currentVideo.categories)[i]);
            this.categoriesClean.push(Object.keys(this.currentVideo.categories)[i]);
            this.categoriesDirty.push(Object.keys(this.currentVideo.categories)[i]);
          }
          console.log(this.categoriesClean);
        }
      );
  }

  objectsArray = [];

  onUpdateButtonClicked(form: NgForm) {
    if (form.value.title) {
      this.currentVideo.title = form.value.title;
    }

    // Iterates through the tag values and assigns them as objects to save to the db
    const arraysToReformat = [this.categoriesDirty, this.talent, this.tags];
    var tempArr = [];
    for (var i = 0; i < arraysToReformat.length; i++) {
      var arrayToConvert = [];
      if (arraysToReformat[i]) {
        tempArr = Object.values(arraysToReformat[i]);
        for (var j = 0; j < tempArr.length; j++) {
          if (tempArr[j]) {
            arrayToConvert.push(tempArr[j]);
          }
        }
        this.objectsArray[i] = this.formatArrayForDb(arrayToConvert);
      }
    }

    // // Check to see if we need to add or remove categories references from the DB
    this.categoryItemsToDeleteFromDatabase = this.compareCategoryTagsForDeletion(this.categoriesClean, this.categoriesDirty);
    // this.categoryItemsToAddToDatabase = this.compareCategoryTagsForAddition(this.categoriesClean, this.categoriesDirty);
    //
    this.removeCategoryReferences(this.categoryItemsToDeleteFromDatabase);

    // console.log(this.objectsArray)
    // This will set the value for the categories object if there has been a change
    Object.keys(this.objectsArray[0]) ?
      this.currentVideo.categories = this.objectsArray[0] :
      this.currentVideo.categories = this.formatArrayForDb(this.categories);
    Object.keys(this.objectsArray[1]) ?
      this.currentVideo.talent = this.objectsArray[1] :
      this.currentVideo.talent = this.formatArrayForDb(this.talent);
    Object.keys(this.objectsArray[2]) ?
      this.currentVideo.tags = this.objectsArray[2] :
      this.currentVideo.tags = this.formatArrayForDb(this.tags);

    // Get category values from the database
    // Send the new object to the database
    this.databaseService.updateChildTable('MovieProperty', this.assetId, this.currentVideo);
  }

  compareCategoryTagsForDeletion(oldArray, newArray) {
    var itemsToDelete = [];
    for (var i = 0; i < oldArray.length; i++) {
      if (newArray.indexOf(oldArray[i]) === -1) {
        console.log(oldArray[i] + ' not here');
        itemsToDelete.push(oldArray[i]);
      }
    }
    return itemsToDelete;
  }

  compareCategoryTagsForAddition(oldArray, newArray) {
    var itemsToAdd = [];
    for (var i = 0; i < newArray.length; i++) {
      if (oldArray.indexOf(newArray[i]) === -1) {
        console.log(newArray[i] + ' needs to be added');
        itemsToAdd.push(newArray[i]);
      }
    }
    return itemsToAdd;
  }

  removeCategoryReferences(itemsToRemove) {
   for(var i = 0; i < itemsToRemove.length; i++) {
     console.log(itemsToRemove[i]);
     this.databaseService.removeChild(itemsToRemove[i] + 'Movie', this.assetId);
   }
  }

  onDeleteButtonClicked() {
    var txt;
    const r = confirm("Are you sure you want to delete this video?\nThis action cannot be undone!");
    if (r === true) {
      const isFunctionDone = new Subject();
      console.log('Video is deleted');
      this.s3.getS3ObjectsList('bestpornchannel-uploads-transcoded', this.currentVideo.fileName)
        .then(
          (data) => {
            console.log(data);
            this.s3.deleteS3Objects(data, 'bestpornchannel-uploads-transcoded')
              .then(
                (dataFromS3) => {
                  // After the objects have sucessfully been deleted from S3, let's remove the data from the DB
                  if (dataFromS3) {
                    this.databaseService.removeChild('MovieProperty', this.assetId)
                      .then(
                        () => {
                          this.databaseService.removeFourNodesDown('User', this.userId, 'movie', this.assetId).then(
                            () => {
                              for (var i = 0; i < this.categoriesClean.length; i++) {
                                this.databaseService.removeChild(this.categoriesClean[i] + 'Movie', this.assetId);
                              }
                            }
                          );
                          console.log('Change page');
                        }
                      );
                  }
                }
              );
          }
        );
    }
  }

  // Handles the tag events
  onTagItemAdded(event, array) {
    array.push(event.value);
    console.log(array)
  }

  // Handles the tag events
  onCategoryItemAdded(event, array) {
    console.log(event.value)
    array.push(event.value);
    this.categoriesDirty.push(event.value);

    console.log(this.categoriesDirty);
  }

  onTagItemRemoved(event, array) {
    var indexToRemove;
    if (event.value) {
      indexToRemove = array.indexOf(event.value);
    } else if (event) {
      indexToRemove = array.indexOf(event);
    }
    array.splice(indexToRemove, 1);
    console.log(array);
  }

  onCategoryItemRemoved(event, array) {
    var indexToRemove;
    if (event.value) {
      indexToRemove = array.indexOf(event.value);
    } else if (event) {
      indexToRemove = array.indexOf(event);
    }
    array.splice(indexToRemove, 1);
    this.categoriesDirty.splice(indexToRemove, 1);
    console.log(this.categoriesDirty);
  }

  formatArrayForDb(array) {
    var formattedObject = {};
    for (var i = 0; i < array.length; i++) {
      formattedObject[array[i]] = true;
    }
    return formattedObject;
  }
}
