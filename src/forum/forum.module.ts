import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { AzureContentSafetyService } from './azure-content-safety.service';
import { ContentModerationService } from './content-moderation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ], 'forum'), // Asegúrate de especificar el connectionName 'forum' si tienes múltiples conexiones
  ],
  controllers: [PostController],
  providers: [PostService, AzureContentSafetyService, ContentModerationService],
  exports: [PostService], // Exporta el servicio si se usa en otros módulos
})
export class ForumModule {}
