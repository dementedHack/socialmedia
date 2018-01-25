import { Component, OnInit} from '@angular/core';
import { AuthService } from "../services/auth.service";
import {DatabaseService} from "../services/database.service";
import {NgForm} from "@angular/forms";
import {EventEmitter} from "@angular/core";
import {Router} from "@angular/router";
import {GenerateTimestampService} from "../services/generate-timestamp.service";
import {GenerateUidService} from "../services/generate-uid.service";


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  password;
  isLoggedIn;

  constructor(private authService: AuthService,
              private databaseService: DatabaseService,
              private router: Router,
              private timestampService: GenerateTimestampService,
              private uidService: GenerateUidService) { }

  ngOnInit() {
  }
  onExistingCredentialsSubmitted(form: NgForm) {
    const username = form.value.existingEmail;
    const password = form.value.existingPassword;
    console.log(username);
    console.log(password);
    this.authService.signUserIn(username, password)
      .then(
        (data) => {
          if (data) {
            const currentTime = this.timestampService.createTimestampForNow();
            const lastLogin = {'last_login': currentTime};
            console.log(localStorage.getItem('userUID'))
            this.databaseService.updateChildTable('User', localStorage.getItem('userUID'), lastLogin);
          }
        }
      );
  }
  onNewCredentialsSubmitted(form: NgForm) {
    const email = form.value.newEmail;
    const username = form.value.newUsername;
    const password = form.value.newPassword;
    this.authService.onNewUserCredentialsSubmitted(email, password);
    this.authService.newCredentialsValid
      .subscribe(
        (data) => {
          if (data) {
            this.authService.signUserIn(email, password).then(
              () => {
                const currentTime = this.timestampService.createTimestampForNow();
                this.databaseService.updateChildTable('User', localStorage.getItem('userUID'),
                  {
                    'email': email,
                    'username': this.uidService.generate(),
                    'last_login': currentTime,
                    'premium': false,
                    'last_online': currentTime,
                    'verified': false
                  }
                );
              }
            );
          }
        }
      );
  }
}
