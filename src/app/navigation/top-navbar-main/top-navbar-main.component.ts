import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Http} from "@angular/http";
import {GenerateTimestampService} from "../../services/generate-timestamp.service";

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar-main.component.html',
  styleUrls: ['./top-navbar-main.component.css']
})
export class TopNavbarComponent implements OnInit {
  title = 'Social Media';
  isLoggedIn;
  databaseEndpoint = 'https://bpcdb-bd576.firebaseio.com/';

  constructor(private authService: AuthService,
              private timestampService: GenerateTimestampService,
              private http: Http) { }

  ngOnInit() {
    this.authService.isUserSignedInSubject.subscribe(
      (data: boolean) => {
        // console.log(data);
        // console.log(localStorage.getItem('userUID'));
        this.isLoggedIn = data;
      });
    this.authService.isUserSignedIn();
  }
  onLogoutButtonClicked() {
    this.authService.onLogout().then(
      (data) => {
        if (data) {
          const currentTime = this.timestampService.createTimestampForNow();
          console.log(currentTime)
          this.http
            .put(this.databaseEndpoint + 'User' + '/' + data + '/last_online' + '.json', JSON.stringify(currentTime)).
          subscribe(
            (httpData) => {
              console.log(httpData);
            }
          );
        }
      }
    );
  }
}
