export class CreateReplyDto {
  readonly content: string;
  readonly author: string;
  readonly votes: number = 0;
}
