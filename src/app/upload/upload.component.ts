import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import {DatabaseService} from '../services/database.service';
import {GenerateUidService} from '../services/generate-uid.service';
import { Http, HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import * as AWS from 'aws-sdk';
import {Video} from '../shared/video.model';
import {GenerateTimestampService} from "../services/generate-timestamp.service";
import {LambdaService} from "../services/lambda.service";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})

export class UploadComponent implements OnInit {
  @ViewChild('myProgressBar') myProgressBar: ElementRef;
  constructor(
    private databaseService: DatabaseService,
    private UIDService: GenerateUidService,
    private http: Http,
    private timestampService: GenerateTimestampService,
    private lambdaService: LambdaService,
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2
  ) { }
  file;
  selectedCategories = [];
  selectedTalentItems = [];
  selectedTagItems = [];
  uploadedStatus;
  uploadedStatusSubject = new Subject();
  // Formatted for the DB from the above arrays
  selectedCategoriesFormatted = {};
  selectedTalentItemsFormatted = {};
  selectedTagItemsFormatted = {};
  currentMediaTypeSelected = 'Select';
  currentTalentItemSelected = 'Select';
  assetLocation = '';
  fileExtension = '';
  assetDisplayName = '';
  selectedVideo = new Video('', '', null, {}, {}, {}, 'Select', '', '', '', '', 0, 0, 0);
  elasticTranscoderLambdaFunctionEndpoint = 'https://jajo74j11a.execute-api.us-west-1.amazonaws.com/dev/upload-video';
  transcodedBucketDomain = 'https://d296sbwne3cygs.cloudfront.net/';
  UID = '';
  width = 0;
  // Determines the log in status of the user
  isLoggedIn = false;
  mediaTypes = [
    'Movie'
  ];
  categories = [
    'Animation',
    'Comedy',
    'Dark',
    'Musical',
    'Drama',
    'Romance',
    'Educational'
  ];
  // autoCompleteTagItems = [
  //   'Amateur',
  //   'Big Ass',
  //   'BBW',
  //   'Bukake',
  //   'Fetish',
  //   'Interacial',
  //   'Pornhub',
  //   'POV',
  //   'Professional'
  // ];
  autoCompleteTagItems = [
    'Indie',
    'Western'
  ];
  // autoCompleteCategoryItems = [
  //   'Amateur',
  //   'Asian',
  //   'BBW',
  //   'Blonde',
  //   'Black',
  //   'Brunette'
  // ];
  autoCompleteCategoryItems = [
  ];
  ngOnInit() {
    // Get category items
    this.databaseService.readDataFromParent('Category', 50).then(
      (data) => {
        console.log(data);
        for (var i = 0; i < Object.keys(data).length; i++) {
          this.autoCompleteCategoryItems.push(Object.keys(data[i])[0]);
        }
        console.log(this.autoCompleteCategoryItems);
      }
    );
    // Check login status
    this.authService.isUserSignedInSubject.subscribe(
      (data: boolean) => {
        this.UID = localStorage.getItem('userUID');
        this.isLoggedIn = data;
      });
    this.authService.isUserSignedIn();
  }
  setFile(event) {
    this.selectedVideo.fileContent = event.target.files;
    if (this.selectedVideo.fileContent.size > 0) {
      console.log(this.selectedVideo.fileContent[0]); // You will see the file
      console.log(this.selectedVideo.fileContent[0].name); // You will see the file
    }
    const splitDisplayName = this.selectedVideo.fileContent[0].name.split('.');
    this.selectedVideo.fileExtension = '.' + splitDisplayName[1];
    this.selectedVideo.title =  splitDisplayName[0];
  }

