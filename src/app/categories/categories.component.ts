import { Component, OnInit } from '@angular/core';
import {DatabaseService} from "../services/database.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categoryNames = [];
  categoryImages = [];
  constructor(private databaseService: DatabaseService,
              private router: Router) { }

  ngOnInit() {
    this.databaseService.readDataFromParent('Category', 50);
    this.databaseService.parentValuesAsObjects
      .subscribe(
        (data) => {
          for (var i = 0; i < Object.values(data).length; i++) {
            const categoryName = (Object.keys(Object.values(data)[i])[0]);
            this.categoryNames.push(categoryName);
            const image = (Object.values(Object.values(data)[i])[0].Image);
            this.categoryImages.push(image);
          }
        }
      );
  }
  onCategoryItemClicked(category) {
    this.router.navigate(['Search'], { queryParams: { Media: 'Movie', Category: category } });
  }
}
