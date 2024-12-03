import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsInt, IsArray, IsOptional } from 'class-validator';

@InputType()
export class GameDto {
  @Field()
  @IsString()
  readonly title: string;

  @Field()
  @IsInt()
  readonly releaseYear: number;

  @Field(() => [String])
  @IsArray()
  readonly platforms: string[];

  @Field(() => [String])
  @IsArray()
  readonly genre: string[];


  @Field({ nullable: true }) // Campo opcional en el esquema GraphQL
  @IsOptional() // El campo es opcional en el DTO
  @IsString() // Validación para asegurarse de que sea una cadena
  readonly image?: string;

  @Field()
  readonly createdAt: Date;
  }  