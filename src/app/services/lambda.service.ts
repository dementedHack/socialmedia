import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()

export class LambdaService {
  constructor(private http: Http) {}
  callLambda(URI) {
    const data = {key: URI}
    console.log(data);
    return this.http.post('https://jajo74j11a.execute-api.us-west-1.amazonaws.com/dev/upload-video', data);
  }
}
