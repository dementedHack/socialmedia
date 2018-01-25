import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import * as Stripe from 'Stripe';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyBBJlv-gunOeY0mnRdfampNIreu_cEOcy0",
      authDomain: "bpcdb-bd576.firebaseapp.com",
      databaseURL: "https://bpcdb-bd576.firebaseio.com",
      projectId: "bpcdb-bd576"
    });
  }

  onResize(event) {
    console.log(event.target.innerWidth);
  }
}
