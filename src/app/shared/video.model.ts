export class Video {
  constructor(public title: string, // This is the files display name - typically a friendly and readable format
              public URI: string, // The URI defines the complete location of the resource
              public fileContent: File,
              public categories: {},
              public tags: {},
              public talent: {},
              public mediaType: string,
              public fileExtension: string,
              public fileName: string, // the file name that is stored on S3
              public timeUploaded: string,
              public thumbnail,
              public likes: number,
              public dislikes: number,
              public views: number
  ) {}
}
