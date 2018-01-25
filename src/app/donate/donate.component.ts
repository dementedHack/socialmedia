import { Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";
import {Http} from "@angular/http";

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {
  donationAmount = 0.00;
  lambdaFunctionEndpoint = 'https://jajo74j11a.execute-api.us-west-1.amazonaws.com/dev';
  constructor(private http: Http) { }

  ngOnInit() {
    console.log(this.donationAmount);
  }
  openCheckout() {
    const handler = (<any>window).StripeCheckout.configure({
      key: environment.stripeKey,
      locale: 'auto',
      token: (token: any) => {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        const data = {token: token.id};
        console.log('Completed! Token is ' + Object.values(data));
        return this.http.post(this.lambdaFunctionEndpoint, data);
      }
    });
    handler.open({
      name: 'Best Porn Channel',
      description: 'We appreciate your help!',
      amount: [this.donationAmount * 100]
    });
  }
}
