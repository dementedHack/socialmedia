export class Comment {
  constructor(
              public body: string, // This is the files display name - typically a friendly and readable format
              public timestamp: string, // The URI defines the complete location of the resource
              public owner: string,
              likes: number,
              dislikes: number
  ) {}
}
