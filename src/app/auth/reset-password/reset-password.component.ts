import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  email;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  resetPassword () {
    this.authService.resetPassword(this.email);
  }
}
