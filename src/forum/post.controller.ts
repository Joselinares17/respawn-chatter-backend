import { Controller, Get, Post, Body, Param, Patch,
  HttpException, HttpStatus } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateReplyDto } from './dtos/create-reply.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 1. Crear un nuevo post
  @Post()
  async createPost(
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('tags') tags: string[],
  ) {
    const result = await this.postService.createPost(title, content, tags);

    if (result.error) {
      // Lanzar un error con mensaje personalizado para el usuario
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: result.error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Retornar el post creado si todo es correcto
    return {
      message: 'Post creado exitosamente.',
      post: result.post,
    };
  }

  // 2. Obtener todos los posts
  @Get()
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  // 3. Obtener un post por ID
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  // 4. Añadir un comentario a un post
  //TODO: Arreglar el tipo del createComment(x, [y]) 
  @Post(':postId/comments')
  async addComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postService.createComment(postId, createCommentDto);
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
    return this.postService.addReply(commentId, createReplyDto);
  }

  // 6. Incrementar vistas de un post
  @Patch(':id/views')
  async incrementViews(@Param('id') id: string) {
    return this.postService.incrementViews(id);
  }
}
