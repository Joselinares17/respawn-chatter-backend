import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Genera el esquema automáticamente
      sortSchema: true,
    }),
  ],
})
export class GraphqlModule {}
