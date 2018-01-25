import { Component, OnInit } from '@angular/core';
import {toPromise} from "rxjs/operator/toPromise";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  siteMessage = "Welcome to a new way to stream social media.";
  constructor() { }
  ngOnInit() {
  }
}
