import {Component, Injectable, OnInit} from '@angular/core';
import { Http} from "@angular/http";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

@Injectable()
@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  name = '';
  message = '';
  receiverAddress = 'contact@thedevtechs.com';
  senderAddress = 'kaiperez@thedevtechs.com';
  email = '';
  inquirySelected = 'Select';
  inquiries = [
    'General',
    'Bug(s)',
    'Innappropriate Content'
  ]

  constructor(private http: Http,
              private router: Router) { }

  ngOnInit() {
  }

  onFormSubmit(form: NgForm) {
    // Set the variables that will be input as parameters equal to the the user input from the form
    this.email = form.form.value.email;
    this.name = form.form.value.name;
    this.message = form.form.value.message;

    // Send the post request to the Lambda function with the body parameters
    const url = 'https://jajo74j11a.execute-api.us-west-1.amazonaws.com/dev/support-email';
    const body = {
      name: this.name,
      category: this.inquirySelected,
      message: this.message,
      receiverAddress: this.receiverAddress,
      senderAddress: this.senderAddress,
      email: this.email
    };

    this.http.post(url, body)
      .subscribe(data => {
          console.log(data);
          this.router.navigate(['/Successful_Email']);
        },
        err => {
          console.log('Error: ' + err.error);
          console.log('Name: ' + err.name);
          console.log('Message: ' + err.message);
          console.log('Status: ' + err.status);
        });
  }

  onInquiryTypeSelected(inquiryType: string) {
    this.inquirySelected = inquiryType;
  }

}
