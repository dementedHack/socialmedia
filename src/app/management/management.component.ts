import { Component, OnInit } from '@angular/core';
import {DatabaseService} from "../services/database.service";

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
  }

  onCreateDummyVideo(){
    // this.databaseService.writeValueToParentTable();
  }

}
