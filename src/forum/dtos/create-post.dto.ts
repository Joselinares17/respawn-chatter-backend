export class CreatePostDto {
  readonly title: string;
  readonly content: string;
  readonly author: string;
  readonly authorAvatar: string;
  readonly tags?: string[];
}
