import * as firebase from 'firebase';
import {Subject} from "rxjs/Subject";
import {Observer} from "rxjs/Observer";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthService {
  newCredentialsValid = new Subject();
  existingCredentialsValid = new Subject();
  token;
  isUserSignedInSubject = new Subject();
  loggedInStatusObservable = Observable.create((observer: Observer<boolean>) => {
    observer.next(false);
  });
  constructor (private router : Router) {}
  // The function that creates a new user account from user inputs
  signUserUp(email: string, password: string){
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(
        error => console.log(error)
      );
  }
  // Signs the user in with existing credentials
  signUserIn(email, password) {
    const isSuccessful = new Subject();
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
        (response) => {
          const userUID = firebase.auth().currentUser.uid;
          localStorage.setItem('userUID', userUID);
          // Update database timestamps
          this.isUserSignedInSubject.next(true);
          isSuccessful.next(true);
        })
      .catch(
        (error) => {
          isSuccessful.next(false);
        }
      );
    return new Promise((resolve, reject) => {
      isSuccessful
        .subscribe(
          (data) => {
            resolve(data);
          }
        );
    });
  }

  // Gets the authentication token from the user account
  getToken() {
    return localStorage.getItem('userUID');
  }

  // Gets the authentication token from the user account
  isUserSignedIn() {
    firebase.auth().onAuthStateChanged( (user) => {
      if (user) {
        this.isUserSignedInSubject.next(true);
      } else {
        // No one is logged in
        this.isUserSignedInSubject.next(false);
      }
    });
  }

  isAuthenticated() {
    return this.token != null;
  }

  onLogout() {
    const userId = localStorage.getItem('userUID');
    this.token = null;
    localStorage.clear();
    const isSuccessful = new Subject();
    firebase.auth().signOut().then(
      () => {
        isSuccessful.next(true);
      }
    );
    this.isUserSignedInSubject.next(false);
    return new Promise((resolve, reject) => {
      isSuccessful
        .subscribe(
          (data) => {
            if (data) {
              resolve(userId);
            }
          }
        );
    });
  }
  onNewUserCredentialsSubmitted(username: string, email: string) {
    firebase.auth().createUserWithEmailAndPassword(username, email)
      .then(
        (data) => {
          this.newCredentialsValid.next(true);
          firebase.auth().currentUser.sendEmailVerification().then(function() {
            // Email sent.
            console.log('email sent');
          }).catch(function(error) {
            // An error happened.
          });
          // alert('Account was successfully created. Data: ' + data);
        }
      )
      .catch(
        (error) => {
          alert(error);
        }
      );
  }
  resetPassword(email) {
    firebase.auth().sendPasswordResetEmail(email).then(
      () => {
      // Email sent.
        this.router.navigate(['/Reset-Password-Sent']);
    }).catch(function(error) {
      // An error happened.
      alert(error);
    });
  }
}