  // Uploads the files to S3
  uploadFile() {
    this.uploadedStatusSubject
      .subscribe(
        (data) => {
          this.uploadedStatus = data;
        }
      )
    // Generate a unique id for the file name
    this.selectedVideo.fileName = this.UIDService.generate();
    // Format all the arrays before sending them to the DB
    this.selectedVideo.tags = this.formatArrayForDb(this.selectedTagItems);
    this.selectedVideo.categories = this.formatArrayForDb(this.selectedCategories);
    this.selectedVideo.talent = this.formatArrayForDb(this.selectedTalentItems);
    console.log(this.selectedVideo.categories)

    if (!this.selectedVideo.fileContent) {
      return alert('Select a valid file!');
    }
    // Configure the S3 information - this is a user that is allowed to upload to this project's useruploads bucket
      AWS.config.update({
        region: 'us-west-1',
        accessKeyId: 'AKIAJWWRX5JPSGLU3W3A',
        secretAccessKey: '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'
      });
      if (this.selectedCategories.length <= 0) {
        return alert('No category was selected!');
      } else {
        // Creates pubicly accessible s3 file with the specified values
        const uploadParams = {
          Bucket: 'bestpornchannel-useruploads',
          Key: this.selectedVideo.mediaType + '/' + this.selectedVideo.fileName + this.selectedVideo.fileExtension,
          Body: this.selectedVideo.fileContent[0],
          ACL: 'public-read'
        };

        const s3 = new AWS.S3({
          apiVersion: '2006-03-01'
        });
        const s3URIToConvert = this.selectedVideo.mediaType + '/' + this.selectedVideo.fileName + this.selectedVideo.fileExtension;
        this.selectedVideo.timeUploaded = this.timestampService.createTimestampForNow();
        var currentUploadProgress = 0;
        var updatedUploadProgress = 0;
        s3.upload(uploadParams).on('httpUploadProgress', (event) => {
          // Returns the progress uploaded status
          // console.log("Uploaded :: " + parseInt((event.loaded * 100) / event.total)+'%');
          this.uploadedStatus = Math.floor((event.loaded * 100) / (event.total));
          updatedUploadProgress = Math.floor((event.loaded * 100) / (event.total));
          // Conditionally update the progress bar
          if (updatedUploadProgress !== currentUploadProgress) {
            currentUploadProgress = updatedUploadProgress;
            this.updateProgressBar();
          }
          if (this.uploadedStatus >= 100) {
            this.width = 100;
            this.updateProgressBar();
            if (this.selectedVideo.mediaType === 'Movie') {
              this.lambdaService.callLambda(s3URIToConvert)
                .subscribe(
                  (response) => {
                    // Sets the new URI after the transcoding is successful
                    this.selectedVideo.URI = this.transcodedBucketDomain +
                      this.selectedVideo.fileName + '/' +
                      '1080.mp4';
                    // Sets the thumbnail image
                    this.selectedVideo.thumbnail = this.transcodedBucketDomain +
                      this.selectedVideo.fileName + '/' + 'thumbs-' + this.selectedVideo.fileName + '-00001.png'
                    this.selectedVideo.fileExtension = '.mp4';
                    this.saveInputsToDB(this.selectedVideo.URI, this.selectedVideo);
                    this.uploadedStatusSubject.next(null);
                    this.router.navigate(['/']);
                  },
                  (error) => console.log(error)
                );
            }
          }
        }).send(function(err, data) {
          if (data) {
            alert('File was successfully uploaded. Thank you!');
          } else {
            alert(err);
          }
        });
      }
    }
    saveInputsToDB(fullURI, video) {
      // Creates the complete string for the s3 sendpoint
      video.URI = fullURI;
      this.databaseService.onSuccessfulUserUpload(video, this.UID, 'User', this.UID);
      this.router.navigate(['/']);
    }
    onTitleTyped(event) {
    // Update the title to whatever the user types in the field
      const splitDisplayName = event.path[0].value.split('.');
      console.log(splitDisplayName);
      this.selectedVideo.title = splitDisplayName[0];
    }

    onMediaTypeSelected(mediaType) {
      this.selectedVideo.mediaType = mediaType;
    }

    // Handles the tag events
    onItemAdded(event, array) {
      array.push(event.value);
      console.log(array);
    }

    onItemRemoved(event, array) {
      console.log(event);
      const indexToRemove = array.indexOf(event.value);
      array.splice(indexToRemove, 1);
      console.log(array);
    }
    // Formats the array for the database
    formatArrayForDb(array) {
      var formattedObject = {};
      for (var i = 0; i < array.length; i++) {
        formattedObject[array[i]] = true;
      }
      console.log(formattedObject)
      return formattedObject;
    }
    // This functions updates the width of the green in the progress bar to make
    // it looke animated
    updateProgressBar() {
    console.log(this.width);
      if (this.width <= 100) {
        this.width = this.uploadedStatus;
      } else if (this.width >= 100) {
        this.width = 100;
      }
        this.renderer.setStyle(this.myProgressBar.nativeElement, 'width',  this.width + '%');
        console.log(this.myProgressBar.nativeElement);
      }
}
