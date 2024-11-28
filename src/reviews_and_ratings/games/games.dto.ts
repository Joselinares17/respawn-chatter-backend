export class GameDto {
    readonly title: string;
    readonly releaseYear: number;
    readonly platforms: string[];
    readonly genre: string[];
    readonly image?: string;
    readonly createdAt: Date;
  }  