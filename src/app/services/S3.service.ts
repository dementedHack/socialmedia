import * as AWS from "aws-sdk";
import {Subject} from "rxjs/Subject";

export class S3Service {
  constructor() {}
  objectsRemovedFromS3 = new Subject();
  getS3ObjectsList(bucket, objectFolder) {
    var s3Objects = [];
    const s3ObjectsReceived = new Subject();
    AWS.config.update({
      region: 'us-west-1',
      accessKeyId: 'AKIAJWWRX5JPSGLU3W3A',
      secretAccessKey: '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'
    });
    const s3 = new AWS.S3({
      apiVersion: '2006-03-01'
    });
    var listParams = {
      Bucket: bucket,
      Prefix: objectFolder + '/'
      };
    s3.listObjects(listParams, (err, data) => {
      if (err) {
        console.log(err);
      } else if (data) {
        console.log(data);
        for (var i = 0; i < data.Contents.length; i++) {
          s3Objects.push({Key: data.Contents[i].Key});
        }
        s3ObjectsReceived.next(s3Objects);
      }
    });
    return new Promise((resolve, reject) => {
      s3ObjectsReceived.subscribe(
        (data) => {
          if (data) {
            resolve(data);
          }
        }
      );
    });
  }
  deleteS3Objects(itemsToDelete, bucket) {
    const objectsSuccessfullyRemoved = new Subject();
    AWS.config.update({
      region: 'us-west-1',
      accessKeyId: 'AKIAJWWRX5JPSGLU3W3A',
      secretAccessKey: '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'
    });
    const s3 = new AWS.S3({
      apiVersion: '2006-03-01'
    });
    var params = {
      Bucket: bucket,
      Delete: {
        Objects: itemsToDelete
      }
    };
    console.log(itemsToDelete, bucket);
    s3.deleteObjects(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        objectsSuccessfullyRemoved.next(true);
      }
    });
    return new Promise((resolve, reject) => {
      objectsSuccessfullyRemoved.subscribe(
        (data) => {
          if (data) {
            resolve(data);
          }
        }
      );
    });
  }
}
