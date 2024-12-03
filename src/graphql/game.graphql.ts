import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class GameGraphQL {
  @Field(() => ID)
  _id: string; // El campo _id como ID, que es un tipo especial en GraphQL

  @Field()
  title: string;

  @Field(() => Int)
  releaseYear: number;

  @Field(() => [String])
  genre: string[];

  @Field(() => [String])
  platforms: string[];

  @Field(() => Date)
  createdAt: Date;

  @Field({ nullable: true })
  image?: string;
}