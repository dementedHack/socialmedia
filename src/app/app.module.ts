import { DecimalPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { DatabaseService } from "./services/database.service";
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LambdaService } from "./services/lambda.service";
import { HttpModule } from "@angular/http";
import * as firebase from "firebase";

import { AppComponent } from './app.component';
import { TopNavbarComponent } from './navigation/top-navbar-main/top-navbar-main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardAdComponent } from './dashboard/dashboard-ad/dashboard-ad.component';
import { BlackMoviesComponent } from './dashboard/black-movies/black-movies.component';
import { AmateurMoviesComponent } from './dashboard/amateur-movies/amateur-movies.component';
import { ViewVideoComponent} from './view-video/view-video.component';
import { ShareVideoComponent } from './view-video/share-video/share-video.component';
import { MobileAdBannerComponent } from './advertisement/mobile-ad-banner/mobile-ad-banner.component';
import { TopNavbarSubComponent } from './navigation/top-navbar-sub/top-navbar-sub.component';
import { FooterComponent } from './navigation/footer/footer.component';
import { MobileAdSquareBottomComponent } from './advertisement/mobile-ad-square-bottom/mobile-ad-square-bottom.component';
import { SidebarRecommendedVideosComponent } from './view-video/sidebar-recommended-videos/sidebar-recommended-videos.component';
import { BottomRecommendedVideosComponent } from './view-video/bottom-recommended-videos/bottom-recommended-videos.component';
import { VideoCommentsComponent } from './view-video/video-comments/video-comments.component';
import { AuthComponent } from './auth/auth.component';
import {EmailSentComponent} from "./support/email-sent.component";

import { AuthService } from "./services/auth.service";
import { GenerateTimestampService } from "./services/generate-timestamp.service";
import { ManagementComponent } from './management/management.component';
import { ReformatVideoThumbnailDirective } from './reformat-video-thumbnail.directive';
import { UploadComponent } from './upload/upload.component';
import {S3Service} from "./services/S3.service";
import {DropdownDirective} from "./shared/dropdown.directive";
import {HoverDeleteDirective} from "./shared/hover-delete.directive";
import {SupportComponent} from "./support/support.component";
import {GenerateUidService} from "./services/generate-uid.service";
import {CleanUrlService} from "./services/clean-url.service";
import { WorkInProgressComponent } from './work-in-progress/work-in-progress.component';
import { DashboardMoviesListNormalComponent } from './dashboard/dashboard-movies-list-normal/dashboard-movies-list-normal.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SideMenuComponent } from './user-management/side-menu/side-menu.component';
import { FeedComponent } from './user-management/feed/feed.component';
import { VideoUploadsComponent } from './user-management/video-uploads/video-uploads.component';
import { PhotoUploadsComponent } from './user-management/photo-uploads/photo-uploads.component';
import { EditVideoComponent } from './user-management/edit-video/edit-video.component';
import { DonateComponent } from './donate/donate.component';
import { SuccessfulComponent } from './donate/successful/successful.component';
import { CategoriesComponent } from './categories/categories.component';
import { TestComponent } from './test/test.component';
import { SearchComponent } from './search/search.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ResetPasswordSuccessComponent } from './auth/reset-password/reset-password-success/reset-password-success.component';

const appRoutes: Routes = [
  {path: '', component: DashboardComponent, pathMatch: 'full'},
  {path: 'Successful_Email', component: EmailSentComponent, pathMatch: 'full'},
  {path: 'Edit_Video', component: EditVideoComponent, pathMatch: 'full'},
  {path: 'Channel/Video_Uploads', component: VideoUploadsComponent, pathMatch: 'full'},
  {path: 'Channel/Photo_Uploads', component: PhotoUploadsComponent, pathMatch: 'full'},
  {path: 'Channel', component: UserManagementComponent, pathMatch: 'full'},
  {path: 'Work_In_Progress', component: WorkInProgressComponent, pathMatch: 'full'},
  {path: 'Search', component: SearchComponent, pathMatch: 'full'},
  {path: 'View_Video', component: ViewVideoComponent, pathMatch: 'full'},
  {path: 'User_Authentication', component: AuthComponent, pathMatch: 'full'},
  {path: 'Management', component: ManagementComponent, pathMatch: 'full'},
  {path: 'Upload', component: UploadComponent, pathMatch: 'full'},
  {path: 'Categories', component: CategoriesComponent, pathMatch: 'full'},
  {path: 'Reset-Password', component: ResetPasswordComponent, pathMatch: 'full'},
  {path: 'Reset-Password-Sent', component: ResetPasswordSuccessComponent, pathMatch: 'full'},
  {path: 'Support', component: SupportComponent, pathMatch: 'full'},
  {path: 'Donate', component: DonateComponent},
  {path: 'Page-Not-Found', component: PageNotFoundComponent},
  {path: '**', redirectTo: 'Page-Not-Found'}
]

@NgModule({
  declarations: [
    AppComponent,
    TopNavbarComponent,
    DashboardComponent,
    PageNotFoundComponent,
    DashboardAdComponent,
    BlackMoviesComponent,
    AmateurMoviesComponent,
    ViewVideoComponent,
    ShareVideoComponent,
    MobileAdBannerComponent,
    TopNavbarSubComponent,
    FooterComponent,
    MobileAdSquareBottomComponent,
    SidebarRecommendedVideosComponent,
    BottomRecommendedVideosComponent,
    VideoCommentsComponent,
    AuthComponent,
    ManagementComponent,
    ReformatVideoThumbnailDirective,
    HoverDeleteDirective,
    UploadComponent,
    DropdownDirective,
    SupportComponent,
    EmailSentComponent,
    CleanUrlService,
    WorkInProgressComponent,
    DashboardMoviesListNormalComponent,
    UserManagementComponent,
    SideMenuComponent,
    FeedComponent,
    VideoUploadsComponent,
    PhotoUploadsComponent,
    EditVideoComponent,
    DonateComponent,
    SuccessfulComponent,
    CategoriesComponent,
    TestComponent,
    SearchComponent,
    ResetPasswordComponent,
    ResetPasswordSuccessComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    TagInputModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    DatabaseService,
    AuthService,
    GenerateTimestampService,
    LambdaService,
    S3Service,
    CleanUrlService,
    GenerateUidService],
  bootstrap: [AppComponent]
})
export class AppModule { }
