import { Controller, Get, Post, Body, Param, Patch, Delete,
  HttpException, HttpStatus } from '@nestjs/common';
import { PostService } from './post.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateReplyDto } from './dtos/create-reply.dto';
import { Throttle, ThrottlerModuleOptions } from '@nestjs/throttler';


@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 1. Crear un nuevo post
  @Post()
  async createPost(
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('tags') tags: string[],
    @Body('author') author: string,
    @Body('authorAvatar') authorAvatar: string,
  ) {
    const result = await this.postService.createPost(title, content, tags, author, authorAvatar);
  
    if (result.error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: result.error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  
    return {
      message: 'Post creado exitosamente.',
      post: result.post,
    };
  }
  
  // 2. Obtener todos los posts
  @Get()
  //@Throttle({ default: { limit: 3, ttl: 60000 } })
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  // 3. Obtener un post por ID
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  // 4. Añadir un comentario a un post
  @Post(':postId/comments')
  async addComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const result = await this.postService.createComment(postId, createCommentDto);

    if (result.error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: result.error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Comment creado exitosamente.',
      post: result.comment,
    };
  }

  // 4.1 Obtener una lista de todos los comentarios referidos a un post
  @Get(':postId/allComments')
  async getCommentsById(
    @Param('postId') postId: string
  ) {
    return this.postService.getAllCommentsByPost(postId);
  }

  // 5. Añadir una respuesta a un comentario
  @Post(':postId/comments/:commentId/replies')
  async addReply(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    const result = await this.postService.createReply(commentId, createReplyDto);

    if (result.error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: result.error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Reply creado exitosamente.',
      post: result.reply,
    };
  }

  // 6. Incrementar vistas de un post
  @Patch(':id/views')
  async incrementViews(@Param('id') id: string) {
    return this.postService.incrementViews(id);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    const result = await this.postService.deletePost(id);

    if (result.error) {
      throw new HttpException( 
        { 
          status: HttpStatus.BAD_REQUEST, 
          error: result.error, 
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Post eliminado exitosamente',
    };
  }

  @Delete(':postId/comments/:commentId')
  async deleteComment(@Param('postId') postId: string, @Param('commentId') commentId: string) {
    const result = await this.postService.deleteComment(postId, commentId);

    if (result.error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: result.error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Comentario eliminado exitosamente.',
    };
  }

  @Delete(':postId/comments/:commentId/replies/:replyId')
  async deleteReply(@Param('postId') postId: string, @Param('commentId') commentId: string, @Param('replyId') replyId: string) {
    const result = await this.postService.deleteReply(commentId, replyId);

    if (result.error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: result.error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Respuesta eliminada exitosamente.',
    };
  }
}
